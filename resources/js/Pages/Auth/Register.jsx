import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // States for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register - LexiType" />

            {/* Main Wrapper: Exact Dark Background */}
            <main className="flex flex-col md:flex-row min-h-screen w-full bg-[#0b1120] text-white font-sans overflow-hidden">
                
                {/* ================= LEFT COLUMN ================= */}
                <section className="hidden md:flex md:w-[45%] lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            className="w-full h-full object-cover opacity-30" 
                            alt="Abstract cinematic background" 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/80 to-[#0b1120]"></div>
                    </div>
                    
                    {/* Brand Logo */}
                    <div className="relative z-10 flex items-center">
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
                    
                    <div className="relative z-10"></div>
                </section>

                {/* ================= RIGHT COLUMN ================= */}
                <section className="w-full md:w-[55%] lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-[#0b1120] overflow-y-auto">
                    <div className="w-full max-w-[420px] py-8">
                        
                        {/* Mobile Logo (Hidden on Desktop) */}
                        <div className="flex md:hidden items-center gap-2 mb-10">
                            <Link href="/" className="transition-opacity hover:opacity-80">
                                <img 
                                    src="/img/logo.png" 
                                    alt="LexiType Logo" 
                                    className="w-36 h-auto object-contain cursor-pointer" 
                                />
                            </Link>
                        </div>
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
                            <p className="text-[#9ca3af] text-sm">Register your credentials to access the training arena.</p>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-[#1e293b] mb-8">
                            {/* Login is now inactive and acts as a Link back to the login route */}
                            <Link 
                                href={route('login')} 
                                className="pb-3 px-1 mr-6 text-sm font-medium text-[#64748b] hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            {/* Register is now the active tab */}
                            <button className="pb-3 px-1 text-sm font-medium text-[#4f56ff] border-b-2 border-[#4f56ff]">
                                Register
                            </button>
                        </div>

                        {/* Exact Form Design */}
                        <form onSubmit={submit} className="space-y-5">
                            
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Full Name
                                </label>
                                <div className="relative flex items-center">
                                    {/* User Icon */}
                                    <div className="absolute left-4 text-[#64748b]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input 
                                        id="name" 
                                        type="text" 
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-[#151b2b] border border-transparent rounded-lg py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#4f56ff] focus:ring-1 focus:ring-[#4f56ff] transition-all placeholder-[#475569]" 
                                        placeholder="John Doe" 
                                        autoComplete="name"
                                        isFocused={true}
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Email Address
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
                                        placeholder="john.doe@lexitype.com" 
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>
                            
                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Access Key (Password)
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
                                        autoComplete="new-password" 
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

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                                    Confirm Access Key
                                </label>
                                <div className="relative flex items-center">
                                    {/* Lock Icon */}
                                    <div className="absolute left-4 text-[#64748b]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        id="password_confirmation" 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full bg-[#151b2b] border border-transparent rounded-lg py-3.5 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-[#4f56ff] focus:ring-1 focus:ring-[#4f56ff] transition-all placeholder-[#475569]" 
                                        placeholder="••••••••••••"
                                        autoComplete="new-password" 
                                        required
                                    />
                                    {/* Eye Toggle Icon */}
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 text-[#64748b] hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
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
                                {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>
                            
                            {/* Submit Button */}
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-[#4f56ff] hover:bg-[#434ce6] text-white font-medium text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    Register
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Exact Footer Text */}
                        <div className="mt-16 text-center">
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