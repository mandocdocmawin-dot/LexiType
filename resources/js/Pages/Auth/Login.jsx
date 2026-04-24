import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in - LexiType" />

            {/* Main Wrapper: Exact Dark Background */}
            <main className="flex flex-col md:flex-row min-h-screen w-full bg-[#0b1120] text-white font-sans overflow-hidden">
                
                {/* ================= LEFT COLUMN ================= */}
                <section className="hidden md:flex md:w-[45%] lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 z-0">
                        {/* Pinalitan ko ang image ng mas dark at abstract na bagay sa target design */}
                        <img 
                            className="w-full h-full object-cover opacity-30" 
                            alt="Abstract cinematic background" 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/80 to-[#0b1120]"></div>
                    </div>
                    
                    {/* Brand Logo */}
                    <div className="relative z-10 flex items-center">
                        {/* Ginagamit natin ang href="/" dahil madalas ito ang route para sa Welcome.jsx */}
                        <Link href="/" className="transition-opacity hover:opacity-80">
                            <img 
                                src="/img/logo.png" 
                                alt="LexiType Logo" 
                                className="w-40 h-auto object-contain cursor-pointer" 
                            />
                        </Link>
                    </div>
                    
                    {/* Hero Text */}
                    <div className="relative z-10 max-w-lg mb-32">
                        <h2 className="text-[3.5rem] leading-[1.1] font-bold tracking-tight mb-6 text-white">
                            MASTER THE <br/> 
                            <span className="text-[#4ade80]">FLOW STATE.</span>
                        </h2>
                        <p className="text-[#9ca3af] text-base leading-relaxed max-w-md">
                            Enter the high-performance arena designed for surgical precision typing and cognitive momentum.
                        </p>
                    </div>
                    
                    {/* Empty Bottom (Stats Removed as requested) */}
                    <div className="relative z-10"></div>
                </section>

                {/* ================= RIGHT COLUMN ================= */}
                <section className="w-full md:w-[55%] lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-[#0b1120]">
                    <div className="w-full max-w-[420px]">
                        
                        {/* Mobile Logo (Hidden on Desktop) */}
                        <div className="flex md:hidden items-center gap-2 mb-10">
                            <div className="w-6 h-6 bg-[#4f56ff] flex items-center justify-center rounded">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 19v-1h10v1a1 1 0 01-1 1H8a1 1 0 01-1-1zm6.9-3l2.8-8h-1.6l-2.1 6H8.9l-2.1-6H5.2l2.8 8h5.9zM10 3h4v2h-4V3z" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg tracking-wide text-white">LexiType</span>
                        </div>
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Initialize Session</h3>
                            <p className="text-[#9ca3af] text-sm">Access your performance metrics and training arena.</p>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-[#1e293b] mb-8">
                            <button className="pb-3 px-1 mr-6 text-sm font-medium text-[#4f56ff] border-b-2 border-[#4f56ff]">
                                Login
                            </button>
                            
                            {/* Pinalitan ang button ng Link para sa smooth na paglipat */}
                            <Link 
                                href={route('register')} 
                                className="pb-3 px-1 text-sm font-medium text-[#64748b] hover:text-white transition-colors"
                            >
                                Register
                            </Link>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-500">
                                {status}
                            </div>
                        )}

                        {/* Exact Form Design */}
                        <form onSubmit={submit} className="space-y-5">
                            
                            {/* Username or Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Username or Email
                                </label>
                                <div className="relative flex items-center">
                                    {/* @ Icon */}
                                    <div className="absolute left-4 text-[#64748b]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input 
                                        id="email" 
                                        type="email" 
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-[#151b2b] border border-transparent rounded-lg py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#4f56ff] focus:ring-1 focus:ring-[#4f56ff] transition-all placeholder-[#475569]" 
                                        placeholder="commander@lexitype.com" 
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>
                            
                            {/* Access Key (Password) Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Access Key
                                </label>
                                <div className="relative flex items-center">
                                    {/* Lock Icon */}
                                    <div className="absolute left-4 text-[#64748b]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-[#151b2b] border border-transparent rounded-lg py-3.5 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-[#4f56ff] focus:ring-1 focus:ring-[#4f56ff] transition-all placeholder-[#475569]" 
                                        placeholder="••••••••••••" 
                                        required
                                    />
                                    {/* Eye Toggle Icon */}
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-[#64748b] hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>
                            
                            {/* Utilities (Remember Me / Forgot Password) */}
                            <div className="flex items-center justify-between pt-2 pb-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded bg-[#151b2b] border-[#334155] text-[#4f56ff] focus:ring-[#4f56ff] focus:ring-offset-[#0b1120]" 
                                    />
                                    <span className="text-xs text-[#9ca3af] group-hover:text-white transition-colors">Remember Me</span>
                                </label>
                                
                                {canResetPassword && (
                                    <Link 
                                        href={route('password.request')} 
                                        className="text-xs font-medium text-[#4f56ff] hover:text-[#7b81ff] transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            
                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-[#4f56ff] hover:bg-[#434ce6] text-white font-medium text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                Log In
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </form>

                        {/* Exact Footer Text */}
                        <div className="mt-20 text-center">
                            <p className="text-[9px] font-bold text-[#475569] tracking-[0.15em] uppercase">
                                © 2026 LEXITYPE SYSTEMS. ALL RIGHTS RESERVED.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </>
    );
}