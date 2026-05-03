import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function charCount(str) {
    if (!str) return '0';
    const len = str.length;
    if (len >= 1000) return `${(len / 1000).toFixed(1)}k`;
    return String(len);
}

export default function ShowSystemTypingText({ text }) {
    const handleDelete = () => {
        if (confirm('Permanently delete this typing text?')) {
            router.delete(route('admin.typing-texts.destroy', text.id));
        }
    };

    const diffLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    const diffColor = { easy: '#4edea3', medium: '#f59e0b', hard: '#ffb2b7' };

    return (
        <AdminLayout>
            <Head title={`${text.category} — Typing Text`} />
            <style>{`::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0b1326}::-webkit-scrollbar-thumb{background:#2d3449;border-radius:10px}`}</style>

            <div className="min-h-screen p-8" style={{ background: '#0b1326' }}>
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* Breadcrumb + Edit */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#64748b' }}>
                            <Link href={route('admin.typing-texts.index')} className="hover:text-indigo-400 transition-colors">Lab</Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <Link href={route('admin.typing-texts.index')} className="hover:text-indigo-400 transition-colors">Typing Texts</Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span style={{ color: '#bbc3ff' }}>{text.category}</span>
                        </div>
                        <Link href={route('admin.typing-texts.edit', text.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: '#222a3d', color: '#bbc3ff', border: '1px solid rgba(68,70,86,0.3)' }}>
                            <span className="material-symbols-outlined text-base">edit</span>Edit
                        </Link>
                    </div>

                    {/* Title */}
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold mb-2 block" style={{ color: 'rgba(99,102,241,0.8)' }}>Typing Text Title</span>
                        <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk', color: '#dae2fd' }}>{text.category}</h1>
                    </div>

                    {/* Meta badges */}
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] px-3 py-1.5 rounded-lg font-bold" style={{ background: 'rgba(78,222,163,0.1)', color: text.is_active ? '#4edea3' : '#94a3b8' }}>
                            {text.is_active ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                        <span className="text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase" style={{ background: '#020617', color: diffColor[text.difficulty_level] ?? '#94a3b8' }}>
                            {diffLabel[text.difficulty_level] ?? text.difficulty_level}
                        </span>
                        <span className="text-[10px] px-3 py-1.5 rounded-lg font-mono" style={{ background: '#020617', color: '#94a3b8' }}>
                            {charCount(text.content)} chars
                        </span>
                        <span className="text-xs" style={{ color: '#64748b' }}>Created {formatDate(text.created_at)}</span>
                    </div>

                    {/* Content preview */}
                    <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(99,102,241,0.8)' }}>Practice Content</span>
                        <div className="rounded-2xl p-8 text-lg leading-relaxed" style={{ background: '#060e20', color: '#c5c5d9', border: '1px solid rgba(68,70,86,0.1)', minHeight: 200, whiteSpace: 'pre-wrap' }}>
                            {text.content || 'No content.'}
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid rgba(68,70,86,0.15)' }}>
                        <button onClick={handleDelete}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm group transition-colors"
                            style={{ color: '#ffb2b7' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(210,35,72,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">delete</span>
                            Delete Typing Text
                        </button>
                        <Link href={route('admin.typing-texts.edit', text.id)}
                            className="px-10 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
                            style={{ background: '#3d5afe', color: '#f1f0ff', boxShadow: '0 8px 24px rgba(61,90,254,0.3)' }}>
                            <span className="material-symbols-outlined text-lg">edit</span>Edit Typing Text
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}