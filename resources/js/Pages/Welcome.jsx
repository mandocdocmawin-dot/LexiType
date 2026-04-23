import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import axios from 'axios';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // --- TYPING ENGINE STATES ---
    const [words, setWords] = useState([]);
    const [typedWords, setTypedWords] = useState([]); 
    const [currentInput, setCurrentInput] = useState('');
    const [status, setStatus] = useState('waiting'); 
    
    // --- METRICS ---
    const [timeLeft, setTimeLeft] = useState(60);
    const [duration, setDuration] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [mistakes, setMistakes] = useState(0);
    const [mistakeDetails, setMistakeDetails] = useState([]);

    // --- NEW STATES FOR CONFIGURATION BAR ---
    const [activeCategory, setActiveCategory] = useState('snippet');
    const [activeDifficulty, setActiveDifficulty] = useState(2); 
    const [showFocusHint, setShowFocusHint] = useState(true);

    // Function to fetch text from the backend without reloading the page
    const changeGameMode = async (newCategory, newDifficulty) => {
        setActiveCategory(newCategory);

        let dbCategory = 'paragraphs';
        if (newCategory === 'snippet') dbCategory = 'code_snippets';
        if (newCategory === 'quote') dbCategory = 'quotes';

        // Helper to convert label -> int
        const labelToInt = (label) => {
            if (!label && label !== 0) return null;
            const lower = String(label).toLowerCase();
            if (lower === 'easy') return 1;
            if (lower === 'medium') return 2;
            if (lower === 'hard') return 3;
            const n = parseInt(label);
            return Number.isNaN(n) ? null : n;
        };

        try {
            // First ask the backend which difficulties exist for this category
            const diffsResp = await axios.get('/typing-texts/difficulties', {
                params: { category: dbCategory },
                withCredentials: true,
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
            });

            const available = diffsResp.data?.available || [];
            const availableInts = available.map(labelToInt).filter(Boolean);

            if (availableInts.length === 0) {
                alert('Walang available na text para sa napiling kategorya.');
                return;
            }

            const desiredInt = labelToInt(newDifficulty) || parseInt(newDifficulty) || 2;

            // If desired isn't available, pick the closest available difficulty
            let targetDifficulty = desiredInt;
            if (!availableInts.includes(desiredInt)) {
                let closest = availableInts[0];
                let minDiff = Math.abs(closest - desiredInt);
                for (const ai of availableInts) {
                    const d = Math.abs(ai - desiredInt);
                    if (d < minDiff) {
                        closest = ai;
                        minDiff = d;
                    }
                }
                targetDifficulty = closest;
            }

            // Update UI difficulty to reflect what we'll actually request
            setActiveDifficulty(targetDifficulty);

            // Map difficulty -> duration (seconds)
            const diffToSeconds = (di) => {
                if (di === 1) return 30;
                if (di === 2) return 60;
                if (di === 3) return 120;
                return 60;
            };
            const durationSeconds = diffToSeconds(targetDifficulty);
            setDuration(durationSeconds);

            // Now request a random text using the chosen difficulty
            const response = await axios.get('/typing-texts/random', {
                params: { category: dbCategory, difficulty_level: targetDifficulty },
                withCredentials: true,
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
            });

            if (response.data && response.data.data) {
                const fetchedText = response.data.data.content;
                setWords(fetchedText.trim().split(/\s+/));
                setTypedWords([]);
                setCurrentInput('');
                setStatus('waiting');
                setMistakes(0);
                setTimeLeft(durationSeconds);
            }
        } catch (error) {
            console.error('Error fetching text:', error);
            alert('Walang nahanap na text para sa category at difficulty na ito. Siguraduhing may laman ang database.');
        }
    };

    // Cache lists of texts per category+difficulty for deterministic cycling
    const [textsCache, setTextsCache] = useState({});

    const uiToDbCategory = (cat) => {
        if (cat === 'snippet') return 'code_snippets';
        if (cat === 'quote') return 'quotes';
        return 'paragraphs';
    };

    // Cycle to the next text for (category, difficulty). Loops back to first when at the end.
    const cycleGameMode = async (newCategory, newDifficulty) => {
        setActiveCategory(newCategory);

        const dbCategory = uiToDbCategory(newCategory);
        const key = `${dbCategory}_${newDifficulty}`;

        let cache = textsCache[key];

        if (!cache) {
            try {
                const listResp = await axios.get('/typing-texts/list', {
                    params: { category: dbCategory, difficulty_level: newDifficulty },
                    withCredentials: true,
                    headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
                });

                const list = listResp.data?.data || [];
                if (!Array.isArray(list) || list.length === 0) {
                    alert('No texts available for this category/difficulty.');
                    return;
                }

                cache = { list, index: -1 };
                setTextsCache(prev => ({ ...prev, [key]: cache }));
            } catch (error) {
                console.error('Error fetching texts list:', error);
                alert('Failed to fetch texts for cycling.');
                return;
            }
        }

        const len = cache.list.length;
        const nextIndex = (cache.index + 1) % len;
        const textObj = cache.list[nextIndex];

        // Update cache index
        setTextsCache(prev => ({ ...prev, [key]: { list: cache.list, index: nextIndex } }));

        const diffToSeconds = (di) => {
            if (di === 1) return 30;
            if (di === 2) return 60;
            if (di === 3) return 120;
            return 60;
        };

        const durationSeconds = diffToSeconds(newDifficulty);
        setActiveDifficulty(newDifficulty);
        setDuration(durationSeconds);

        if (textObj && textObj.content) {
            setWords(textObj.content.trim().split(/\s+/));
            setTypedWords([]);
            setCurrentInput('');
            setStatus('waiting');
            setMistakes(0);
            setTimeLeft(durationSeconds);
        } else {
            alert('Selected text is invalid.');
        }
    };

    // Automatically fetch text on page load
    useEffect(() => {
        changeGameMode('snippet', 2);
    }, []);

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const lastKeystrokeTime = useRef(Date.now());
    const isTabPressed = useRef(false);
    
    const wordsRef = useRef(words);
    const typedWordsRef = useRef(typedWords);
    const currentInputRef = useRef(currentInput);

    useEffect(() => { wordsRef.current = words; }, [words]);
    useEffect(() => { typedWordsRef.current = typedWords; }, [typedWords]);
    useEffect(() => { currentInputRef.current = currentInput; }, [currentInput]);

    // Global Typing Focus (only on explicit activation)
    useEffect(() => {
        const handleGlobalClick = () => {
            if (status === 'finished') return;
            if (inputRef.current) {
                inputRef.current.focus();
                setShowFocusHint(false);
            }
        };

        const handleGlobalKeydown = (e) => {
            if (status === 'finished') return;
            const key = e.key;
            
            const isPrintable = key.length === 1;
            if (!isPrintable) return;

            // If the hidden input already has focus, let its handler deal with the key
            if (document.activeElement === inputRef.current) return;

            // Otherwise, focus the input and manually process the printable character
            if (inputRef.current) {
                inputRef.current.focus();
                setShowFocusHint(false);

                // Start the timer if we're waiting
                if (status === 'waiting') setTimeout(() => setStatus('typing'), 0);

                // Manually append the key into the input state and update mistake tracking
                const now = Date.now();
                const timeToPress = now - lastKeystrokeTime.current;
                lastKeystrokeTime.current = now;

                const prevInput = currentInputRef.current || '';
                const nextInput = prevInput + key;

                const currentWordIndex = typedWordsRef.current.length;
                const targetWord = wordsRef.current[currentWordIndex];

                if (targetWord && nextInput.length > targetWord.length) {
                    e.preventDefault();
                    return;
                }

                setCurrentInput((prev) => prev + key);

                if (targetWord && nextInput[nextInput.length - 1] !== targetWord[nextInput.length - 1]) {
                    setMistakes((prev) => prev + 1);
                    setMistakeDetails((prev) => [...prev, {
                        expected_character: targetWord[nextInput.length - 1],
                        typed_char: key,
                        time_to_press_ms: timeToPress
                    }]);
                }

                e.preventDefault();
            }
        };

        window.addEventListener('click', handleGlobalClick);
        window.addEventListener('keydown', handleGlobalKeydown);

        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleGlobalKeydown);
        };
    }, [status]); 

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

        // Track when Tab is pressed and prevent default (losing focus)
        if (e.key === 'Tab') {
            e.preventDefault();
            isTabPressed.current = true;
            return;
        }

        // Check if Enter is pressed WHILE Tab is held down
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (isTabPressed.current) {
                resetTest();
            }
            return;
        }

        // Start the timer only when the user types a printable character.
        // This prevents modifier keys (Alt/Tab/Ctrl/Meta) from accidentally starting the test.
        const isPrintable = e.key && e.key.length === 1;
        if (status === 'waiting' && isPrintable) {
            setStatus('typing');
        }

        const currentWordIndex = typedWords.length;
        const targetWord = words[currentWordIndex];

        // Move to the next word when Space is pressed
        if (e.key === ' ') {
            e.preventDefault(); 
            if (currentInput.trim().length > 0) {
                // Check for mistakes in the entire word before moving on
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
                setCurrentInput(currentInput.slice(0, -1));
            } 
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
        // If it's a regular letter, add to input and check immediately for mistakes
        else if (e.key.length === 1) {
            // Get the elapsed time before this key was pressed
            const now = Date.now();
            const timeToPress = now - lastKeystrokeTime.current;
            lastKeystrokeTime.current = now; 

            // Limit extra characters to targetWord.length + 5
            if (targetWord && currentInput.length >= targetWord.length + 0) {
                e.preventDefault();
                return;
            }

            const nextInput = currentInput + e.key;
            setCurrentInput(nextInput);
            
            // Real-time mistake tracking
            if (targetWord && nextInput[nextInput.length - 1] !== targetWord[nextInput.length - 1]) {
                setMistakes((prev) => prev + 1); 
                
                // NEW LOGIC: Record full details of the mistake
                setMistakeDetails((prev) => [...prev, {
                    expected_character: targetWord[nextInput.length - 1],
                    typed_char: e.key,
                    time_to_press_ms: timeToPress
                }]);
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

        const finalWpm = wpm; 
        const finalAccuracy = accuracy; 

        // [NEW LOGIC]: Check if Guest. If Guest, silently stop the save process.
        if (!auth.user) {
            return; 
        }

        // If it reaches here, it means a user is logged in. Let's save it!
        try {
            // Normalize difficulty label to backend convention: 'easy'|'medium'|'hard'
            const difficultyLabel = activeDifficulty === 1 ? 'easy' : (activeDifficulty === 3 ? 'hard' : 'medium');

            const response = await axios.post('/typing-sessions', {
                wpm_score: finalWpm,
                accuracy_percentage: finalAccuracy,
                duration_seconds: duration,
                difficulty_played: difficultyLabel,
                mistakes: mistakeDetails,
            }, {
                withCredentials: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to save session:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (status === 'finished') return;
        if (words.length === 0) return;

        if (typedWords.length >= words.length) {
            handleFinish();
            return;
        }

            if (typedWords.length === words.length - 1 && currentInput.trim() === words[words.length - 1]) {
                handleFinish();
            }
        }, [typedWords, currentInput, words, status]);
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
        setMistakeDetails([]); // Clear the list of mistakes
        setShowFocusHint(true);
        lastKeystrokeTime.current = Date.now(); // Reset the time tracker
        isTabPressed.current = false;

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

            <style dangerouslySetInnerHTML={{
                __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                    .caret-custom {
                        width: 2px;
                        height: 1em;
                        background-color: #bbc3ff;
                        box-shadow: 0 0 8px #3d5afe;
                        display: inline-block;
                        vertical-align: middle;
                        transform: translateY(-0.12em);
                    }
                `
            }} />

            <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative dark">
                
                <Navbar auth={auth} />

                <main className="min-h-screen flex flex-col justify-center items-center px-6 pt-20">
                    
                    <div className={`mb-12 flex justify-center transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center gap-8 bg-[#131b2e]/50 px-8 py-3 rounded-full border border-[#444656]/20 shadow-sm">
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => changeGameMode('snippet', activeDifficulty)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeCategory === 'snippet' ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    snippet
                                </button>
                                <button 
                                    onClick={() => changeGameMode('words', activeDifficulty)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeCategory === 'words' ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    words
                                </button>
                                <button 
                                    onClick={() => changeGameMode('quote', activeDifficulty)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeCategory === 'quote' ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    quote
                                </button>
                            </div>
                            
                            <div className="w-px h-4 bg-[#444656]/50"></div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => cycleGameMode(activeCategory, 1)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeDifficulty === 1 ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    easy
                                </button>
                                <button 
                                    onClick={() => cycleGameMode(activeCategory, 2)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeDifficulty === 2 ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    normal
                                </button>
                                <button 
                                    onClick={() => cycleGameMode(activeCategory, 3)}
                                    className={`text-xs font-headline font-bold tracking-widest transition-colors hover:text-[#dae2fd] ${activeDifficulty === 3 ? 'text-[#bbc3ff]' : 'text-[#8e8fa2]'}`}>
                                    hard
                                </button>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="relative w-full max-w-5xl bg-[#060e20] rounded-2xl p-8 md:p-12 overflow-hidden group cursor-text"
                    >
                        <div className="absolute top-4 right-8 font-headline text-2xl font-bold text-[#3d5afe] opacity-50">
                            {timeLeft}s
                        </div>

                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3d5afe]/5 blur-[120px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 text-2xl md:text-3xl font-body leading-relaxed tracking-wide text-justify select-none flex flex-wrap gap-x-[0.3em] gap-y-2">
    
                            {words.length === 0 ? (
                                <span className="text-white/30">Loading text...</span>
                            ) : (
                                words.map((word, wordIdx) => {
                                    const isCurrentWord = wordIdx === typedWords.length;
                                    const isPastWord = wordIdx < typedWords.length;
                                    const typedWord = typedWords[wordIdx];
                                    
                                    return (
                                        <span key={wordIdx} className="relative inline-block">
                                            {/* caret before first char */}
                                            {isCurrentWord && status !== 'finished' && currentInput.length === 0 && (
                                                <span className="caret-custom inline-block align-middle" aria-hidden="true"></span>
                                            )}

                                            {word.split('').map((char, charIdx) => {
                                                let colorClass = "text-white/20";

                                                if (isPastWord) {
                                                    colorClass = (typedWord && typedWord[charIdx] === char) 
                                                        ? "text-[#a37c58]"
                                                        : "text-red-500 bg-red-500/10 rounded-sm";
                                                } else if (isCurrentWord) {
                                                    if (charIdx < currentInput.length) {
                                                        colorClass = currentInput[charIdx] === char 
                                                            ? "text-[#a37c58]"
                                                            : "text-red-400 bg-red-400/10 rounded-sm";
                                                    }
                                                }

                                                return (
                                                    <React.Fragment key={charIdx}>
                                                        <span className={colorClass}>{char}</span>
                                                        {/* caret inserted after the character at the current index */}
                                                        {isCurrentWord && status !== 'finished' && charIdx === currentInput.length - 1 && (
                                                            <span className="caret-custom inline-block align-middle" aria-hidden="true"></span>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}

                                            {isCurrentWord && currentInput.length > word.length && (
                                                <span className="text-red-500 bg-red-500/20 rounded-sm opacity-80">
                                                    {currentInput.slice(word.length)}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })
                            )}

                        </div>
                        
                        {showFocusHint && status !== 'typing' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="bg-[#0b1326]/80 text-white/70 px-4 py-2 rounded-md text-sm font-mono">Click here or press any key to focus</div>
                            </div>
                        )}

                        <input
                            ref={inputRef}
                            className="absolute inset-0 opacity-0 cursor-default"
                            type="text"
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                            onFocus={() => setShowFocusHint(false)}
                            onBlur={() => { if (status !== 'typing') setShowFocusHint(true); }}
                            disabled={status === 'finished'}
                        />
                    </div>

                    <div className={`mt-12 flex items-center justify-center gap-3 text-[#64748b] font-medium transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">tab</span>
                        <span className="text-xs font-semibold">+</span>
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">enter</span>
                        <span className="text-[13px] ml-2">to restart session</span>
                    </div>

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
                                                <Link href={route('register')} className="block w-full text-center py-4 bg-[#3d5afe] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform">Create Free Account</Link>
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
                            <div className="mt-12 flex flex-col items-center gap-3 md:flex-row md:justify-center">
                                <button 
                                    onClick={resetTest} 
                                    className="w-full md:w-auto px-6 py-3 bg-[#3d5afe] text-white font-semibold rounded-lg hover:scale-[1.02] transition-transform"
                                >
                                    Restart test
                                </button>
                                <button 
                                    onClick={() => cycleGameMode(activeCategory, activeDifficulty)} 
                                    className="w-full md:w-auto px-6 py-3 border border-[#3d5afe] text-[#3d5afe] font-semibold rounded-lg hover:bg-[#3d5afe]/10 transition-colors"
                                >
                                    Next text
                                </button>
                            </div>
                        </div>
                    )}
                </main>

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

                <div className={`fixed bottom-4 left-4 text-xs font-body text-white/30 transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    Laravel v{laravelVersion} | PHP v{phpVersion}
                </div>
            </div>
        </>
    );
}