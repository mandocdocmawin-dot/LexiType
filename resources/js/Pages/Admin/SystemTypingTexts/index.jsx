import { useState, useEffect } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

function charCount(str) {
    if (!str) return '0';
    const len = str.length;
    if (len >= 1000) return `${(len / 1000).toFixed(1)}k`;
    return String(len);
}

function ConfirmModal({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="rounded-2xl p-8 w-full max-w-sm shadow-2xl" style={{ background: '#171f33', border: '1px solid rgba(68,70,86,0.4)' }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#dae2fd' }}>{title}</h3>
                <p className="text-sm mb-6" style={{ color: '#8e8fa2' }}>{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ border: '1px solid #444656', color: '#c5c5d9' }}>Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        style={danger
                            ? { background: 'rgba(210,35,72,0.15)', border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7' }
                            : { background: 'rgba(61,90,254,0.15)', border: '1px solid rgba(187,195,255,0.3)', color: '#bbc3ff' }
                        }>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

export default function SystemTypingTextsIndex({ texts = [], categories = [] }) {
    const { flash, auth } = usePage().props;
    const [selected, setSelected] = useState(texts[0] ?? null);
    const [creating, setCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [flashMsg, setFlashMsg] = useState(flash?.success ?? null);
    const [deleteModal, setDeleteModal] = useState(false);

    // Pagination
    const ITEMS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(texts.length / ITEMS_PER_PAGE) || 1;
    const paginatedTexts = texts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Editable fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setFlashMsg(flash.success);
            const t = setTimeout(() => setFlashMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    // When selected text changes, populate editor
    useEffect(() => {
        if (selected && !creating) {
            setTitle(selected.category ?? '');
            setContent(selected.content ?? '');
            setDifficulty(selected.difficulty_level ?? 'medium');
            setIsActive(selected.is_active ?? false);
        }
    }, [selected]);

    const startCreate = () => {
        setCreating(true);
        setSelected(null);
        setTitle('');
        setContent('');
        setDifficulty('medium');
        setIsActive(false);
    };

    const selectText = (txt) => {
        setCreating(false);
        setSelected(txt);
    };

    const handleSaveDraft = () => {
        if (creating) {
            router.post(route('admin.typing-texts.store'), { category: title, content, difficulty_level: difficulty, is_active: false }, {
                onSuccess: () => { setCreating(false); },
            });
        } else if (selected) {
            router.put(route('admin.typing-texts.update', selected.id), { category: title, content, difficulty_level: difficulty, is_active: false });
        }
    };

    const handlePublish = () => {
        if (creating) {
            router.post(route('admin.typing-texts.store'), { category: title, content, difficulty_level: difficulty, is_active: true }, {
                onSuccess: () => { setCreating(false); },
            });
        } else if (selected) {
            router.put(route('admin.typing-texts.update', selected.id), { category: title, content, difficulty_level: difficulty, is_active: true });
        }
    };

    const handleDelete = () => {
        if (selected) {
            router.delete(route('admin.typing-texts.destroy', selected.id), {
                onSuccess: () => { setSelected(texts[0] ?? null); setDeleteModal(false); },
            });
        }
    };

    const tabs = ['Dashboard', 'Arena', 'Analytics'];
    const adminInitial = (auth?.user?.name ?? 'A').charAt(0);
    const MAX_CHARS = 5000;

    return (
        <AdminLayout>
            <Head title="Lab Admin Typing Texts" />
            <style>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0b1326; }
                ::-webkit-scrollbar-thumb { background: #2d3449; border-radius: 10px; }
                .glass-panel { background: rgba(19, 27, 46, 0.7); backdrop-filter: blur(12px); }
                body, html { overflow: hidden; }
            `}</style>

            {flashMsg && (
                <div className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
                    style={{ background: 'rgba(78,222,163,0.15)', border: '1px solid rgba(78,222,163,0.3)', color: '#4edea3', backdropFilter: 'blur(12px)' }}>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    {flashMsg}
                </div>
            )}

            <Navbar auth={auth} />

            <div className="flex flex-col mt-20" style={{ height: 'calc(100vh - 80px)', overflow: 'hidden' }}>


                {/* ── Master-Detail Content ── */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ── Master List Panel ── */}
                    <section className="w-96 flex flex-col z-10 shadow-2xl"
                        style={{ background: '#131b2e', borderRight: '1px solid rgba(68,70,86,0.15)' }}>
                        <div className="p-6">
                            <button onClick={startCreate}
                                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                style={{ fontFamily: 'Space Grotesk', background: '#3d5afe', color: '#f1f0ff', boxShadow: '0 8px 24px rgba(61,90,254,0.2)' }}>
                                <span className="material-symbols-outlined">add_circle</span>
                                Create New Typing Text
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                            <div className="px-2 py-2 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Recent Typing Texts</span>
                                <span className="text-[10px] font-bold tracking-widest" style={{ color: '#475569' }}>{texts.length} total</span>
                            </div>

                            {texts.length === 0 && (
                                <div className="px-4 py-8 text-center flex-1">
                                    <span className="material-symbols-outlined block mb-2" style={{ fontSize: 36, color: '#2d3449' }}>science</span>
                                    <p className="text-xs" style={{ color: '#64748b' }}>No typing texts yet. Create one!</p>
                                </div>
                            )}

                            {paginatedTexts.map(txt => {
                                const isSelected = !creating && selected?.id === txt.id;
                                return (
                                    <div key={txt.id} onClick={() => selectText(txt)}
                                        className="group p-4 cursor-pointer transition-colors"
                                        style={isSelected
                                            ? { background: 'rgba(45,52,73,0.6)', borderLeft: '4px solid #bbc3ff', borderRadius: '0 12px 12px 0' }
                                            : { borderLeft: '4px solid transparent', borderRadius: '12px' }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#222a3d'; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#dae2fd' : '#cbd5e1' }}>
                                                {txt.category || 'Untitled'}
                                            </h4>
                                            <span className="material-symbols-outlined text-lg"
                                                style={txt.is_active
                                                    ? { color: '#4edea3', fontVariationSettings: "'FILL' 1" }
                                                    : { color: '#475569' }}>
                                                {txt.is_active ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </div>
                                        <p className="text-xs line-clamp-1" style={{ color: isSelected ? '#c5c5d9' : '#64748b' }}>
                                            {txt.content?.substring(0, 60) || 'No content...'}
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className="text-[10px] px-2 py-1 rounded font-mono" style={{ background: '#020617', color: '#94a3b8' }}>
                                                {charCount(txt.content)} chars
                                            </span>
                                            {txt.is_active ? (
                                                <span className="text-[10px] px-2 py-1 rounded font-bold" style={{ background: 'rgba(78,222,163,0.1)', color: '#4edea3' }}>PUBLISHED</span>
                                            ) : (
                                                <span className="text-[10px] px-2 py-1 rounded font-bold" style={{ background: 'rgba(68,70,86,0.3)', color: '#94a3b8' }}>DRAFT</span>
                                            )}
                                            {/* Action buttons — visible on hover */}
                                            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={route('admin.typing-texts.show', txt.id)} onClick={e => e.stopPropagation()} title="View"
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-indigo-500/10"
                                                    style={{ color: '#818cf8' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                                                </Link>
                                                <Link href={route('admin.typing-texts.edit', txt.id)} onClick={e => e.stopPropagation()} title="Edit"
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-amber-500/10"
                                                    style={{ color: '#f59e0b' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                                                </Link>
                                                <button onClick={e => { e.stopPropagation(); setDeleteModal(true); setSelected(txt); }} title="Delete"
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                                                    style={{ color: '#ffb2b7' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls Fixed at Bottom */}
                        {texts.length > ITEMS_PER_PAGE && (
                            <div className="px-6 py-4 border-t shrink-0" style={{ borderColor: 'rgba(68,70,86,0.15)', background: '#131b2e' }}>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 hover:text-[#dae2fd] transition-colors disabled:opacity-30 disabled:hover:text-[#64748b]"
                                    >
                                        &lt; PREV
                                    </button>
                                    <span>{currentPage} / {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 hover:text-[#dae2fd] transition-colors disabled:opacity-30 disabled:hover:text-[#64748b]"
                                    >
                                        NEXT &gt;
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ── Detail View Panel ── */}
                    <section className="flex-1 flex flex-col relative overflow-hidden" style={{ background: '#0b1326', overflow: 'hidden' }}>
                        {/* Decorative blur */}
                        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full" style={{ background: 'rgba(61,90,254,0.05)', filter: 'blur(120px)' }} />

                        {(selected || creating) ? (
                            <div className="flex-1 overflow-y-auto p-12 relative z-20">
                                <div className="max-w-4xl mx-auto space-y-12">



                                    {/* Editor */}
                                    <div className="space-y-8">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold ml-1" style={{ color: 'rgba(99,102,241,0.8)' }}>Typing Text Title</label>
                                            <select value={title} onChange={e => setTitle(e.target.value)}
                                                className="w-full bg-transparent border-none p-0 text-5xl font-bold focus:ring-0 focus:outline-none tracking-tight cursor-pointer"
                                                style={{ fontFamily: 'Space Grotesk', color: '#dae2fd' }}
                                            >
                                                <option value="" disabled style={{ background: '#0b1326', fontSize: '1rem' }}>Select typing text title...</option>
                                                {categories.map((cat, index) => (
                                                    <option key={index} value={cat} style={{ background: '#0b1326', fontSize: '1rem' }}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] uppercase tracking-widest font-bold ml-1" style={{ color: 'rgba(99,102,241,0.8)' }}>Practice Content</label>
                                                <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full"
                                                    style={{ color: '#64748b', background: '#222a3d', border: '1px solid rgba(68,70,86,0.15)' }}>
                                                    <span style={{ color: '#bbc3ff', fontWeight: 700 }}>{content.length.toLocaleString()}</span> / {MAX_CHARS.toLocaleString()} characters
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <textarea
                                                    value={content}
                                                    onChange={e => { if (e.target.value.length <= MAX_CHARS) setContent(e.target.value); }}
                                                    placeholder="Paste or type the typing practice content here. Use varied vocabulary for better practice..."
                                                    className="w-full h-[450px] rounded-2xl p-8 text-xl leading-relaxed focus:ring-2 focus:border-transparent transition-all outline-none"
                                                    style={{
                                                        fontFamily: 'Inter', background: '#060e20', color: '#c5c5d9',
                                                        border: '1px solid rgba(68,70,86,0.1)',
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Difficulty selector */}
                                        <div className="flex items-center gap-4">
                                            <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(99,102,241,0.8)' }}>Difficulty</label>
                                            <div className="flex gap-2">
                                                {['easy', 'medium', 'hard'].map(d => (
                                                    <button key={d} onClick={() => setDifficulty(d)}
                                                        className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                                                        style={difficulty === d
                                                            ? { background: '#3d5afe', color: '#f1f0ff' }
                                                            : { background: '#222a3d', color: '#8e8fa2', border: '1px solid rgba(68,70,86,0.3)' }}>
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Toolbar */}
                                    <div className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid rgba(68,70,86,0.15)' }}>
                                        {!creating && selected ? (
                                            <button onClick={() => setDeleteModal(true)}
                                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm group transition-colors"
                                                style={{ color: '#ffb2b7' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(210,35,72,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">delete</span>
                                                Delete Typing Text
                                            </button>
                                        ) : <div />}
                                        <div className="flex items-center gap-4">
                                            <button onClick={handleSaveDraft}
                                                className="px-8 py-3 rounded-xl font-bold text-sm transition-colors"
                                                style={{ background: '#222a3d', color: '#c5c5d9', border: '1px solid rgba(68,70,86,0.3)' }}>
                                                Save as Draft
                                            </button>
                                            <button onClick={handlePublish}
                                                className="px-10 py-3 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
                                                style={{ background: '#3d5afe', color: '#f1f0ff', boxShadow: '0 8px 24px rgba(61,90,254,0.3)' }}>
                                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>publish</span>
                                                Publish Typing Text
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty state */
                            <div className="flex-1 flex items-center justify-center relative z-20">
                                <div className="text-center">
                                    <span className="material-symbols-outlined block mb-4" style={{ fontSize: 64, color: '#2d3449' }}>science</span>
                                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk', color: '#64748b' }}>Select a typing text</h3>
                                    <p className="text-sm" style={{ color: '#475569' }}>Choose from the list or create a new one</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <ConfirmModal open={deleteModal}
                title={`Delete "${title}"?`}
                message="This typing text will be permanently removed. This cannot be undone."
                confirmLabel="Delete Typing Text" danger
                onCancel={() => setDeleteModal(false)}
                onConfirm={handleDelete} />
        </AdminLayout>
    );
}