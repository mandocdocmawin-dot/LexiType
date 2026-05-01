import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Dashboard({ auth, stats, feedbacks, activeUsers }) {
    return (
        <>
            <Head title="Admin Dashboard">
                {/* 1. Added identical font and icon links from Stats.jsx */}
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

            {/* 2. Added identical style block to configure Material Symbols properly */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                `
            }} />

            {/* 3. Matched the background and selection styling from Stats.jsx */}
            <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] font-body selection:bg-[#3d5afe] selection:text-[#f1f0ff] overflow-x-hidden relative">
                
                {/* Navbar integrated at the top. The icons here will now render perfectly! */}
                <Navbar auth={auth} />

                {/* Removed max-w-screen-2xl and mx-auto to allow full-width expansion, adjusted padding */}
                <main className="pt-32 pb-10 flex flex-col min-h-screen w-full space-y-8 px-6 md:px-8">
                    
                    {/* Dynamic Dashboard Grid */}
                    <section className="grid grid-cols-12 gap-8 flex-1">
                        
                        {/* Left Panel: Feedback Inbox (8 Columns) */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                            
                            {/* Header Stats Area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#131b2e] p-8 rounded-xl border-l-4 border-[#bbc3ff] shadow-none">
                                    <p className="text-[#c5c5d9] text-xs font-bold uppercase tracking-widest mb-2 font-label">Active Users</p>
                                    <h2 className="text-4xl font-headline font-bold text-white">{stats?.totalUsers || 0}</h2>
                                    <div className="flex items-center mt-3 text-[#4edea3] text-sm font-medium">
                                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                                        <span>Live Monitoring</span>
                                    </div>
                                </div>
                                
                                <div className="bg-[#131b2e] p-8 rounded-xl border-l-4 border-[#4edea3] shadow-none">
                                    <p className="text-[#c5c5d9] text-xs font-bold uppercase tracking-widest mb-2 font-label">Avg. Velocity</p>
                                    <h2 className="text-4xl font-headline font-bold text-white">{stats?.averageWpm || 0} <span className="text-xl text-[#c5c5d9]">WPM</span></h2>
                                    <div className="flex items-center mt-3 text-[#4edea3] text-sm font-medium">
                                        <span className="material-symbols-outlined text-sm mr-1">bolt</span>
                                        <span>Peak Performance</span>
                                    </div>
                                </div>
                                
                                <div className="bg-[#131b2e] p-8 rounded-xl border-l-4 border-[#3d5afe] shadow-none">
                                    <p className="text-[#c5c5d9] text-xs font-bold uppercase tracking-widest mb-2 font-label">Global Accuracy</p>
                                    <h2 className="text-4xl font-headline font-bold text-white">{stats?.averageAccuracy || 0}<span className="text-xl text-[#c5c5d9]">%</span></h2>
                                    <div className="flex items-center mt-3 text-[#3d5afe] text-sm font-medium">
                                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                        <span>Optimal Stability</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Inbox */}
                            <div className="bg-[#131b2e] rounded-xl overflow-hidden flex flex-col flex-1 border-none shadow-none">
                                <div className="p-8 border-b border-[#444656]/10 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-[#4edea3] animate-pulse"></div>
                                        <div>
                                            <h3 className="font-headline font-semibold text-xl text-white">Feedback Inbox</h3>
                                            <p className="text-[#c5c5d9] text-sm mt-1">Real-time user insights and reports</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4">
                                    {feedbacks?.length > 0 ? (
                                        feedbacks.map((feedback) => (
                                            <div key={feedback.id} className="group flex items-start gap-5 p-5 rounded-xl bg-[#060e20] hover:bg-[#222a3d]/50 transition-all border border-transparent hover:border-[#bbc3ff]/20">
                                                <div className="w-12 h-12 rounded-xl bg-[#bbc3ff]/10 flex items-center justify-center text-[#bbc3ff]">
                                                    <span className="material-symbols-outlined">rate_review</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold text-white font-headline">{feedback.user_name}</span>
                                                        <span className="text-xs text-[#c5c5d9] font-medium">{feedback.time_ago}</span>
                                                    </div>
                                                    <p className="text-[#c5c5d9] text-sm leading-relaxed mt-1">
                                                        <span className="text-[#bbc3ff] font-semibold mr-2">[{feedback.category}]</span> 
                                                        {feedback.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-[#c5c5d9]">
                                            <span className="material-symbols-outlined text-4xl mb-3 opacity-50">inbox</span>
                                            <p>No recent feedback available.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Lexi Engine & Active Management (4 Columns) */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                            
                            {/* Lexi Engine Insights - Matched the floating Glassmorphism style */}
                            <div className="bg-[#131b2e]/70 backdrop-blur-xl p-8 rounded-2xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bbc3ff]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                
                                <div className="flex items-center gap-5 mb-8 relative z-10">
                                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-[#bbc3ff] rounded-xl blur-md opacity-30 animate-pulse"></div>
                                        <div className="w-16 h-16 rounded-xl border border-white/10 relative z-10 bg-[#060e20] flex items-center justify-center shadow-lg">
                                            <span className="material-symbols-outlined text-[#bbc3ff] text-3xl">psychology</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-headline font-bold text-xl text-white">Lexi Engine</h4>
                                        <p className="text-[10px] text-[#bbc3ff] font-bold uppercase tracking-widest mt-1">Active Analysis</p>
                                    </div>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-5 rounded-xl bg-[#060e20]/80 border border-white/5 border-l-2 border-l-[#bbc3ff] hover:bg-[#060e20] transition-colors">
                                        <p className="text-xs text-[#c5c5d9] font-bold mb-2 uppercase tracking-wide">System Health</p>
                                        <p className="text-sm text-white font-light">Load balancing optimal. All sub-modules reporting normal parameters.</p>
                                    </div>
                                    <div className="p-5 rounded-xl bg-[#060e20]/80 border border-white/5 border-l-2 border-l-[#4edea3] hover:bg-[#060e20] transition-colors">
                                        <p className="text-xs text-[#c5c5d9] font-bold mb-2 uppercase tracking-wide">User Performance</p>
                                        <p className="text-sm text-white font-light">Top 5% of users show consistency in 'Burst Typing' metrics today.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Management / User List */}
                            <div className="bg-[#131b2e] rounded-xl flex-1 flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-[#444656]/10">
                                    <h3 className="font-headline font-semibold text-xl text-white">Active Users</h3>
                                    <p className="text-[#c5c5d9] text-sm mt-1">Currently engaged in typing sessions</p>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                                    {activeUsers?.length > 0 ? (
                                        activeUsers.map((user) => (
                                            <div key={user.id} className="flex items-center gap-4 group hover:translate-x-1 transition-transform duration-300">
                                                <div className="w-12 h-12 rounded-full bg-[#060e20] overflow-hidden border border-white/10 flex items-center justify-center text-[#c5c5d9] font-headline font-bold text-lg uppercase group-hover:border-[#4edea3]/50 transition-colors">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white truncate font-headline">{user.name}</p>
                                                    <p className="text-xs text-[#c5c5d9] mt-0.5">{user.tier}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-[#4edea3] font-headline">{user.wpm} WPM</p>
                                                    <div className="w-16 h-1.5 bg-[#060e20] rounded-full mt-2 overflow-hidden">
                                                        <div 
                                                            className="bg-[#4edea3] h-full rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]" 
                                                            style={{ width: `${Math.min((user.wpm / 150) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#c5c5d9] text-center py-4">No active users found.</p>
                                    )}
                                </div>
                            </div>
                            
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}