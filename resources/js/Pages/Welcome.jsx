import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';

const sampleText = "The quick brown fox jumps over the lazy dog while the sun sets behind the jagged mountains. Precision is the bridge between intent and execution, a silent rhythm born from calculated keystrokes and the steady cadence of an undisturbed mind.";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // --- TYPING ENGINE STATES ---
    const [words, setWords] = useState(sampleText.split(' '));
    const [typedWords, setTypedWords] = useState([]); // Array ng mga na-type na salita
    const [currentInput, setCurrentInput] = useState('');
    const [status, setStatus] = useState('waiting'); // waiting, typing, finished
    
    // --- METRICS ---
    const [timeLeft, setTimeLeft] = useState(15); // Default: 15 seconds
    const [duration] = useState(15); // Para maipasa sa backend kung anong duration ang nilaro
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [mistakes, setMistakes] = useState(0);

    // --- REFS ---
    const inputRef = useRef(null);
    const timerRef = useRef(null);
    
    const isTabPressed = useRef(false);

    // FIX 6: Global Typing Focus
    // Forces focus on the hidden input when the component mounts, and re-applies focus
    // if the user clicks anywhere on the screen or presses any key.
    useEffect(() => {
        const handleGlobalFocus = () => {
            if (status !== 'finished' && inputRef.current) {
                inputRef.current.focus();
            }
        };

        // Focus immediately on mount/render
        handleGlobalFocus();

        // Listen for global clicks and keystrokes to ensure focus is never lost
        window.addEventListener('click', handleGlobalFocus);
        window.addEventListener('keydown', handleGlobalFocus);

        return () => {
            window.removeEventListener('click', handleGlobalFocus);
            window.removeEventListener('keydown', handleGlobalFocus);
        };
    }, [status]); // Dependency on status so we don't trap focus when 'finished'

    // --- LOGIC: START TIMER ---
    useEffect(() => {
        if (status === 'typing' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && status === 'typing') {
            handleFinish();
        }

        return () => clearInterval(timerRef.current);
    }, [status, timeLeft]);

    // --- LOGIC: COMPUTE WPM & ACCURACY ---
    const computeStats = () => {
        const totalTypedChars = typedWords.join('').length + currentInput.length;
        const correctChars = totalTypedChars - mistakes;
        
        // WPM = (Correct Chars / 5) / (Time Elapsed in Minutes)
        const timeElapsedMin = (duration - timeLeft) / 60;
        const currentWpm = timeElapsedMin > 0 ? Math.round((correctChars / 5) / timeElapsedMin) : 0;
        
        const currentAcc = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;

        setWpm(currentWpm > 0 ? currentWpm : 0);
        setAccuracy(currentAcc > 0 ? currentAcc : 0);
    };

    // --- LOGIC: HANDLE KEYSTROKES ---
    const handleKeyDown = (e) => {
        if (status === 'finished') return;

        // Kung mag-uumpisa pa lang, i-start ang timer
        if (status === 'waiting') {
            setStatus('typing');
        }

        // Track when Tab is pressed and prevent default (losing focus)
        if (e.key === 'Tab') {
            e.preventDefault();
            isTabPressed.current = true;
            return;
        }

        // Check if Enter is pressed WHILE Tab is held down
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent accidental form submissions/scrolling
            if (isTabPressed.current) {
                resetTest();
            }
            return;
        }

        const currentWordIndex = typedWords.length;
        const targetWord = words[currentWordIndex];

        // Kapag pinindot ang Space, lumipat sa susunod na salita
        if (e.key === ' ') {
            e.preventDefault(); // Iwasan mag-scroll
            if (currentInput.trim().length > 0) {
                // I-check kung may mali sa buong salita bago lumipat
                if (currentInput.trim() !== targetWord) {
                     setMistakes((prev) => prev + Math.abs(targetWord.length - currentInput.trim().length));
                }
                setTypedWords([...typedWords, currentInput.trim()]);
                setCurrentInput('');
            }
        } 
        // Enhanced Backspace Logic
        else if (e.key === 'Backspace') {
            if (currentInput.length > 0) {
                // If there's text in the current word, just delete the last character
                setCurrentInput(currentInput.slice(0, -1));
            } 
            // FIX 5: Lock Correct Words
            // Only allow backspacing to the previous word if it was typed incorrectly
            else if (typedWords.length > 0) {
                const prevIndex = typedWords.length - 1;
                const previousTypedWord = typedWords[prevIndex];
                const previousTargetWord = words[prevIndex];

                if (previousTypedWord !== previousTargetWord) {
                    setTypedWords(typedWords.slice(0, -1));
                    setCurrentInput(previousTypedWord);
                }
            }
        } 
        // Kapag regular na letra, idagdag sa input at i-check kung mali agad
        else if (e.key.length === 1) {
            
            // Limit extra characters to targetWord.length + 5
            if (targetWord && currentInput.length >= targetWord.length + 0) {
                e.preventDefault();
                return; // Stop execution here, preventing new characters from being added
            }

            const nextInput = currentInput + e.key;
            setCurrentInput(nextInput);
            
            // Real-time mistake tracking (kung ang tinype ay hindi match sa target)
            if (targetWord && nextInput[nextInput.length - 1] !== targetWord[nextInput.length - 1]) {
                setMistakes((prev) => prev + 1);
            }
        }
    };

    // Reset the Tab pressed state when the key is released
    const handleKeyUp = (e) => {
        if (e.key === 'Tab') {
            isTabPressed.current = false;
        }
    };

    // Update stats real-time
    useEffect(() => {
        if (status === 'typing') computeStats();
    }, [currentInput, typedWords, timeLeft]);


    // --- LOGIC: FINISH AND SAVE TO DATABASE ---
    const handleFinish = async () => {
        clearInterval(timerRef.current);
        setStatus('finished');
        
        // Final computation bago ipasa
        computeStats(); 

        try {
            await axios.post('/typing-sessions', {
                wpm_score: wpm,
                accuracy_percentage: accuracy,
                duration_seconds: duration,
            });
            console.log('Session saved successfully!');
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    };

    // --- LOGIC: RESTART ---
    const resetTest = () => {
        clearInterval(timerRef.current);
        setStatus('waiting');
        setTimeLeft(duration);
        setTypedWords([]);
        setCurrentInput('');
        setWpm(0);
        setAccuracy(100);
        setMistakes(0);
        isTabPressed.current = false; // Reset the shortcut state just in case
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <>
            <Head title="LexiType | High Performance Typing">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
                    rel="stylesheet" 
                />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
                    rel="stylesheet" 
                />
            </Head>

            {/* Custom Styles Injection */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                    .caret-custom {
                        width: 2px;
                        height: 1.5rem;
                        background-color: #bbc3ff;
                        box-shadow: 0 0 8px #3d5afe;
                        display: inline-block;
                        vertical-align: middle;
                    }
                `
            }} />

            {/* Main Application Wrapper */}
            <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative dark">
                
                {/* Extracted Navbar Component with auth prop passed down */}
                <Navbar auth={auth} />

                <main className="min-h-screen flex flex-col justify-center items-center px-6 pt-20">
                    
                    {/* FIX 7: Distraction-Free Mode applied to Configuration Bar */}
                    <div className={`mb-12 flex justify-center transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center gap-8 bg-[#131b2e]/50 px-8 py-3 rounded-full border border-[#444656]/20 shadow-sm">
                            {/* Mode Select */}
                            <div className="flex items-center gap-4">
                                <button className="text-xs font-headline font-bold tracking-widest text-[#bbc3ff] transition-colors hover:text-[#dae2fd]">snippet</button>
                                <button className="text-xs font-headline font-bold tracking-widest text-[#8e8fa2] transition-colors hover:text-[#dae2fd]">words</button>
                                <button className="text-xs font-headline font-bold tracking-widest text-[#8e8fa2] transition-colors hover:text-[#dae2fd]">quote</button>
                            </div>
                            
                            <div className="w-px h-4 bg-[#444656]/50"></div>
                            
                            {/* Difficulty */}
                            <div className="flex items-center gap-4">
                                <button className="text-xs font-headline font-bold tracking-widest text-[#8e8fa2] transition-colors hover:text-[#dae2fd]">easy</button>
                                <button className="text-xs font-headline font-bold tracking-widest text-[#bbc3ff] transition-colors hover:text-[#dae2fd]">normal</button>
                                <button className="text-xs font-headline font-bold tracking-widest text-[#8e8fa2] transition-colors hover:text-[#dae2fd]">hard</button>
                            </div>
                        </div>
                    </div>

                    {/* Typing Arena */}
                    <div 
                        className="relative w-full max-w-5xl bg-[#060e20] rounded-2xl p-8 md:p-12 overflow-hidden group cursor-text"
                    >
                        {/* Timer Display */}
                        <div className="absolute top-4 right-8 font-headline text-2xl font-bold text-[#3d5afe] opacity-50">
                            {timeLeft}s
                        </div>

                        {/* Asymmetric background glow */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3d5afe]/5 blur-[120px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 text-2xl md:text-3xl font-body leading-relaxed tracking-wide text-justify select-none flex flex-wrap gap-x-[0.3em] gap-y-2">
                            {words.map((word, wordIdx) => {
                                const isCurrentWord = wordIdx === typedWords.length;
                                const isPastWord = wordIdx < typedWords.length;
                                const typedWord = typedWords[wordIdx];
                                
                                return (
                                    <span key={wordIdx} className="relative block">
                                        {/* I-render ang bawat letra ng salita */}
                                        {word.split('').map((char, charIdx) => {
                                            let colorClass = "text-white/20"; // Default (Hindi pa na-type)
                                            
                                            // Update visual feedback colors
                                            if (isPastWord) {
                                                // Nakaraang salita
                                                colorClass = (typedWord && typedWord[charIdx] === char) 
                                                    ? "text-[#a37c58] font-bold" // Distinct highlight for correct characters
                                                    : "text-red-500 bg-red-500/10 rounded-sm"; // Mali
                                            } else if (isCurrentWord) {
                                                // Kasalukuyang salita
                                                if (charIdx < currentInput.length) {
                                                    colorClass = currentInput[charIdx] === char 
                                                        ? "text-[#a37c58] font-bold" // Distinct highlight for correct characters
                                                        : "text-red-400 bg-red-400/10 rounded-sm";
                                                }
                                            }

                                            return (
                                                <span key={charIdx} className={colorClass}>
                                                    {char}
                                                </span>
                                            );
                                        })}
                                        
                                        {/* Extra na mga maling letra na tinype na wala sa original word */}
                                        {isCurrentWord && currentInput.length > word.length && (
                                            <span className="text-red-500 bg-red-500/20 rounded-sm opacity-80">
                                                {currentInput.slice(word.length)}
                                            </span>
                                        )}
                                        
                                        {/* Caret (Blinking cursor) */}
                                        {isCurrentWord && status !== 'finished' && (
                                            <span 
                                                className="absolute bottom-1 -translate-x-0.5 caret-custom"
                                                style={{ left: `${Math.min(currentInput.length, word.length) * 0.6}em` }} // Approximation lang ito ng position
                                            ></span>
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                        
                        {/* Focus Hidden Input */}
                        <input 
                            ref={inputRef}
                            autoFocus 
                            className="absolute inset-0 opacity-0 cursor-default" 
                            type="text" 
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp} 
                            disabled={status === 'finished'}
                        />
                    </div>

                    {/* FIX 7: Distraction-Free Mode applied to Footer Hint */}
                    <div className={`mt-12 flex items-center justify-center gap-3 text-[#64748b] font-medium transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">tab</span>
                        <span className="text-xs font-semibold">+</span>
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">enter</span>
                        <span className="text-[13px] ml-2">to restart session</span>
                    </div>

                    {/* Post-Test State */}
                    {status === 'finished' && (
                        <div className="fixed inset-0 z-50 bg-[#0b1326]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
                            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="font-headline text-5xl font-bold tracking-tight">Session Complete.</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#131b2e] p-8 rounded-2xl">
                                            <p className="text-xs font-semibold text-[#8e8fa2] mb-2 uppercase tracking-widest">Speed</p>
                                            <p className="font-headline text-6xl font-bold">{wpm}<span className="text-xl font-normal text-[#8e8fa2] ml-2">wpm</span></p>
                                        </div>
                                        <div className="bg-[#131b2e] p-8 rounded-2xl">
                                            <p className="text-xs font-semibold text-[#3d5afe] mb-2 uppercase tracking-widest">Accuracy</p>
                                            <p className="font-headline text-6xl font-bold">{accuracy}<span className="text-xl font-normal text-[#8e8fa2] ml-2">%</span></p>
                                        </div>
                                    </div>
                                    {!auth?.user && (
                                        <div className="bg-primary-container p-1 rounded-2xl bg-gradient-to-br from-[#3d5afe] to-[#bbc3ff]">
                                            <div className="bg-[#0b1326] p-8 rounded-xl">
                                                <p className="text-lg font-medium mb-4">Sign up to save your stats & unlock AI insights</p>
                                                <button className="w-full py-4 bg-[#3d5afe] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform">Create Free Account</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative h-[400px] bg-[#131b2e] rounded-3xl overflow-hidden">
                                    <img 
                                        className="w-full h-full object-cover mix-blend-luminosity opacity-40" 
                                        alt="abstract high-tech visualization" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ3vI7yZOcnrrFReCx9pW-6g46iEVApOZhvKXkxrNEsgnR_cYIhF_qqEOYqVXG8KO8hhPgb7FGNtpAYnKPLW_GQMEsX6KZK5aHxvwOangRTbGx6brMKXAuVeyQv_eGobwvour8VNAZha4eRc6siFVpc3dTM_XxI4ZlFR_PaR7zUd3fSp1Eb1geXE1URNViU0GcKihxScWkxDrCinHj5Bd9BORoueew9IfuZ0tbtJzB54h5foVi-8zQc1IFjBsT06Kk6HuCu4P7RnM" 
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-[#0b1326] to-transparent">
                                        <p className="font-headline text-2xl font-bold">The AI Coach is waiting.</p>
                                        <p className="text-[#8e8fa2] mt-2">Analyze your finger heatmaps and cadence bottlenecks.</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={resetTest} 
                                className="mt-12 text-[#8e8fa2] hover:text-white underline underline-offset-4 transition-colors"
                            >
                                Maybe later, restart test
                            </button>
                        </div>
                    )}
                </main>

                {/* FIX 7: Distraction-Free Mode applied to SideNavBar / AI Coach Widget */}
                <div className={`fixed bottom-8 right-8 z-50 group transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="absolute bottom-full right-0 mb-4 w-64 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        <div className="bg-[#131b2e]/90 backdrop-blur-xl p-4 rounded-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] border border-white/10">
                            <p className="text-sm font-medium text-white mb-1">Log in to chat with your AI Coach!</p>
                            <p className="text-xs text-[#8e8fa2]">Get personalized feedback on your typing cadence and posture.</p>
                        </div>
                        <div className="w-3 h-3 bg-[#131b2e]/90 rotate-45 absolute -bottom-1.5 right-6 border-r border-b border-white/10"></div>
                    </div>
                    <div className="bg-[#131b2e]/70 backdrop-blur-xl rounded-xl w-16 h-16 shadow-[0px_20px_40px_rgba(6,14,32,0.4)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            <span className="text-[10px] font-semibold font-body tracking-wider mt-1">LexiType</span>
                        </div>
                    </div>
                </div>

                {/* FIX 7: Distraction-Free Mode applied to Outputting framework versions dynamically */}
                <div className={`fixed bottom-4 left-4 text-xs font-body text-white/30 transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    Laravel v{laravelVersion} | PHP v{phpVersion}
                </div>
            </div>
        </>
    );
}