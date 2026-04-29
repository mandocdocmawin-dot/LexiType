import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Feedback from '@/Components/Feedback'; 
import AiChatModal from '@/Components/AiChatModal'; 

export default function AboutApp({ auth }) {
    // --- MODAL STATES ---
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    // --- HANDLERS ---
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
                    }
                `
            }} />

            <div className="min-h-screen bg-[#060e20] text-[#8e8fa2] font-body flex flex-col relative overflow-hidden">
                {/* Ipinasa natin ang handler sa Navbar kung sakaling nandoon ang Feedback button */}
                <Navbar auth={auth} onFeedbackClick={handleFeedbackClick} />

                <main className="flex-1 flex flex-col items-center pt-24 pb-12 px-4 md:px-8 z-10">
                    <div className="w-full max-w-4xl">
                        
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                About <span className="text-[#bbc3ff]">LexiType</span>
                            </h1>
                            <p className="text-lg text-[#8e8fa2] max-w-2xl mx-auto">
                                Elevate your typing experience with AI-powered feedback and detailed analytics.
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

                {/* --- FLOATING AI BUTTON --- */}
                <div className={`fixed bottom-8 right-8 z-50 group transition-opacity duration-500 opacity-100`}>
                    <div className="absolute bottom-full right-0 mb-4 w-64 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        <div className="bg-[#131b2e]/90 backdrop-blur-xl p-4 rounded-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] border border-white/10">
                            {auth?.user ? (
                                <>
                                    <p className="text-sm font-medium text-white mb-1">Chat with LexiType!</p>
                                    <p className="text-xs text-[#8e8fa2]">Ask your AI coach for personalized typing tips and feedback.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-white mb-1">Log in to chat with your AI Coach!</p>
                                    <p className="text-xs text-[#8e8fa2]">Get personalized feedback on your typing cadence and posture.</p>
                                </>
                            )}
                        </div>
                        <div className="w-3 h-3 bg-[#131b2e]/90 rotate-45 absolute -bottom-1.5 right-6 border-r border-b border-white/10"></div>
                    </div>
                    
                    <div onClick={handleAiClick} className="bg-[#131b2e]/70 backdrop-blur-xl rounded-xl w-16 h-16 shadow-[0px_20px_40px_rgba(6,14,32,0.4)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            <span className="text-[10px] font-semibold font-body tracking-wider mt-1">LexiType</span>
                        </div>
                    </div>
                </div>

            </div>

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