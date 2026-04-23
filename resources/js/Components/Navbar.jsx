import React from 'react';
import { Link, usePage } from '@inertiajs/react'; // Idinagdag ang usePage

export default function Navbar({ auth }) {
    // Kinukuha natin ang kasalukuyang URL
    const { url } = usePage();

    // Helper function para ibigay ang tamang CSS classes depende kung active ang link
    const navLinkClasses = (path) => {
        return url === path
            ? "text-[#bbc3ff] font-bold border-b-2 border-[#3d5afe] pb-1 transition-all" // Active State
            : "text-slate-400 hover:text-white transition-colors"; // Default/Inactive State
    };

    return (
        <header className="bg-[#131b2e] text-slate-400 font-medium flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-[1920px] mx-auto fixed top-0 left-0 right-0 z-40">
            <div className="flex items-center gap-12">
                <div className="text-xl font-bold tracking-tight text-white font-headline">LEXITYPE</div>
                {auth?.user ? (
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-body">
                
                    {/* Ginamit natin ang helper function dito */}
                    <Link href="/" className={navLinkClasses('/')}>
                        Home
                    </Link>
                    <Link href={route('about')} className={navLinkClasses('/about')}>
                        About
                    </Link>
                    {auth?.user?.role === 'admin' ? (
                        <Link href={route('dashboard')} className={navLinkClasses('/dashboard')}>
                            Dashboard
                        </Link>
                        
                    ) : null}
                </nav>
                ) : (
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-body">
                        <Link href="/" className={navLinkClasses('/')}>
                            Home
                        </Link>
                        <Link href={route('about')} className={navLinkClasses('/about')}>
                            About
                        </Link>
                    </nav>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 mr-4">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">emoji_events</span>
                    </button>
                    
                    {auth?.user?.role === 'user' ? (
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">query_stats</span>
                        </button>
                    ) : null}
                </div>

                {auth?.user ? (
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="px-5 py-2 text-sm font-semibold text-primary hover:text-white transition-all"
                    >
                        Log Out
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="px-5 py-2 text-sm font-semibold text-primary hover:text-white transition-all"
                        >
                            Log In
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-5 py-2 text-sm font-semibold text-primary hover:text-white transition-all"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}