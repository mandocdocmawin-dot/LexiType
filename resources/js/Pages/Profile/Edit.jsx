import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Feedback from '@/Components/Feedback';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    // --- Stats Logic (Highest/Max Mapping) ---
    const topWpm = Math.round(user.max_wpm_score || 0);
    const topAccuracy = Number(user.max_accuracy_percentage || 0).toFixed(1);

    // --- Feedback Modal State ---
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleFeedbackClick = () => {
        if (auth?.user) {
            setIsFeedbackModalOpen(true);
        } else {
            alert('You are required to sign in to submit feedback.');
        }
    };

    return (
        <>
            <Head title="User Profile & Settings">
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

            <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen relative font-body">
                
                <Navbar auth={auth} />

                <main className="pt-32 pb-24 flex justify-center px-4">
                    <div className="w-full max-w-2xl space-y-12 z-10 relative">
                        
                        <section className="text-center space-y-2">
                            <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Account Parameters</h1>
                            <p className="font-body text-on-surface-variant text-sm">Configure your kinetic identity and performance metrics.</p>
                        </section>

                        {/* Read-Only Profile Card */}
                        <div className="bg-surface-container-low p-8 rounded-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-9xl" data-icon="shield">shield</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="relative shrink-0">
                                    <img 
                                        alt="User Profile" 
                                        className="w-32 h-32 rounded-full border-4 border-surface-container-high object-cover shadow-lg" 
                                        src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3d5afe&color=fff`} 
                                    />
                                    <div className="absolute bottom-0 right-0 bg-secondary w-8 h-8 rounded-full border-4 border-surface-container-low flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px] text-on-secondary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                    </div>
                                </div>

                                <div className="flex-grow text-center md:text-left space-y-4">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <span className="font-headline text-3xl font-bold">{user.name}</span>
                                            <span className="px-2 py-0.5 bg-primary-container/20 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full border border-primary/20">Pro Member</span>
                                        </div>
                                        <p className="text-on-surface-variant text-sm font-body mt-1">
                                            Member since {user.created_at ? new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Top Speed</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-headline text-4xl text-secondary">{topWpm}</span>
                                                <span className="text-xs text-secondary/60 font-bold">WPM</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Accuracy</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-headline text-4xl text-on-surface">{topAccuracy}</span>
                                                <span className="text-xs text-on-surface-variant font-bold">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forms */}
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                        <UpdatePasswordForm />
                        <DeleteUserForm />

                    </div>
                </main>

                <aside className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#131b2e]/70 backdrop-blur-2xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] flex flex-col items-center justify-center z-50">
                    <button className="bg-[#2d3449] text-[#bbc3ff] rounded-full p-4 hover:scale-110 hover:shadow-[0_0_15px_rgba(61,90,254,0.2)] transition-all active:scale-90 duration-200 group relative">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        <div className="absolute right-full mr-4 bg-[#131b2e] text-white text-[10px] px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-outline-variant/20 uppercase tracking-widest font-bold">
                            AI Coach Active
                        </div>
                    </button>
                </aside>

                <div className="fixed bottom-8 left-8 z-50">
                    <button 
                        onClick={handleFeedbackClick}
                        className="flex items-center gap-3 bg-surface-container-high/80 backdrop-blur-md px-5 py-3 rounded-full border border-outline-variant/10 hover:bg-primary-container hover:text-white transition-all group shadow-xl"
                    >
                        <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">maps_ugc</span>
                        <span className="text-xs font-bold uppercase tracking-widest font-headline">Send Feedback</span>
                    </button>
                </div>

            </div>

            <Feedback 
                isOpen={isFeedbackModalOpen} 
                onClose={() => setIsFeedbackModalOpen(false)} 
            />
        </>
    );
}