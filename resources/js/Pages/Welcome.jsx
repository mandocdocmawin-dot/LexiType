import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
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
                    
                    {/* Test Configuration Bar */}
                    <div className="mb-12 flex justify-center">
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
                    <div className="relative w-full max-w-5xl bg-[#060e20] rounded-2xl p-8 md:p-12 overflow-hidden group">
                        {/* Asymmetric background glow */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 text-2xl md:text-3xl font-body leading-relaxed tracking-wide text-justify select-none">
                            <span className="text-on-surface">The </span>
                            <span className="text-on-surface">quick </span>
                            <span className="text-on-surface">brown </span>
                            <span className="text-on-surface">fox </span>
                            <span className="text-on-surface">jumps </span>
                            <span className="text-on-surface">over </span>
                            <span className="text-on-surface">the </span>
                            <span className="caret-custom"></span>
                            <span className="text-on-surface border-b-2 border-primary">l</span>
                            <span className="text-on-surface-variant/40">azy </span>
                            <span className="bg-tertiary-container text-on-tertiary-container px-0.5 rounded-sm">d</span>
                            <span className="text-on-surface-variant/40">og </span>
                            <span className="text-on-surface-variant/40">while </span>
                            <span className="text-on-surface-variant/40">the </span>
                            <span className="text-on-surface-variant/40">sun </span>
                            <span className="text-on-surface-variant/40">sets </span>
                            <span className="text-on-surface-variant/40">behind </span>
                            <span className="text-on-surface-variant/40">the </span>
                            <span className="text-on-surface-variant/40">jagged </span>
                            <span className="text-on-surface-variant/40">mountains. </span>
                            <span className="text-on-surface-variant/40">Precision </span>
                            <span className="text-on-surface-variant/40">is </span>
                            <span className="text-on-surface-variant/40">the </span>
                            <span className="text-on-surface-variant/40">bridge </span>
                            <span className="text-on-surface-variant/40">between </span>
                            <span className="text-on-surface-variant/40">intent </span>
                            <span className="text-on-surface-variant/40">and </span>
                            <span className="text-on-surface-variant/40">execution, </span>
                            <span className="text-on-surface-variant/40">a </span>
                            <span className="text-on-surface-variant/40">silent </span>
                            <span className="text-on-surface-variant/40">rhythm </span>
                            <span className="text-on-surface-variant/40">born </span>
                            <span className="text-on-surface-variant/40">from </span>
                            <span className="text-on-surface-variant/40">calculated </span>
                            <span className="text-on-surface-variant/40">keystrokes </span>
                            <span className="text-on-surface-variant/40">and </span>
                            <span className="text-on-surface-variant/40">the </span>
                            <span className="text-on-surface-variant/40">steady </span>
                            <span className="text-on-surface-variant/40">cadence </span>
                            <span className="text-on-surface-variant/40">of </span>
                            <span className="text-on-surface-variant/40">an </span>
                            <span className="text-on-surface-variant/40">undisturbed </span>
                            <span className="text-on-surface-variant/40">mind.</span>
                        </div>
                        
                        {/* Focus Hidden Input */}
                        <input autoFocus className="absolute inset-0 opacity-0 cursor-default" type="text" />
                    </div>

                    {/* Footer Hint */}
                    <div className="mt-12 flex items-center justify-center gap-3 text-[#64748b] font-medium">
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">tab</span>
                        <span className="text-xs font-semibold">+</span>
                        <span className="px-3 py-1.5 bg-[#1e293b] rounded-md text-xs font-semibold text-[#94a3b8]">enter</span>
                        <span className="text-[13px] ml-2">to restart session</span>
                    </div>

                    {/* Post-Test State (Hidden Template) */}
                    <div className="hidden fixed inset-0 z-50 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
                        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="font-headline text-5xl font-bold tracking-tight">Session Complete.</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-surface-container-low p-8 rounded-2xl">
                                        <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-widest">Speed</p>
                                        <p className="font-headline text-6xl font-bold">124<span className="text-xl font-normal text-on-surface-variant">wpm</span></p>
                                    </div>
                                    <div className="bg-surface-container-low p-8 rounded-2xl">
                                        <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-widest">Accuracy</p>
                                        <p className="font-headline text-6xl font-bold">99<span className="text-xl font-normal text-on-surface-variant">%</span></p>
                                    </div>
                                </div>
                                <div className="bg-primary-container p-1 rounded-2xl bg-gradient-to-br from-[#3d5afe] to-[#bbc3ff]">
                                    <div className="bg-surface-container-highest p-8 rounded-xl">
                                        <p className="text-lg font-medium mb-4">Sign up to save your stats & unlock AI insights</p>
                                        <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:scale-[1.02] transition-transform">Create Free Account</button>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[400px] bg-surface-container-low rounded-3xl overflow-hidden">
                                <img 
                                    className="w-full h-full object-cover mix-blend-luminosity opacity-40" 
                                    alt="abstract high-tech visualization" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ3vI7yZOcnrrFReCx9pW-6g46iEVApOZhvKXkxrNEsgnR_cYIhF_qqEOYqVXG8KO8hhPgb7FGNtpAYnKPLW_GQMEsX6KZK5aHxvwOangRTbGx6brMKXAuVeyQv_eGobwvour8VNAZha4eRc6siFVpc3dTM_XxI4ZlFR_PaR7zUd3fSp1Eb1geXE1URNViU0GcKihxScWkxDrCinHj5Bd9BORoueew9IfuZ0tbtJzB54h5foVi-8zQc1IFjBsT06Kk6HuCu4P7RnM" 
                                />
                                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-surface to-transparent">
                                    <p className="font-headline text-2xl font-bold">The AI Coach is waiting.</p>
                                    <p className="text-on-surface-variant mt-2">Analyze your finger heatmaps and cadence bottlenecks.</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-12 text-on-surface-variant hover:text-white underline underline-offset-4 transition-colors">Maybe later, restart test</button>
                    </div>
                </main>

                {/* SideNavBar / AI Coach Widget */}
                <div className="fixed bottom-8 right-8 z-50 group">
                    <div className="absolute bottom-full right-0 mb-4 w-64 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        <div className="bg-[#131b2e]/90 backdrop-blur-xl p-4 rounded-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] border border-outline-variant/15">
                            <p className="text-sm font-medium text-white mb-1">Log in to chat with your AI Coach!</p>
                            <p className="text-xs text-on-surface-variant">Get personalized feedback on your typing cadence and posture.</p>
                        </div>
                        <div className="w-3 h-3 bg-[#131b2e]/90 rotate-45 absolute -bottom-1.5 right-6 border-r border-b border-outline-variant/15"></div>
                    </div>
                    <div className="bg-[#131b2e]/70 backdrop-blur-xl rounded-xl w-16 h-16 shadow-[0px_20px_40px_rgba(6,14,32,0.4)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            <span className="text-[10px] font-semibold font-body tracking-wider mt-1">LexiType</span>
                        </div>
                    </div>
                </div>

                {/* Optional: Outputting framework versions dynamically at the very bottom as a subtle detail */}
                <div className="fixed bottom-4 left-4 text-xs font-body text-on-surface-variant/40">
                    Laravel v{laravelVersion} | PHP v{phpVersion}
                </div>
            </div>
        </>
    );
}