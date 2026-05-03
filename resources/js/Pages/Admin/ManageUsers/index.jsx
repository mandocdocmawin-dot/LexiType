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
    if (role === 'Moderator') return 'bg-indigo-500/10 text-indigo-400';
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

function UserPanel({ user, onClose, onSuspend, onResetPassword, onDelete }) {
    const [modal, setModal] = useState(null);
    if (!user) return null;

    const actions = {
        suspend: { title: `Suspend ${user.name}?`, message: 'This will lock the user out immediately. You can reactivate from the edit screen.', confirmLabel: 'Suspend Account', danger: true, fn: onSuspend },
        reset: { title: `Reset password for ${user.name}?`, message: 'A new random password will be generated. The user must change it on next login.', confirmLabel: 'Reset Password', danger: false, fn: onResetPassword },
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
                        <p className="text-sm" style={{ color: '#8e8fa2' }}>{subtitle}</p>
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

                        {/* System Stats */}
                        <div className="space-y-3">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#bbc3ff' }}>System Stats</h5>
                            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(68,70,86,0.1)' }}>
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>Last Login</span>
                                <span className="text-sm font-medium" style={{ color: '#dae2fd' }}>{timeAgo(user.last_login_at)}</span>
                            </div>
                            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(68,70,86,0.1)' }}>
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>Account Type</span>
                                <span className="text-sm font-medium" style={{ color: '#dae2fd' }}>{user.account_type ?? 'Standard'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-sm" style={{ color: '#c5c5d9' }}>MFA Status</span>
                                <span className="text-sm font-medium" style={{ color: user.mfa_enabled ? '#4edea3' : '#8e8fa2' }}>
                                    {user.mfa_enabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-8 space-y-3">
                        <button onClick={() => setModal('reset')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-90" style={{ background: '#2d3449', color: '#dae2fd' }}>
                            <span className="material-symbols-outlined text-lg">lock_reset</span>
                            Reset Password
                        </button>
                        <button onClick={() => setModal('suspend')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all" style={{ border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7', background: 'transparent' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,178,183,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span className="material-symbols-outlined text-lg">block</span>
                            Suspend Account
                        </button>
                        <button onClick={() => setModal('delete')} className="w-full text-[10px] uppercase tracking-widest font-bold py-2 transition-colors" style={{ color: '#8e8fa2' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#c5c5d9'}
                            onMouseLeave={e => e.currentTarget.style.color = '#8e8fa2'}>
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
    const [role, setRole] = useState(filters.role ?? 'All Roles');
    const [status, setStatus] = useState(filters.status ?? 'All Status');
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeTab, setActiveTab] = useState('Directory');
    const [flashMsg, setFlashMsg] = useState(flash?.success ?? null);
    const debounceRef = useRef(null);

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
            router.get(route('admin.users.index'), { search, role, status, ...overrides }, { preserveState: true, replace: true });
        }, 350);
    };

    const handleSearch = v => { setSearch(v); applyFilters({ search: v }); };
    const handleRole = v => { setRole(v); applyFilters({ role: v }); };
    const handleStatus = v => { setStatus(v); applyFilters({ status: v }); };

    const doSuspend = u => router.patch(route('admin.users.suspend', u.id), {}, { onSuccess: () => setSelectedUser(null) });
    const doResetPassword = u => router.post(route('admin.users.reset-password', u.id), {}, { onSuccess: () => setSelectedUser(null) });
    const doDelete = u => router.delete(route('admin.users.destroy', u.id), { onSuccess: () => setSelectedUser(null) });

    const tabs = ['Active Sessions', 'Directory', 'Audit Logs'];
    const adminInitial = (auth?.user?.name ?? 'A').charAt(0);

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
                        <div className="flex items-center rounded-lg px-3 py-1.5 gap-2" style={{ background: '#2d3449' }}>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8e8fa2' }}>Role:</span>
                            <select value={role} onChange={e => handleRole(e.target.value)} className="border-none text-sm py-1 pr-8 focus:ring-0 outline-none" style={{ background: 'transparent', color: '#dae2fd' }}>
                                {['All Roles', 'Administrator', 'Moderator', 'Member'].map(r => <option key={r} value={r} style={{ background: '#171f33' }}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center rounded-lg px-3 py-1.5 gap-2" style={{ background: '#2d3449' }}>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8e8fa2' }}>Status:</span>
                            <select value={status} onChange={e => handleStatus(e.target.value)} className="border-none text-sm py-1 pr-8 focus:ring-0 outline-none" style={{ background: 'transparent', color: '#dae2fd' }}>
                                {['All Status', 'Active', 'Suspended', 'Pending'].map(s => <option key={s} value={s} style={{ background: '#171f33' }}>{s}</option>)}
                            </select>
                        </div>
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
                                {['User', 'Email Address', 'Joined Date', 'Role', 'Status', 'Actions'].map((col, i) => (
                                    <th key={col} className={`px-6 py-4 text-[11px] uppercase font-bold tracking-[0.15em]${i === 5 ? ' text-right' : ''}`} style={{ color: '#8e8fa2' }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: '1px solid rgba(68,70,86,0.1)' }}>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <span className="material-symbols-outlined block mb-3" style={{ fontSize: 48, color: '#2d3449' }}>manage_accounts</span>
                                        <p className="text-sm" style={{ color: '#8e8fa2' }}>No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, idx) => (
                                    <tr key={user.id} onClick={() => setSelectedUser(user)}
                                        className="cursor-pointer transition-colors group"
                                        style={{ background: idx % 2 === 1 ? 'rgba(34,42,61,0.4)' : 'transparent', borderTop: '1px solid rgba(68,70,86,0.1)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#222a3d'}
                                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 1 ? 'rgba(34,42,61,0.4)' : 'transparent'}
                                    >
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
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${roleBadgeClass(user.role)}`}>
                                                {(user.role ?? 'Member').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${statusDotClass(user.status)}`} />
                                                <span className={`text-sm ${statusTextClass(user.status)}`}>{user.status ?? 'Unknown'}</span>
                                            </div>
                                        </td>
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
                </div>
            </section>

            {selectedUser && (
                <UserPanel user={selectedUser} onClose={() => setSelectedUser(null)}
                    onSuspend={() => doSuspend(selectedUser)}
                    onResetPassword={() => doResetPassword(selectedUser)}
                    onDelete={() => doDelete(selectedUser)} />
            )}
        </AdminLayout>
    );
}