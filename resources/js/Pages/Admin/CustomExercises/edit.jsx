import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const MAX_CHARS = 5000;

export default function EditExercise({ exercise }) {
    const [form, setForm] = useState({
        category: exercise.category ?? '',
        content: exercise.content ?? '',
        difficulty_level: exercise.difficulty_level ?? 'medium',
        is_active: exercise.is_active ?? false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = (publish) => {
        setSubmitting(true);
        router.put(route('admin.exercises.update', exercise.id), { ...form, is_active: publish }, {
            onError: (err) => { setErrors(err); setSubmitting(false); },
            onSuccess: () => setSubmitting(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Permanently delete this exercise?')) {
            router.delete(route('admin.exercises.destroy', exercise.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Edit — ${exercise.category}`} />
            <style>{`::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0b1326}::-webkit-scrollbar-thumb{background:#2d3449;border-radius:10px}`}</style>
            <div className="min-h-screen p-8" style={{ background: '#0b1326' }}>
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#64748b' }}>
                        <Link href={route('admin.exercises.index')} className="hover:text-indigo-400 transition-colors">Lab</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link href={route('admin.exercises.index')} className="hover:text-indigo-400 transition-colors">Exercises</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span style={{ color: '#bbc3ff' }}>{form.category || 'Edit'}</span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold ml-1" style={{ color: 'rgba(99,102,241,0.8)' }}>Exercise Title</label>
                        <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="Enter exercise title..."
                            className="w-full bg-transparent border-none p-0 text-5xl font-bold focus:ring-0 focus:outline-none tracking-tight"
                            style={{ fontFamily: 'Space Grotesk', color: '#dae2fd', caretColor: '#bbc3ff' }} />
                        {errors.category && <p className="text-xs mt-1" style={{ color: '#ffb2b7' }}>{errors.category}</p>}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-widest font-bold ml-1" style={{ color: 'rgba(99,102,241,0.8)' }}>Practice Content</label>
                            <div className="text-xs font-mono px-3 py-1 rounded-full" style={{ color: '#64748b', background: '#222a3d', border: '1px solid rgba(68,70,86,0.15)' }}>
                                <span style={{ color: '#bbc3ff', fontWeight: 700 }}>{form.content.length.toLocaleString()}</span> / {MAX_CHARS.toLocaleString()} characters
                            </div>
                        </div>
                        <textarea value={form.content} onChange={e => { if (e.target.value.length <= MAX_CHARS) set('content', e.target.value); }}
                            placeholder="Paste or type the typing exercise content here..."
                            className="w-full h-[450px] rounded-2xl p-8 text-xl leading-relaxed focus:ring-2 focus:border-transparent transition-all outline-none"
                            style={{ fontFamily: 'Inter', background: '#060e20', color: '#c5c5d9', border: '1px solid rgba(68,70,86,0.1)' }} />
                        {errors.content && <p className="text-xs" style={{ color: '#ffb2b7' }}>{errors.content}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(99,102,241,0.8)' }}>Difficulty</label>
                        <div className="flex gap-2">
                            {['easy', 'medium', 'hard'].map(d => (
                                <button key={d} type="button" onClick={() => set('difficulty_level', d)}
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                                    style={form.difficulty_level === d ? { background: '#3d5afe', color: '#f1f0ff' } : { background: '#222a3d', color: '#8e8fa2', border: '1px solid rgba(68,70,86,0.3)' }}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid rgba(68,70,86,0.15)' }}>
                        <button type="button" onClick={handleDelete}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm group transition-colors"
                            style={{ color: '#ffb2b7' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(210,35,72,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">delete</span>
                            Delete Exercise
                        </button>
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => handleSubmit(false)} disabled={submitting}
                                className="px-8 py-3 rounded-xl font-bold text-sm" style={{ background: '#222a3d', color: '#c5c5d9', border: '1px solid rgba(68,70,86,0.3)' }}>
                                Save as Draft
                            </button>
                            <button type="button" onClick={() => handleSubmit(true)} disabled={submitting}
                                className="px-10 py-3 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
                                style={{ background: '#3d5afe', color: '#f1f0ff', boxShadow: '0 8px 24px rgba(61,90,254,0.3)' }}>
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>publish</span>
                                Publish Exercise
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
