import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ShowFeedback({ feedback }) {
    // We reuse the fixed Date formatter here
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const safeString = dateString.replace(' ', 'T');
        const date = new Date(safeString);
        
        if (isNaN(date.getTime())) return 'Invalid Date';

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return `${formattedDate} at ${formattedTime}`;
    };

    return (
        <>
            <Head title="Admin - View Feedback">
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
                
                {/* Back Navigation */}
                <div className="max-w-4xl mx-auto mb-6">
                    <Link 
                        href={route('admin.feedback.index')} 
                        className="inline-flex items-center text-[#c5c5d9] hover:text-[#bbc3ff] transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                        Back to Feedback List
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto bg-[#131b2e] rounded-xl border-none shadow-[0px_20px_40px_rgba(6,14,32,0.4)] overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-[#444656]/10 flex justify-between items-center bg-[#060e20]/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#bbc3ff]/10 flex items-center justify-center text-[#bbc3ff]">
                                <span className="material-symbols-outlined text-2xl">visibility</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white font-headline">Feedback Details</h2>
                                <p className="text-sm text-[#c5c5d9] mt-1">Viewing full context of the submitted feedback.</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-8">
                        
                        {/* User Card */}
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-[#222a3d]/30 border border-[#444656]/20">
                            <div className="w-12 h-12 rounded-full bg-[#bbc3ff]/20 flex items-center justify-center text-[#bbc3ff] font-bold text-lg">
                                {feedback.user ? feedback.user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{feedback.user ? feedback.user.name : 'Unknown User'}</h3>
                                <p className="text-[#c5c5d9] text-sm mt-0.5">{feedback.user ? feedback.user.email : 'No email provided'}</p>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs uppercase tracking-widest text-[#444656] font-bold mb-3">Category</h4>
                                <span className="inline-flex items-center px-4 py-1.5 bg-[#bbc3ff]/10 text-[#bbc3ff] text-sm font-semibold rounded-full border border-[#bbc3ff]/20">
                                    {feedback.category}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-xs uppercase tracking-widest text-[#444656] font-bold mb-3">Date Submitted</h4>
                                <p className="text-sm text-[#c5c5d9] font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg opacity-70">calendar_today</span>
                                    {formatDateTime(feedback.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Full Message */}
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-[#444656] font-bold mb-3">Full Message</h4>
                            <div className="p-6 rounded-xl bg-[#060e20]/50 border border-[#444656]/20 text-[#c5c5d9] text-base leading-relaxed whitespace-pre-wrap">
                                {feedback.message}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}