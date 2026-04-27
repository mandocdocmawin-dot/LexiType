import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function Feedback({ isOpen, onClose }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        category: 'bug', 
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setIsSubmitted(false), 200);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        // Idinagdag natin itong check na ito para i-handle pareho ang form submit at keyboard submit
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        post(route('feedback.store'), {
            onSuccess: () => {
                reset();
                setIsSubmitted(true);
            },
        });
    };

    // Ito ang function na magche-check kung "Enter" ang pinindot
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Pinipigilan ang paggawa ng bagong linya
            submit(e); // Tinatawag ang submit function
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-surface-container-low rounded-xl shadow-2xl shadow-surface-container-lowest overflow-hidden border border-outline-variant/10">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors z-10"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="pt-8 px-8 pb-4">
                            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Send Feedback</h2>
                            <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                                Help us improve LexiType. Your feedback is sent directly to our development team.
                            </p>
                        </div>
                        <form onSubmit={submit} className="px-8 pb-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-primary uppercase tracking-widest font-headline">Category</label>
                                <div className="relative">
                                    <select 
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full bg-none bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface font-body text-sm focus:ring-2 focus:ring-primary-container appearance-none"
                                    >
                                        <option value="bug">Bug Report</option>
                                        <option value="feature_request">Feature Request</option>
                                        <option value="general">General</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                                    </div>
                                </div>
                                {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-primary uppercase tracking-widest font-headline">Message</label>
                                <textarea 
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    onKeyDown={handleKeyDown} 
                                    className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface font-body text-sm focus:ring-2 focus:ring-primary-container placeholder:text-outline-variant resize-none scrollbar-thin scrollbar-thumb-surface-container-highest" 
                                    placeholder="Describe your feedback here... (Press Enter to submit, Shift+Enter for new line)" 
                                    rows="5"
                                    maxLength="150"
                                    required
                                ></textarea>
                                <div className="flex justify-between items-start mt-1">
                                    <div className="text-red-500 text-xs">
                                        {errors.message && errors.message}
                                    </div>
                                    <div className={`text-[10px] font-medium ${data.message.length >= 150 ? 'text-red-500' : 'text-on-surface-variant'}`}>
                                        {data.message.length} / 150
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button 
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-br from-primary-container to-primary text-on-primary-fixed font-headline font-bold py-3.5 rounded-lg text-sm tracking-wide active:scale-95 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50" 
                                    type="submit"
                                >
                                    {processing ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-surface-container-highest/50 text-on-surface font-headline font-bold py-3.5 rounded-lg text-sm tracking-wide hover:bg-surface-container-highest transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="pt-16 px-8 pb-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-primary-container/20 p-4 rounded-full mb-6">
                            <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
                        </div>
                        
                        <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">
                            Feedback Sent!
                        </h2>
                        
                        <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-10 max-w-[85%] mx-auto">
                            Thank you for helping us improve LexiType.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button 
                                type="button"
                                onClick={() => setIsSubmitted(false)}
                                className="flex-1 bg-surface-container-highest/50 text-on-surface font-headline font-bold py-3.5 rounded-lg text-sm tracking-wide hover:bg-surface-container-highest transition-all"
                            >
                                SUBMIT ANOTHER
                            </button>
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gradient-to-br from-primary-container to-primary text-on-primary-fixed font-headline font-bold py-3.5 rounded-lg text-sm tracking-wide active:scale-95 transition-all shadow-lg shadow-primary-container/20"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}