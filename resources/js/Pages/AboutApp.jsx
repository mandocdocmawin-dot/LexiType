import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Feedback from '@/Components/Feedback'; 
import AiChatModal from '@/Components/AiChatModal'; 

export default function AboutApp({ auth }) {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const handleFeedbackClick = () => {
        if (auth?.user) {
            setIsFeedbackModalOpen(true);
        } else {
            alert('You are required to sign in to submit feedback.');
        }
    };

    const handleAiClick = () => {
        if (auth?.user) {
            setIsAiModalOpen(true);
        } else {
            alert('You are required to sign in to use the AI Coach.');
        }
    };

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

            <style dangerouslySetInnerHTML={{
                __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                `
            }} />

            {/* MAIN CONTENT DIV */}
            <div className="min-h-screen bg-[#0b1326] font-inter text-slate-300 selection:bg-[#3d5afe] selection:text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1a233a] to-transparent opacity-50 pointer-events-none"></div>
                
                <Navbar auth={auth} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space tracking-tight">
                                Elevate Your <span className="text-[#3d5afe]">Typing</span> Experience
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Ang application na ito ay ginawa upang tulungan kang mapabuti ang iyong bilis at accuracy sa pag-type sa pamamagitan ng AI-driven analysis at minimalist na kapaligiran.
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

            {/* --- FLOATING AI COACH BUTTON (Sa Ibaba) --- */}
            <div className="fixed bottom-8 right-8 z-50 flex items-end justify-end pointer-events-auto">
                <div className="flex flex-col items-end mr-4 mb-2 relative group">
                    <div className="bg-[#131b2e]/90 backdrop-blur-xl p-4 rounded-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {auth?.user ? (
                            <>
                                <p className="text-sm font-medium text-white mb-1">LexiType AI Coach</p>
                                <p className="text-xs text-[#8e8fa2]">Click to get insights on your typing performance.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-white mb-1">Log in to chat with your AI Coach!</p>
                                <p className="text-xs text-[#8e8fa2]">Get personalized feedback on your typing cadence and posture.</p>
                            </>
                        )}
                    </div>
                    <div className="w-3 h-3 bg-[#131b2e]/90 rotate-45 absolute -bottom-1.5 right-6 border-r border-b border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div onClick={handleAiClick} className="bg-[#131b2e]/70 backdrop-blur-xl rounded-xl w-16 h-16 shadow-[0px_20px_40px_rgba(6,14,32,0.4)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                        <span className="text-[10px] font-semibold font-body tracking-wider mt-1">LexiType</span>
                    </div>
                </div>
            </div>

            {/* --- FLOATING FEEDBACK BUTTON --- */}
            {auth?.user ? (
                <div className={`fixed bottom-8 left-8 z-50 transition-opacity duration-500 ${status === 'typing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button 
                        onClick={handleFeedbackClick}
                        className="flex items-center gap-3 bg-[#131b2e]/80 backdrop-blur-md px-5 py-3 rounded-full border border-white/10 hover:bg-[#3d5afe]/20 hover:text-white transition-all group shadow-[0px_10px_20px_rgba(6,14,32,0.4)]"
                    >
                    <span className="material-symbols-outlined text-[#3d5afe] group-hover:text-white transition-colors">maps_ugc</span>
                    <span className="text-xs font-bold uppercase tracking-widest font-headline text-slate-300">Send Feedback</span>
                </button>
            </div>
            ) : null}

            {/* --- MODAL COMPONENTS --- */}
            <Feedback 
                isOpen={isFeedbackModalOpen} 
                onClose={() => setIsFeedbackModalOpen(false)} 
            />

            <AiChatModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                auth={auth} 
            />
        </>
    );
}