import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function FeedbackIndex({ feedbacks }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            destroy(route('admin.feedback.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Helper function to format the timestamp into "Nov 12, 2026 • 02:30 PM"
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
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
                
                {/* Optional Top Navigation/Back Button */}
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
                    
                    {/* Header Section */}
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

                    {/* Table Section */}
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
                                {feedbacks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-[#c5c5d9]">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">inbox</span>
                                                <p>No feedback records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    feedbacks.map((feedback) => (
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
                                                {feedback.message}
                                            </td>
                                            <td className="p-5 align-top text-sm text-[#c5c5d9] whitespace-nowrap font-medium">
                                                {formatDateTime(feedback.created_at)}
                                            </td>
                                            <td className="p-5 align-top text-right">
                                                <button 
                                                    onClick={() => handleDelete(feedback.id)}
                                                    className="text-[#ff4757] border border-[#ff4757]/30 hover:bg-[#ff4757]/10 px-4 py-1.5 rounded text-sm font-medium transition-colors opacity-80 hover:opacity-100"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}