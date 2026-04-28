import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Feedback from '@/Components/Feedback';

export default function Stats({ 
    auth, 
    sessionsHistory, 
    chartData = [], 
    heatmapData = {}, 
    troubleClusters = [], 
    averages = { wpm: 0, consistency: 0 } 
}) {
    
    // --- Pagination Logic ---
    const [pageInput, setPageInput] = useState(sessionsHistory?.current_page || 1);

    // --- Feedback Modal State ---
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleFeedbackClick = () => {
        if (auth?.user) {
            setIsFeedbackModalOpen(true);
        } else {
            alert('You are required to sign in to submit feedback.');
        }
    };

    // Sync input if current_page changes externally
    useEffect(() => {
        if (sessionsHistory?.current_page) {
            setPageInput(sessionsHistory.current_page);
        }
    }, [sessionsHistory?.current_page]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= sessionsHistory.last_page) {
            router.get(
                window.location.pathname,
                { page: page }, 
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const parsed = parseInt(pageInput, 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= sessionsHistory.last_page) {
                handlePageChange(parsed);
            } else {
                setPageInput(sessionsHistory.current_page); 
            }
        }
    };

    // --- Helper Functions ---
    const getStatusStyles = (status) => {
        switch(status) {
            case 'New Record': return 'bg-secondary/10 text-secondary';
            case 'Peak Flow': return 'bg-secondary/10 text-secondary';
            case 'Perfect': return 'bg-primary/10 text-primary';
            case 'Fatigue': return 'bg-tertiary/10 text-tertiary';
            default: return 'bg-surface-container-highest text-on-surface-variant';
        }
    };

    const generateSvgPath = (data, valueKey, maxY) => {
        if (!data || data.length === 0) return "M0,300 L1000,300";
        if (data.length === 1) return `M0,${300 - (data[0][valueKey] / maxY * 300)} L1000,${300 - (data[0][valueKey] / maxY * 300)}`;

        const width = 1000;
        const height = 300;
        const step = width / (data.length - 1);
        let path = '';

        data.forEach((point, index) => {
            const x = index * step;
            const y = height - ((point[valueKey] / maxY) * height);
            path += index === 0 ? `M${x},${y} ` : `L${x},${y} `;
        });
        return path;
    };

    const wpmPath = generateSvgPath(chartData, 'wpm', 200);
    const accuracyPath = generateSvgPath(chartData, 'accuracy', 100);

    const getHeatmapColor = (char) => {
        const count = heatmapData[char] || 0;
        const maxMistakes = Math.max(...Object.values(heatmapData), 1);
        
        if (count === 0) return "bg-surface-container-highest text-on-surface-variant";
        if (count < maxMistakes * 0.3) return "bg-tertiary/40 text-on-surface border border-tertiary/20";
        if (count < maxMistakes * 0.7) return "bg-tertiary/70 text-white border border-tertiary/40";
        return "bg-tertiary text-white shadow-[0_0_15px_rgba(255,178,183,0.3)]";
    };

    const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

    return (
        <>
            <Head title="Stats">
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

            <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden relative">
                <Navbar auth={auth} />

                <main className="pt-32 pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto space-y-8">
                    {/* Hero Analytics Header */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-8">
                            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-2">Performance</h1>
                            <p className="text-on-surface-variant max-w-xl font-light">Deep analysis of your LexiType momentum. Track consistency, identify bottlenecks, and refine your motor patterns through laboratory-grade data.</p>
                        </div>
                        <div className="md:col-span-4 flex justify-end gap-12">
                            <div className="text-right">
                                <span className="block text-on-surface-variant text-xs uppercase tracking-widest mb-1">Average WPM</span>
                                <span className="font-headline text-5xl text-secondary font-bold">{averages?.wpm || 0}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-on-surface-variant text-xs uppercase tracking-widest mb-1">Consistency</span>
                                <span className="font-headline text-5xl text-primary font-bold">{averages?.consistency || 0}<span className="text-2xl">%</span></span>
                            </div>
                        </div>
                    </section>

                    {/* LexiType Flow Progression Card */}
                    <section className="bg-surface-container-low rounded-xl p-8 border-none shadow-none">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="font-headline text-xl font-semibold mb-1">LexiType Flow Progression</h3>
                                <p className="text-on-surface-variant text-sm">Last 30 days session analysis</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                                    <span className="text-xs text-on-surface-variant">WPM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                    <span className="text-xs text-on-surface-variant">Accuracy</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-80 relative">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                                {/* Grid Lines */}
                                <line stroke="#444656" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="1000" y1="0" y2="0"></line>
                                <line stroke="#444656" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="1000" y1="75" y2="75"></line>
                                <line stroke="#444656" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
                                <line stroke="#444656" strokeOpacity="0.1" strokeWidth="1" x1="0" x2="1000" y1="225" y2="225"></line>
                                <line stroke="#444656" strokeOpacity="0.2" strokeWidth="1" x1="0" x2="1000" y1="300" y2="300"></line>
                                
                                {/* Dynamic SVG Paths */}
                                <path d={wpmPath} fill="none" stroke="#4edea3" strokeLinecap="round" strokeWidth="4"></path>
                                <path d={accuracyPath} fill="none" stroke="#3d5afe" strokeDasharray="8 4" strokeWidth="4"></path>
                                
                                {/* Gradient under WPM */}
                                <path d={`${wpmPath} V300 H0 Z`} fill="url(#grad1)" opacity="0.1"></path>
                                <defs>
                                    <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" style={{stopColor: '#4edea3', stopOpacity: 1}}></stop>
                                        <stop offset="100%" style={{stopColor: '#4edea3', stopOpacity: 0}}></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Linguistic Friction (Keyboard Heatmap) */}
                        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="font-headline text-xl font-semibold mb-1">Linguistic Friction</h3>
                                    <p className="text-on-surface-variant text-sm">Keyboard mistake distribution heatmap</p>
                                </div>
                                <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/10">
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Mistake Level:</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-sm bg-surface-container-highest"></div>
                                        <div className="w-3 h-3 rounded-sm bg-tertiary/30"></div>
                                        <div className="w-3 h-3 rounded-sm bg-tertiary/60"></div>
                                        <div className="w-3 h-3 rounded-sm bg-tertiary"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 select-none">
                                <div className="flex gap-2 justify-center">
                                    {row1.map(char => (
                                        <div key={char} className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${getHeatmapColor(char)}`}>{char}</div>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-center ml-4">
                                    {row2.map(char => (
                                        <div key={char} className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${getHeatmapColor(char)}`}>{char}</div>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-center ml-8">
                                    {row3.map(char => (
                                        <div key={char} className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${getHeatmapColor(char)}`}>{char}</div>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <div className={`w-64 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${getHeatmapColor(' ')} opacity-80`}>SPACE</div>
                                </div>
                            </div>
                        </div>

                        {/* Trouble Clusters */}
                        <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="font-headline text-xl font-semibold mb-6">Trouble Clusters</h3>
                                <div className="space-y-6">
                                    {troubleClusters && troubleClusters.length > 0 ? troubleClusters.map((cluster, idx) => (
                                        <div key={cluster.key} className="flex items-center gap-4">
                                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-headline font-bold text-2xl ${idx === 2 ? 'bg-tertiary/10 text-on-tertiary-container' : 'bg-tertiary/20 text-tertiary'}`}>
                                                {cluster.key}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Lag Factor</span>
                                                    <span className={`text-xs font-bold ${idx === 2 ? 'text-on-tertiary-container' : 'text-tertiary'}`}>{cluster.lag}ms</span>
                                                </div>
                                                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                                    <div className={`h-full ${idx === 2 ? 'bg-tertiary/50' : 'bg-tertiary'}`} style={{ width: `${cluster.percentage}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-on-surface-variant">No typing mistakes tracked yet.</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-outline-variant/10">
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    <span className="text-primary font-bold">Coach Tip: </span> 
                                    {troubleClusters && troubleClusters.length > 0 
                                        ? `Focus heavily on your transition strokes involving '${troubleClusters[0].key}'. Reducing lag here yields the highest WPM gains.` 
                                        : `Keep practicing! Data points will generate after a few sessions.`}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Session Chronology */}
                    <section className="bg-surface-container-low rounded-xl overflow-hidden">
                        <div className="p-8 pb-4">
                            <h3 className="font-headline text-xl font-semibold mb-1">Session Chronology</h3>
                            <p className="text-on-surface-variant text-sm">Full historical breakdown of your typing laboratory tests.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-high/50 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                                        <th className="px-8 py-4">Date & Time</th>
                                        <th className="px-8 py-4">Mode</th>
                                        <th className="px-8 py-4 text-secondary">Speed (WPM)</th>
                                        <th className="px-8 py-4 text-primary">Accuracy</th>
                                        <th className="px-8 py-4">Mistakes</th>
                                        <th className="px-8 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-outline-variant/10">
                                    {sessionsHistory?.data && sessionsHistory.data.length > 0 ? sessionsHistory.data.map((session) => (
                                        <tr key={session.id} className="hover:bg-surface-container-high/30 transition-colors">
                                            <td className="px-8 py-5 text-on-surface">{session.date_time}</td>
                                            <td className="px-8 py-5 text-on-surface-variant">{session.mode}</td>
                                            <td className="px-8 py-5 font-headline font-bold text-lg text-secondary">{session.wpm}</td>
                                            <td className="px-8 py-5 font-headline font-bold text-lg text-primary">{session.accuracy}</td>
                                            <td className="px-8 py-5 text-on-surface-variant">{session.mistakes}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusStyles(session.status)}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-16 text-center text-on-surface-variant">
                                                You haven't completed any laboratory sessions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Pagination Control --- */}
                        {sessionsHistory?.last_page > 1 && (
                            <div className="flex items-center justify-between p-6 bg-surface-container-low border-t border-outline-variant/10 rounded-b-xl">
                                <button 
                                    onClick={() => handlePageChange(sessionsHistory.current_page - 1)}
                                    disabled={sessionsHistory.current_page === 1}
                                    className="px-5 py-2 text-sm font-semibold text-on-surface-variant bg-surface-container-highest rounded-lg hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-3 text-sm text-on-surface-variant font-headline">
                                    <input 
                                        type="number" 
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-16 text-center bg-surface-container-highest border border-outline-variant/20 rounded-md text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                                    />
                                    <span>/ {sessionsHistory.last_page}</span>
                                </div>

                                <button 
                                    onClick={() => handlePageChange(sessionsHistory.current_page + 1)}
                                    disabled={sessionsHistory.current_page === sessionsHistory.last_page}
                                    className="px-5 py-2 text-sm font-semibold text-on-surface-variant bg-surface-container-highest rounded-lg hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Left Floating Button: Feedback */}
                    <div className="fixed bottom-8 left-8 z-50 transition-opacity duration-500 opacity-100">
                        <button 
                            onClick={handleFeedbackClick}
                            className="flex items-center gap-3 bg-surface-container-high/80 backdrop-blur-md px-5 py-3 rounded-full border border-outline-variant/10 hover:bg-primary-container hover:text-white transition-all group shadow-xl"
                        >
                            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">maps_ugc</span>
                            <span className="text-xs font-bold uppercase tracking-widest font-headline">Send Feedback</span>
                        </button>
                    </div>

                    {/* Right Floating Button: AI Coach (Status logic removed so it's always visible) */}
                    <div className="fixed bottom-8 right-8 z-50 group transition-opacity duration-500 opacity-100">
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
                </main>
            </div>

            {/* Modal Components */}
            <Feedback 
                isOpen={isFeedbackModalOpen} 
                onClose={() => setIsFeedbackModalOpen(false)} 
            />
        </>
    );
}