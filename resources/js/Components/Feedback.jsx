import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Feedback({ isOpen, onClose }) {
    // In-update natin para mag-match sa iyong factory values
    const { data, setData, post, processing, reset, errors } = useForm({
        category: 'bug', 
        message: '',
    });

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('feedback.store'), {
            onSuccess: () => {
                reset();
                onClose();
                alert('Thank you for your feedback!'); 
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-surface-container-low rounded-xl shadow-2xl shadow-surface-container-lowest overflow-hidden border border-outline-variant/10">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                <div className="pt-8 px-8 pb-4">
                    <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Send Feedback</h2>
                    <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                        Help us improve the Kinetic Laboratory. Your feedback is sent directly to our development team.
                    </p>
                </div>
                <form onSubmit={submit} className="px-8 pb-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-primary uppercase tracking-widest font-headline">Category</label>
                        <div className="relative">
                            <select 
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface font-body text-sm focus:ring-2 focus:ring-primary-container appearance-none"
                            >
                                {/* Dito inayos natin ang values para parehas sa DB Factory mo */}
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
                            className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface font-body text-sm focus:ring-2 focus:ring-primary-container placeholder:text-outline-variant resize-none scrollbar-thin scrollbar-thumb-surface-container-highest" 
                            placeholder="Describe your feedback here..." 
                            rows="5"
                            required
                        ></textarea>
                        {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
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
            </div>
        </div>
    );
}