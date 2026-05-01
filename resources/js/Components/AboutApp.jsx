import React, { useEffect } from 'react';

export default function AboutApp({ isOpen, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div 
                className="absolute inset-0 bg-[#0b1326]/80 backdrop-blur-md"
                onClick={onClose}
            ></div>
            
            {/* Increased max-h to 96vh so the modal can stretch taller to fit the content */}
            <div className="relative bg-[#131b2e] w-full max-w-4xl max-h-[96vh] overflow-y-auto rounded-xl shadow-[0px_20px_60px_rgba(0,0,0,0.6)] border border-white/10">
                
                {/* Slightly reduced vertical padding (py-6 instead of py-8) */}
                <div className="sticky top-0 bg-[#131b2e] px-10 py-6 flex justify-between items-center z-10 border-b border-white/5">
                    <h2 className="text-3xl font-headline font-bold text-white tracking-tight">About This App</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl" data-icon="close">close</span>
                    </button>
                </div>
                
                {/* Tweaked spacing: space-y-8 (instead of 10), pt-6, and pb-8 to perfectly fit the screen */}
                <div className="px-10 pt-6 pb-8 space-y-8">
                    
                    <section>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-[#bbc3ff]" data-icon="neurology">neurology</span>
                            <h3 className="text-lg font-headline font-semibold uppercase tracking-widest text-[#bbc3ff]">AI Performance Engine</h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-base">
                            LexiType leverages an intelligent neural network to analyze your keystroke dynamics in real-time. Unlike standard typing tests, we measure <span className="text-white font-medium">Cadence Pace</span> (the rhythm between keys) and <span className="text-white font-medium">Error Rate</span> (where mistakes happen). Our AI Coach provides personalized drills to eliminate "finger-hiccups" and optimize your neurological pathing to the flow state.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-[#4edea3]" data-icon="data_exploration">data_exploration</span>
                            <h3 className="text-lg font-headline font-semibold uppercase tracking-widest text-[#4edea3]">The Scoring Matrix</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#222a3d] p-6 rounded-xl">
                                <span className="block text-xs font-label text-slate-400 uppercase tracking-wider mb-2">Raw WPM</span>
                                <p className="text-sm leading-snug text-slate-400">Total keystrokes divided by five, irrespective of errors.</p>
                            </div>
                            <div className="bg-[#222a3d] p-6 rounded-xl">
                                <span className="block text-xs font-label text-slate-400 uppercase tracking-wider mb-2">Net WPM</span>
                                <p className="text-sm leading-snug text-slate-400">The industry standard. Raw speed adjusted for uncorrected mistakes.</p>
                            </div>
                            <div className="bg-[#222a3d] p-6 rounded-xl border-l-4 border-[#4edea3]/50">
                                <span className="block text-xs font-label text-slate-400 uppercase tracking-wider mb-2">L-Factor</span>
                                <p className="text-sm leading-snug text-slate-400">Our signature metric measuring rhythmic consistency and recovery speed.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#060e20] p-8 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[#bbc3ff]" data-icon="keyboard">keyboard</span>
                            <h3 className="text-lg font-headline font-semibold uppercase tracking-widest text-[#bbc3ff]">Keyboard Shortcuts</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-12">
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                                <span className="text-slate-400 text-sm">Restart Test</span>
                                <kbd className="bg-[#2d3449] px-3 py-1.5 rounded text-xs font-mono text-[#bbc3ff] border border-white/20">Tab + Enter</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                                <span className="text-slate-400 text-sm">Change Mode</span>
                                <kbd className="bg-[#2d3449] px-3 py-1.5 rounded text-xs font-mono text-[#bbc3ff] border border-white/20">Alt + M</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                                <span className="text-slate-400 text-sm">Toggle AI Coach</span>
                                <kbd className="bg-[#2d3449] px-3 py-1.5 rounded text-xs font-mono text-[#bbc3ff] border border-white/20">Ctrl + Shift + A</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                                <span className="text-slate-400 text-sm">Close Tab</span>
                                <kbd className="bg-[#2d3449] px-3 py-1.5 rounded text-xs font-mono text-[#bbc3ff] border border-white/20">Esc</kbd>
                            </div>
                        </div>
                    </section>

                    <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-xl font-bold tracking-tighter text-white font-headline mb-1">LEXITYPE <span className="text-xs font-medium text-slate-400/50 ml-2">v2.4.0-build.89</span></div>
                            <p className="text-xs text-slate-400">© 2026 LexiType App Inc. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}