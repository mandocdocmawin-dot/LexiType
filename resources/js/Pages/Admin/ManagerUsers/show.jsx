import { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const AVATAR_COLORS = ['#3d5afe', '#00a572', '#d22348', '#7c3aed', '#0ea5e9', '#f59e0b'];
function Avatar({ name, size = 80 }) {
    const initials = (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const color = AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
    return (
        <div className="rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
            {initials}
        </div>
    );
}

function timeAgo(dateStr) {
    if (!dateStr) return 'Never';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function StatCard({ label, value, unit, color }) {
    return (
        <div className="p-5 rounded-xl" style={{ background: 'rgba(45,52,73,0.4)' }}>
            <span className="text-[10px] uppercase block mb-1 tracking-wider" style={{ color: '#8e8fa2' }}>{label}</span>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color }}>
                {value ?? '—'}{unit && <span className="text-xs font-normal ml-1">{unit}</span>}
            </span>
        </div>
    );
}

function InfoRow({ label, value, color }) {
    return (
        <div className="flex justify-between py-3" style={{ borderBottom: '1px solid rgba(68,70,86,0.1)' }}>
            <span className="text-sm" style={{ color: '#c5c5d9' }}>{label}</span>
            <span className="text-sm font-medium" style={{ color: color ?? '#dae2fd' }}>{value}</span>
        </div>
    );
}

function roleBadge(role) {
    const colors = { Administrator: '#818cf8', Moderator: '#a78bfa', Member: '#64748b' };
    return (
        <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', color: colors[role] ?? '#64748b' }}>
            {(role ?? 'Member').toUpperCase()}
        </span>
    );
}

function statusDot(status) {
    const colors = { Active: '#4edea3', Suspended: '#ffb2b7', Pending: '#f59e0b' };
    return (
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: colors[status] ?? '#64748b' }} />
            <span className="text-sm font-medium" style={{ color: colors[status] ?? '#64748b' }}>{status ?? 'Unknown'}</span>
        </div>
    );
}

export default function ShowUser({ user }) {
    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(flash?.success ?? null);
    const [confirmAction, setConfirmAction] = useState(null);

    const doSuspend = () => router.patch(route('admin.users.suspend', user.id));
    const doResetPassword = () => router.post(route('admin.users.reset-password', user.id));
    const doDelete = () => router.delete(route('admin.users.destroy', user.id));

    const actions = {
        suspend: { title: `Suspend ${user.name}?`, msg: 'This will lock the user out immediately.', label: 'Suspend', danger: true, fn: doSuspend },
        reset: { title: `Reset password for ${user.name}?`, msg: 'A new random password will be generated.', label: 'Reset Password', danger: false, fn: doResetPassword },
        delete: { title: `Delete ${user.name}?`, msg: 'All data will be permanently erased.', label: 'Delete', danger: true, fn: doDelete },
    };

    return (
        <AdminLayout>
            <Head title={`${user.name} — Profile`} />
            <style>{`::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0b1326}::-webkit-scrollbar-thumb{background:#2d3449;border-radius:10px}`}</style>

            {flashMsg && (
                <div className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
                    style={{ background: 'rgba(78,222,163,0.15)', border: '1px solid rgba(78,222,163,0.3)', color: '#4edea3' }}>
                    <span className="material-symbols-outlined text-base">check_circle</span>{flashMsg}
                </div>
            )}

            {/* Confirm modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                    <div className="rounded-2xl p-8 w-full max-w-sm shadow-2xl" style={{ background: '#171f33', border: '1px solid rgba(68,70,86,0.4)' }}>
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#dae2fd' }}>{actions[confirmAction].title}</h3>
                        <p className="text-sm mb-6" style={{ color: '#8e8fa2' }}>{actions[confirmAction].msg}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ border: '1px solid #444656', color: '#c5c5d9' }}>Cancel</button>
                            <button onClick={() => { actions[confirmAction].fn(); setConfirmAction(null); }}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold"
                                style={actions[confirmAction].danger
                                    ? { background: 'rgba(210,35,72,0.15)', border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7' }
                                    : { background: 'rgba(61,90,254,0.15)', border: '1px solid rgba(187,195,255,0.3)', color: '#bbc3ff' }}>
                                {actions[confirmAction].label}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen p-8" style={{ background: '#0b1326' }}>
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Back + Edit links */}
                    <div className="flex items-center justify-between">
                        <Link href={route('admin.users.index')} className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: '#64748b' }}>
                            <span className="material-symbols-outlined text-base">arrow_back</span>Back to Users
                        </Link>
                        <Link href={route('admin.users.edit', user.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: '#222a3d', color: '#bbc3ff', border: '1px solid rgba(68,70,86,0.3)' }}>
                            <span className="material-symbols-outlined text-base">edit</span>Edit User
                        </Link>
                    </div>

                    {/* Profile card */}
                    <div className="rounded-2xl p-10 shadow-2xl" style={{ background: '#131b2e', border: '1px solid rgba(68,70,86,0.2)' }}>
                        <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(68,70,86,0.15)' }}>
                            <div className="relative">
                                <Avatar name={user.name} size={80} />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4"
                                    style={{ borderColor: '#131b2e', background: user.status === 'Active' ? '#4edea3' : user.status === 'Suspended' ? '#ffb2b7' : '#f59e0b' }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk', color: '#dae2fd' }}>{user.name}</h1>
                                <p className="text-sm mt-1" style={{ color: '#8e8fa2' }}>{user.email}</p>
                                <p className="text-xs mt-1" style={{ color: '#64748b' }}>ID: KL-{String(user.id).padStart(5, '0')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            {roleBadge(user.role)}
                            {statusDot(user.status)}
                        </div>

                        {/* Bio */}
                        <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(45,52,73,0.4)' }}>
                            <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#bbc3ff' }}>About</h5>
                            <p className="text-sm leading-relaxed" style={{ color: '#c5c5d9' }}>
                                {user.bio || `${user.name} is a registered user on LexiType. No bio provided.`}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <StatCard label="Avg Speed" value={user.avg_wpm} unit="WPM" color="#4edea3" />
                            <StatCard label="Accuracy" value={user.accuracy != null ? Number(user.accuracy).toFixed(1) : null} unit="%" color="#bbc3ff" />
                        </div>

                        {/* System info */}
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#bbc3ff' }}>System Info</h5>
                            <InfoRow label="Last Login" value={timeAgo(user.last_login_at)} />
                            <InfoRow label="Account Type" value={user.account_type ?? 'Standard'} />
                            <InfoRow label="MFA Status" value={user.mfa_enabled ? 'Enabled' : 'Disabled'} color={user.mfa_enabled ? '#4edea3' : '#8e8fa2'} />
                            <InfoRow label="Joined" value={formatDate(user.created_at)} />
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="rounded-2xl p-8" style={{ background: '#131b2e', border: '1px solid rgba(68,70,86,0.2)' }}>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#ffb2b7' }}>Account Actions</h5>
                        <div className="space-y-3">
                            <button onClick={() => setConfirmAction('reset')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: '#2d3449', color: '#dae2fd' }}>
                                <span className="material-symbols-outlined text-lg">lock_reset</span>Reset Password
                            </button>
                            <button onClick={() => setConfirmAction('suspend')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                style={{ border: '1px solid rgba(255,178,183,0.3)', color: '#ffb2b7' }}>
                                <span className="material-symbols-outlined text-lg">block</span>Suspend Account
                            </button>
                            <button onClick={() => setConfirmAction('delete')} className="w-full text-[10px] uppercase tracking-widest font-bold py-2 transition-colors" style={{ color: '#8e8fa2' }}>
                                Delete User Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
