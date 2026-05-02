import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function FeedbackIndex({ feedbacks }) {
    const { delete: destroy } = useForm();

    // --- Pagination State & Logic (Referenced from Stats.jsx) ---
    const [pageInput, setPageInput] = useState(feedbacks?.current_page || 1);

    // Sync input if current_page changes externally (e.g., clicking Next/Prev)
    useEffect(() => {
        setPageInput(feedbacks?.current_page || 1);
    }, [feedbacks?.current_page]);

    // Handle Direct Page Jump (Enter key or Blur)
    const handlePageJump = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let page = parseInt(pageInput);
            
            // Validate the input
            if (isNaN(page) || page < 1) page = 1;
            if (page > feedbacks.last_page) page = feedbacks.last_page;
            
            setPageInput(page);

            // Navigate only if the page actually changed
            if (page !== feedbacks.current_page) {
                router.get(route('admin.feedback.index'), { page: page }, { 
                    preserveState: true, 
                    preserveScroll: true 
                });
            }
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            destroy(route('admin.feedback.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const safeString = dateString.replace(' ', 'T'); 
        const date = new Date(safeString);
        
        if (isNaN(date.getTime())) return 'Invalid Date';

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return `${formattedDate} • ${formattedTime}`;
    };

    return (
        <>
            <Head title="Admin - User Feedback">
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

            <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-body selection:bg-[#3d5afe] selection:text-[#f1f0ff] p-6 md:p-8">
                
                <div className="max-w-7xl mx-auto mb-6">
                    <Link 
                        href={route('dashboard')} 
                        className="inline-flex items-center text-[#c5c5d9] hover:text-[#bbc3ff] transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto bg-[#131b2e] rounded-xl border-none shadow-[0px_20px_40px_rgba(6,14,32,0.4)] overflow-hidden flex flex-col">
                    
                    <div className="p-8 border-b border-[#444656]/10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#bbc3ff]/10 flex items-center justify-center text-[#bbc3ff]">
                                <span className="material-symbols-outlined text-2xl">rate_review</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white font-headline">User Feedbacks</h2>
                                <p className="text-sm text-[#c5c5d9] mt-1">Review and manage feedback submitted by Kinetic Lab users.</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#060e20]/50 text-[#c5c5d9] uppercase text-xs tracking-widest font-bold border-b border-[#444656]/20">
                                    <th className="p-5">User</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Message</th>
                                    <th className="p-5">Date & Time</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#444656]/10">
                                {/* IMPORTANT: Changed from feedbacks.length to feedbacks.data.length */}
                                {!feedbacks.data || feedbacks.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-[#c5c5d9]">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">inbox</span>
                                                <p>No feedback records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    feedbacks.data.map((feedback) => (
                                        <tr key={feedback.id} className="hover:bg-[#222a3d]/50 transition-colors group">
                                            <td className="p-5 align-top">
                                                <div className="font-bold text-white font-headline">
                                                    {feedback.user ? feedback.user.name : 'Unknown User'}
                                                </div>
                                                <div className="text-xs text-[#c5c5d9] mt-0.5 font-medium">
                                                    {feedback.user ? feedback.user.email : 'No email provided'}
                                                </div>
                                            </td>
                                            <td className="p-5 align-top">
                                                <span className="inline-flex items-center px-3 py-1 bg-[#bbc3ff]/10 text-[#bbc3ff] text-xs font-semibold rounded-full border border-[#bbc3ff]/20">
                                                    {feedback.category}
                                                </span>
                                            </td>
                                            <td className="p-5 align-top text-sm text-[#c5c5d9] max-w-md whitespace-pre-wrap leading-relaxed">
                                                <div className="line-clamp-2">
                                                    {feedback.message}
                                                </div>
                                            </td>
                                            <td className="p-5 align-top text-sm text-[#c5c5d9] whitespace-nowrap font-medium">
                                                {formatDateTime(feedback.created_at)}
                                            </td>
                                            <td className="p-5 align-top text-right space-x-2">
                                                <Link 
                                                    href={route('admin.feedback.show', feedback.id)}
                                                    className="inline-flex items-center justify-center gap-1.5 text-[#bbc3ff] border border-[#bbc3ff]/30 hover:bg-[#bbc3ff]/10 px-4 py-1.5 rounded text-sm font-medium transition-colors opacity-80 hover:opacity-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    View
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(feedback.id)}
                                                    className="inline-flex items-center justify-center gap-1.5 text-[#ff4757] border border-[#ff4757]/30 hover:bg-[#ff4757]/10 px-4 py-1.5 rounded text-sm font-medium transition-colors opacity-80 hover:opacity-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {feedbacks?.last_page > 1 && (
                        <div className="flex items-center justify-between p-6 bg-[#131b2e] border-t border-[#444656]/10 rounded-b-xl">
                            
                            {/* Previous Button */}
                            <button
                                onClick={() => feedbacks.prev_page_url && router.get(feedbacks.prev_page_url, {}, { preserveState: true, preserveScroll: true })}
                                disabled={!feedbacks.prev_page_url}
                                className="px-5 py-2 text-sm font-semibold text-slate-400 bg-[#222a3d] rounded-lg hover:text-white hover:bg-[#3d5afe]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            
                            {/* Input Field / Total Pages */}
                            <div className="flex items-center gap-3 text-sm text-slate-400 font-headline">
                                <input
                                    type="number"
                                    value={pageInput}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    onKeyDown={handlePageJump}
                                    onBlur={handlePageJump}
                                    className="w-16 text-center bg-[#131b2e] border border-[#444656]/30 rounded-md text-white focus:ring-2 focus:ring-[#3d5afe]/50 focus:border-[#3d5afe] outline-none py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                                    min="1"
                                    max={feedbacks.last_page}
                                />
                                <span>/ {feedbacks.last_page}</span>
                            </div>
                            
                            {/* Next Button */}
                            <button
                                onClick={() => feedbacks.next_page_url && router.get(feedbacks.next_page_url, {}, { preserveState: true, preserveScroll: true })}
                                disabled={!feedbacks.next_page_url}
                                className="px-5 py-2 text-sm font-semibold text-slate-400 bg-[#222a3d] rounded-lg hover:text-white hover:bg-[#3d5afe]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}