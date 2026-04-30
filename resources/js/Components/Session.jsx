import React from 'react';
import { Link } from '@inertiajs/react';

export default function Session({ 
    wpm, 
    accuracy, 
    auth, 
    resetTest, 
    cycleGameMode, 
    activeCategory, 
    activeDifficulty,
    // --- NEW DYNAMIC PROPS ---
    aiInsightText,
    troubleKey,
    maxStreak
}) {
    // Determine if the user played perfectly (no trouble key)
    const playedPerfectly = !troubleKey;

    return (
        <div className="fixed inset-0 z-50 bg-[#0b1326]/95 backdrop-blur-xl overflow-y-auto flex items-center justify-center p-4">
            <main className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
                <div className="w-full mb-10 text-center md:text-left">
                    <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tighter text-[#dae2fd] mb-2">
                        Session Complete
                    </h1>
                    <p className="font-body text-[#c5c5d9] text-lg">
                        Flow State: <span className="text-[#4edea3] font-medium">Achieved</span>
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* WPM and Accuracy Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#131b2e] rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#222a3d] transition-colors duration-300">
                                <span className="font-label text-sm text-[#c5c5d9] uppercase tracking-[0.1em] mb-2 z-10">Words Per Minute</span>
                                <div className="flex items-baseline gap-2 z-10">
                                    <span className="font-display text-7xl md:text-8xl font-bold text-[#4edea3] tracking-tighter">{wpm}</span>
                                    <span className="font-label text-[#c5c5d9] text-lg">wpm</span>
                                </div>
                            </div>
                            <div className="bg-[#131b2e] rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#222a3d] transition-colors duration-300">
                                <span className="font-label text-sm text-[#c5c5d9] uppercase tracking-[0.1em] mb-2 z-10">Accuracy</span>
                                <div className="flex items-baseline z-10">
                                    <span className="font-display text-7xl md:text-8xl font-bold text-[#bbc3ff] tracking-tighter">{accuracy}</span>
                                    <span className="font-display text-4xl text-[#bbc3ff]">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Sign up prompt for Unauthenticated Users */}
                        {!auth?.user && (
                            <div className="bg-gradient-to-br from-[#3d5afe] to-[#bbc3ff] p-[1px] rounded-2xl">
                                <div className="bg-[#0b1326] p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-xl font-medium text-[#dae2fd] mb-2">Sign up to save your stats & unlock AI insights</p>
                                        <p className="text-[#c5c5d9]">Track your progress over time, analyze bottlenecks, and improve faster.</p>
                                    </div>
                                    <Link href={route('register')} className="shrink-0 px-8 py-4 bg-[#3d5afe] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform">
                                        Create Free Account
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        {/* WPM Trend Chart (Simplified placeholder for structural layout) */}
                        <div className="bg-[#131b2e] rounded-lg p-8 flex-grow flex flex-col hidden md:flex">
                            <h2 className="font-display text-xl font-medium text-[#dae2fd] mb-8">Speed Consistency</h2>
                            <div className="relative w-full flex-grow min-h-[200px] flex items-end justify-between gap-1">
                                {/* Bar chart placeholder items */}
                                <div className="relative z-10 w-full bg-[#bbc3ff]/30 h-[80%] rounded-t-sm"></div>
                                <div className="relative z-10 w-full bg-[#bbc3ff]/50 h-[100%] rounded-t-sm"></div>
                                <div className="relative z-10 w-full bg-[#bbc3ff]/40 h-[90%] rounded-t-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* --- DYNAMIC AI COACH INSIGHTS --- */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-[#131b2e]/70 backdrop-blur-[20px] rounded-xl p-6 shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-[#444656]/15 relative overflow-hidden flex flex-col">
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#3d5afe]/20 rounded-full blur-[40px] pointer-events-none"></div>
                            
                            <div className="flex items-center gap-4 mb-5 relative z-10">
                                <div className="relative flex items-center justify-center w-12 h-12">
                                    <div className="absolute inset-0 bg-[#bbc3ff]/20 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative bg-[#222a3d] w-full h-full rounded-full flex items-center justify-center border border-[#444656]/30">
                                        <span className="material-symbols-outlined text-[#bbc3ff] text-xl">psychology</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-medium text-[#dae2fd]">LexiType Coach Insights</h3>
                                    <p className="font-label text-xs text-[#4edea3]">Session analyzed</p>
                                </div>
                            </div>
                            
                            {/* Dynamic AI text paragraph */}
                            <div className="bg-[#0b1326]/50 rounded-lg p-5 mb-5 relative z-10 border border-[#444656]/10">
                                <p className="font-body text-sm text-[#dae2fd] leading-relaxed" dangerouslySetInnerHTML={{ __html: aiInsightText }}></p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {/* Dynamic Trouble Key Box */}
                                <div className="bg-[#2d3449] rounded p-3 flex flex-col">
                                    <span className="font-label text-[10px] text-[#c5c5d9] uppercase mb-1">Trouble Key</span>
                                    {playedPerfectly ? (
                                        <span className="font-display text-[#4edea3] text-xl font-bold">None</span>
                                    ) : (
                                        <span className="font-display text-[#ffb2b7] text-xl font-bold">
                                            {troubleKey === ' ' ? 'Space' : troubleKey}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Dynamic Max Streak Box */}
                                <div className="bg-[#2d3449] rounded p-3 flex flex-col">
                                    <span className="font-label text-[10px] text-[#c5c5d9] uppercase mb-1">Max Streak</span>
                                    <span className="font-display text-[#4edea3] text-xl font-bold">{maxStreak}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <button 
                                onClick={resetTest}
                                className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#3d5afe] to-[#bbc3ff]/80 p-[1px] shadow-[0_10px_20px_rgba(61,90,254,0.15)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <div className="relative bg-[#060e20]/20 backdrop-blur-sm px-6 py-4 rounded-[7px] flex items-center justify-center gap-2 transition-colors group-hover:bg-transparent">
                                    <span className="material-symbols-outlined text-[#f1f0ff] text-lg">refresh</span>
                                    <span className="font-body font-semibold text-[#f1f0ff] text-sm">Try Again</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => cycleGameMode(activeCategory, activeDifficulty)}
                                className="w-full px-6 py-4 rounded-lg border border-[#444656]/20 bg-transparent text-[#bbc3ff] font-body font-medium text-sm hover:bg-[#222a3d] transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">skip_next</span>
                                Next Exercise
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}