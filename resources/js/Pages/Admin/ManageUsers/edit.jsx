import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const FIELD = ({ label, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold ml-1" style={{ color: 'rgba(99,102,241,0.8)' }}>{label}</label>
        {children}
    </div>
);

const inputCls = "w-full rounded-xl px-4 py-3 text-sm border-none outline-none transition-all focus:ring-2 focus:ring-indigo-500";
const inputStyle = { background: '#131b2e', color: '#dae2fd', border: '1px solid rgba(68,70,86,0.3)' };

const AVATAR_COLORS = ['#3d5afe', '#00a572', '#d22348', '#7c3aed', '#0ea5e9', '#f59e0b'];
function Avatar({ name, size = 56 }) {
    const initials = (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const color = AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
    return (
        <div className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
            {initials}
        </div>
    );
}

export default function EditUser({ user }) {
    const [form, setForm] = useState({ name: user.name ?? '', email: user.email ?? '', role: user.role ?? 'Member', status: user.status ?? 'Active' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.put(route('admin.users.update', user.id), form, {
            onError: (err) => { setErrors(err); setSubmitting(false); },
            onSuccess: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit — ${user.name}`} />
            <style>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0b1326; }
                ::-webkit-scrollbar-thumb { background: #2d3449; border-radius: 10px; }
            `}</style>

            <div className="min-h-screen p-8" style={{ background: '#0b1326' }}>
                <div className="max-w-2xl mx-auto">
                    <Link href={route('admin.users.index')} className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#64748b' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to Users
                    </Link>

                    <div className="rounded-2xl p-10 shadow-2xl" style={{ background: '#131b2e', border: '1px solid rgba(68,70,86,0.2)' }}>
                        {/* User identity banner */}
                        <div className="flex items-center gap-4 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(68,70,86,0.2)' }}>
                            <Avatar name={form.name} size={56} />
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk', color: '#dae2fd' }}>{form.name || 'Edit User'}</h1>
                                <p className="text-sm" style={{ color: '#64748b' }}>ID: KL-{String(user.id).padStart(5, '0')} · {user.email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FIELD label="Full Name">
                                <input value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} style={inputStyle} maxLength={25}/>
                                {errors.name && <p className="text-xs mt-1" style={{ color: '#ffb2b7' }}>{errors.name}</p>}
                            </FIELD>

                            <FIELD label="Email Address">
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} style={inputStyle} maxLength={100}/>
                                {errors.email && <p className="text-xs mt-1" style={{ color: '#ffb2b7' }}>{errors.email}</p>}
                            </FIELD>

                            <div className="grid grid-cols-2 gap-4">
                                <FIELD label="Role">
                                    <select value={form.role} onChange={e => set('role', e.target.value)} className={inputCls} style={inputStyle}>
                                        {['Member', 'Administrator'].map(r => <option key={r} value={r} style={{ background: '#171f33' }}>{r}</option>)}
                                    </select>
                                    {errors.role && <p className="text-xs mt-1" style={{ color: '#ffb2b7' }}>{errors.role}</p>}
                                </FIELD>
                                <FIELD label="Status">
                                    <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls} style={inputStyle}>
                                        {['Active', 'Suspended', 'Pending'].map(s => <option key={s} value={s} style={{ background: '#171f33' }}>{s}</option>)}
                                    </select>
                                    {errors.status && <p className="text-xs mt-1" style={{ color: '#ffb2b7' }}>{errors.status}</p>}
                                </FIELD>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4" style={{ borderTop: '1px solid rgba(68,70,86,0.2)' }}>
                                <Link href={route('admin.users.index')} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#222a3d', color: '#c5c5d9' }}>
                                    Cancel
                                </Link>
                                <button type="submit" disabled={submitting}
                                    className="px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all"
                                    style={{ background: '#3d5afe', color: '#f1f0ff', opacity: submitting ? 0.7 : 1 }}>
                                    <span className="material-symbols-outlined text-base">save</span>
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
