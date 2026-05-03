import { useState, useEffect, useRef } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

function timeAgo(dateStr) {
    if (!dateStr) return 'Never';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

const AVATAR_COLORS = ['#3d5afe', '#00a572', '#d22348', '#7c3aed', '#0ea5e9', '#f59e0b'];
function avatarBg(name) { return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]; }

function Avatar({ name, size = 40, shape = 'rounded-lg' }) {
    const initials = (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className={`flex items-center justify-center font-bold text-white flex-shrink-0 select-none ${shape}`}
            style={{ width: size, height: size, background: avatarBg(name), fontSize: size * 0.36 }}>
            {initials}
        </div>
    );
}

function roleBadgeClass(role) {
    if (role === 'Administrator') return 'bg-indigo-500/10 text-indigo-400';
    return 'bg-surface-container-highest text-outline';
}
function statusDotClass(status) {
    if (status === 'Active') return 'bg-secondary';
    if (status === 'Suspended') return 'bg-tertiary';
    return 'bg-amber-400';
}
function statusTextClass(status) {
    if (status === 'Active') return 'text-secondary';
    if (status === 'Suspended') return 'text-tertiary';
    return 'text-amber-400';
}

function ConfirmModal({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div style={{ backgroundColor: '#171f33', border: '1px solid rgba(68,70,86,0.4)' }} className="rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#dae2fd' }}>{title}</h3>
                <p className="text-sm mb-6" style={{ color: '#8e8fa2' }}>{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ border: '1px solid #444656', color: '#c5c5d9', background: 'transparent' }}>Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={danger ? { background: 'rgba(210,35,72,0.15)', border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7' } : { background: 'rgba(61,90,254,0.15)', border: '1px solid rgba(187,195,255,0.3)', color: '#bbc3ff' }}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

function UserPanel({ user, onClose, onDelete }) {
    const [modal, setModal] = useState(null);
    if (!user) return null;

    const actions = {
        delete: { title: `Permanently delete ${user.name}?`, message: 'All sessions, stats, and data tied to this account will be erased. This cannot be undone.', confirmLabel: 'Delete User Data', danger: true, fn: onDelete },
    };
    const active = modal ? actions[modal] : null;
    const subtitle = user.title ?? user.job_title ?? user.role ?? 'Registered User';

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
            <div className="fixed inset-0 z-40" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <aside
                className="fixed top-0 right-0 h-full overflow-y-auto z-50 shadow-2xl"
                style={{ width: 400, background: 'rgba(19,27,46,0.7)', backdropFilter: 'blur(24px)', animation: 'slideInRight 0.22s cubic-bezier(0.4,0,0.2,1)' }}
            >
                <div className="p-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk', color: '#bbc3ff' }}>User Profile</h3>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-surface-container-highest">
                            <span className="material-symbols-outlined" style={{ color: '#8e8fa2' }}>close</span>
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative mb-4">
                            <Avatar name={user.name} size={96} shape="rounded-2xl" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4" style={{ borderColor: '#0b1326', background: user.status === 'Active' ? '#4edea3' : user.status === 'Suspended' ? '#ffb2b7' : '#f59e0b' }} />
                        </div>
                        <h4 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#dae2fd' }}>{user.name}</h4>
                        <p className="text-sm capitalize" style={{ color: '#8e8fa2' }}>{subtitle}</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* About */}
                        <div className="p-5 rounded-xl" style={{ background: 'rgba(45,52,73,0.4)' }}>
                            <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#bbc3ff' }}>About User</h5>
                            <p className="text-sm leading-relaxed" style={{ color: '#c5c5d9' }}>
                                {user.bio || `${user.name} is a registered user on LexiType. No additional bio provided.`}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(45,52,73,0.4)' }}>
                                <span className="text-[10px] uppercase block mb-1" style={{ color: '#8e8fa2' }}>Avg Speed</span>
                                <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#4edea3' }}>
                                    {user.avg_wpm ?? '—'}<span className="text-xs font-normal ml-1">WPM</span>
                                </span>
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(45,52,73,0.4)' }}>
                                <span className="text-[10px] uppercase block mb-1" style={{ color: '#8e8fa2' }}>Accuracy</span>
                                <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#bbc3ff' }}>
                                    {user.accuracy != null ? Number(user.accuracy).toFixed(1) : '—'}<span className="text-xs font-normal ml-1">%</span>
                                </span>
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="space-y-3">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#bbc3ff' }}>Activity Stats</h5>
                            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(68,70,86,0.1)' }}>
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>Typing Rank</span>
                                <span className="text-sm font-medium" style={{ color: user.typing_rank ? '#4edea3' : '#8e8fa2' }}>
                                    {user.typing_rank ? `#${user.typing_rank}` : 'Unranked'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(68,70,86,0.1)' }}>
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>Last Practice</span>
                                <span className="text-sm font-medium" style={{ color: '#dae2fd' }}>{timeAgo(user.last_practice_at)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>Completed Exercises</span>
                                <span className="text-sm font-medium" style={{ color: '#dae2fd' }}>{user.completed_exercises ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-8 space-y-3">
                        <button
                            onClick={() => setModal('delete')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{ border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7', background: 'transparent' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,178,183,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span className="material-symbols-outlined text-lg">delete_forever</span>
                            Delete User Data
                        </button>
                    </div>
                </div>
            </aside>

            <ConfirmModal open={!!modal} title={active?.title} message={active?.message} confirmLabel={active?.confirmLabel} danger={active?.danger}
                onCancel={() => setModal(null)}
                onConfirm={() => { active?.fn(); setModal(null); onClose(); }} />
        </>
    );
}

export default function ManageUsersIndex({ users = [], filters = {} }) {
    const { flash, auth } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedUser, setSelectedUser] = useState(null);
    const [flashMsg, setFlashMsg] = useState(flash?.success ?? null);
    const debounceRef = useRef(null);
    // Normalize the `users` prop. If backend sent a paginator object
    // it will typically be { data: [...], current_page, last_page, ... }
    // If the backend sent a plain array (old behavior) we keep that too.
    const list = Array.isArray(users) ? users : (users?.data ?? []);
    const pagination = users && !Array.isArray(users) ? (users.meta ?? users) : null;
    const currentPage = pagination?.current_page ?? pagination?.currentPage ?? 1;
    const lastPage = pagination?.last_page ?? pagination?.lastPage ?? 1;
    const prevUrl = users && !Array.isArray(users) ? users.prev_page_url : null;
    const nextUrl = users && !Array.isArray(users) ? users.next_page_url : null;

    const [pageInput, setPageInput] = useState(currentPage);

    useEffect(() => { setPageInput(currentPage); }, [currentPage]);

    const handlePageJump = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let page = parseInt(pageInput);

            if (isNaN(page) || page < 1) page = 1;
            if (page > lastPage) page = lastPage;

            setPageInput(page);

            if (page !== currentPage) {
                router.get(route('admin.users.index'), { search, page: page }, { 
                    preserveState: true, 
                    preserveScroll: true 
                });
            }
        }
    };

    useEffect(() => {
        if (flash?.success) {
            setFlashMsg(flash.success);
            const t = setTimeout(() => setFlashMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const applyFilters = (overrides = {}) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('admin.users.index'), { search, ...overrides }, { preserveState: true, replace: true });
        }, 350);
    };

    const handleSearch = v => { setSearch(v); applyFilters({ search: v }); };

    const doDelete = u => router.delete(route('admin.users.destroy', u.id), { onSuccess: () => setSelectedUser(null) });

    return (
        <AdminLayout>
            <Head title="User Management" />
            <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0b1326; }
                ::-webkit-scrollbar-thumb { background: #2d3449; border-radius: 10px; }
            `}</style>

            {flashMsg && (
                <div className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium" style={{ background: 'rgba(78,222,163,0.15)', border: '1px solid rgba(78,222,163,0.3)', color: '#4edea3', backdropFilter: 'blur(12px)' }}>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    {flashMsg}
                </div>
            )}

            <Navbar auth={auth} />


            {/* ── Content ── */}
            {/* Added mt-20 to push this section down below the Navbar */}
            <section className="p-8 mt-20 space-y-8 flex-1">

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl" style={{ background: '#131b2e' }}>
                    <div className="relative flex-1 max-w-lg">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8e8fa2' }}>search</span>
                        <input type="text" placeholder="Search by username, email or ID..."
                            value={search} onChange={e => handleSearch(e.target.value)}
                            className="w-full rounded-lg pl-12 pr-4 py-3 text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            style={{ background: '#060e20', color: '#dae2fd' }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={route('admin.users.create')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110" style={{ background: '#00a572', color: '#f1f0ff' }}>
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Create User
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#131b2e' }}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: '#171f33' }}>
                                {['User', 'Email Address', 'Joined Date', 'Actions'].map((col, i) => (
                                    <th key={col} className={`px-6 py-4 text-[11px] uppercase font-bold tracking-[0.15em]${i === 3 ? ' text-right' : ''}`} style={{ color: '#8e8fa2' }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: '1px solid rgba(68,70,86,0.1)' }}>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <span className="material-symbols-outlined block mb-3" style={{ fontSize: 48, color: '#2d3449' }}>manage_accounts</span>
                                        <p className="text-sm" style={{ color: '#8e8fa2' }}>No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                list.map((user, idx) => (
                                    <tr key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={user.name} size={40} shape="rounded-lg" />
                                                <div>
                                                    <div className="text-sm font-bold" style={{ color: '#dae2fd' }}>{user.name}</div>
                                                    <div className="text-[10px]" style={{ color: '#8e8fa2' }}>ID: KL-{String(user.id).padStart(5, '0')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm" style={{ color: '#c5c5d9' }}>{user.email}</td>
                                        <td className="px-6 py-5 text-sm" style={{ color: '#c5c5d9' }}>{formatDate(user.created_at)}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('admin.users.show', user.id)} onClick={e => e.stopPropagation()} title="View" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-indigo-500/10" style={{ color: '#818cf8' }}>
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </Link>
                                                <Link href={route('admin.users.edit', user.id)} onClick={e => e.stopPropagation()} title="Edit" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-amber-500/10" style={{ color: '#f59e0b' }}>
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </Link>
                                                <button onClick={e => { e.stopPropagation(); if(confirm(`Delete ${user.name}?`)) doDelete(user); }} title="Delete" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10" style={{ color: '#ffb2b7' }}>
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* --- PAGINATION CONTROLS --- */}
                    {list.length > 0 && (
                        <div className="flex items-center justify-between p-6 border-t border-[#444656]/10 rounded-b-xl" style={{ background: '#131b2e' }}>
                            <span className="text-sm font-medium" style={{ color: '#8e8fa2' }}>
                                Showing {pagination ? ((currentPage - 1) * pagination.per_page + 1) : 1}-{pagination ? Math.min(currentPage * pagination.per_page, pagination.total) : list.length} of {pagination ? pagination.total : list.length} users
                            </span>
                            
                            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                                <button
                                    onClick={() => prevUrl ? router.get(prevUrl, {}, { preserveState: true, preserveScroll: true }) : (currentPage > 1 && router.get(route('admin.users.index'), { search, page: currentPage - 1 }, { preserveState: true, preserveScroll: true }))}
                                    disabled={!prevUrl && currentPage <= 1}
                                    className="flex items-center gap-1 hover:text-[#dae2fd] transition-colors disabled:opacity-30 disabled:hover:text-[#64748b]"
                                >
                                    &lt; PREV
                                </button>
                                
                                <span>{currentPage} / {lastPage}</span>
                                
                                <button
                                    onClick={() => nextUrl ? router.get(nextUrl, {}, { preserveState: true, preserveScroll: true }) : (currentPage < lastPage && router.get(route('admin.users.index'), { search, page: currentPage + 1 }, { preserveState: true, preserveScroll: true }))}
                                    disabled={!nextUrl && currentPage >= lastPage}
                                    className="flex items-center gap-1 hover:text-[#dae2fd] transition-colors disabled:opacity-30 disabled:hover:text-[#64748b]"
                                >
                                    NEXT &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {selectedUser && (
                <UserPanel user={selectedUser} onClose={() => setSelectedUser(null)}
                    onDelete={() => doDelete(selectedUser)} />
            )}
        </AdminLayout>
    );
}