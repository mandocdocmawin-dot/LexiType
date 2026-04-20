import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function AboutApp({ auth }) {
    return (
        <>
        <Head title="About">
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

            <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-[#3d5afe] selection:text-white dark relative overflow-x-hidden">
                {/* Ito ang Navbar natin na may mga icons */}
                <Navbar auth={auth} />

                <main className="max-w-4xl mx-auto pt-32 px-6 pb-20 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
                        Tungkol sa LexiType
                    </h1>
                    
                    <div className="space-y-8 text-lg leading-relaxed text-slate-400">
                        <section className="space-y-4">
                            <p>
                                Ang LexiType ay idinisenyo para sa mga minimalist at mahilig sa high-performance typing. 
                                Layunin namin na magbigay ng maayos na karanasan sa pag-eensayo ng bilis at accuracy sa pagtitipa.
                            </p>
                            <p>
                                Naniniwala kami na ang keyboard ay hindi lamang isang tool, kundi isang extension ng iyong isipan. 
                                Sa pamamagitan ng LexiType, mas mapapabilis ang daloy ng iyong mga ideya mula sa utak patungo sa screen.
                            </p>
                        </section>
                        
                        <div className="bg-[#131b2e] p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                            {/* Kumuha tayo ng idea sa Welcome.jsx: Naglagay ako ng subtle glow effect dito! */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3d5afe]/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[#3d5afe]/20"></div>

                            <h2 className="text-2xl font-bold text-[#bbc3ff] mb-4 relative z-10 flex items-center gap-3">
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Ang Aming Misyon
                            </h2>
                            <p className="text-slate-300 relative z-10">
                                Magbigay ng modernong tools na makakatulong sa mga developers, writers, at kahit sinong gumagamit ng computer na maging mas produktibo 
                                sa pamamagitan ng mastery sa kanilang keyboard.
                            </p>
                        </div>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="text-[#bbc3ff] mb-4">
                                    <span className="material-symbols-outlined text-3xl">brush</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">Minimalist Design</h3>
                                <p className="text-sm">Walang distractions. Focus lamang sa iyong pag-type at performance.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="text-[#bbc3ff] mb-4">
                                    <span className="material-symbols-outlined text-3xl">analytics</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">Advanced Analytics</h3>
                                <p className="text-sm">Subaybayan ang iyong WPM, accuracy, at consistency sa bawat session.</p>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}