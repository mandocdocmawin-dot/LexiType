import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Leaderboard from './Leaderboard';
import AboutModal from './AboutApp';
import Dropdown from '@/Components/Dropdown'; // Imported Dropdown component

export default function Navbar({ auth }) {
    const { url } = usePage();
    
    // Initialize states for modals
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const navLinkClasses = (path) => {
        return url === path
            ? "text-[#bbc3ff] font-bold border-b-2 border-[#3d5afe] pb-1 transition-all" 
            : "text-slate-400 hover:text-white transition-colors"; 
    };

    return (
        <>
            <header className="bg-[#131b2e] text-slate-400 font-medium flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-[1920px] mx-auto fixed top-0 left-0 right-0 z-40">
                <div className="flex items-center gap-12">
                    {/* Logo Link */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <img src="/img/logo.png" alt="Lexitype Logo" className="h-12 w-auto" />
                        
                        <div className="text-xl font-bold tracking-tight text-white font-headline">
                            LEXITYPE
                        </div>
                    </Link>
                    
                    {auth?.user ? (
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
                            <Link href="/" className={navLinkClasses('/')}>Home</Link>
                            
                            {auth.user.role === 'admin' && (
                                <Link href="/dashboard" className={navLinkClasses('/dashboard')}>Overview</Link>
                            )}
                            
                            <button 
                                onClick={() => setIsAboutOpen(true)} 
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                About
                            </button>
                        </nav>
                    ) : (
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
                            <Link href="/" className={navLinkClasses('/')}>Home</Link>
                            <button 
                                onClick={() => setIsAboutOpen(true)} 
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                About
                            </button>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4">

                        {/* Leaderboard Button with Tooltip */}
                        <button 
                            onClick={() => setIsLeaderboardOpen(true)}
                            className="group relative p-2 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#222a3d]/30 transition-all focus:outline-none"
                        >
                            <span className="material-symbols-outlined">emoji_events</span>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#222a3d] text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                Leaderboard
                            </span>
                        </button>

                        {/* Admin Tools */}
                        {auth?.user?.role === 'admin' && (
                            <>
                                {/* Manage Users Button */}
                                <Link 
                                    href={route('admin.users.index')}
                                    className={`group relative p-2 rounded-lg flex items-center justify-center transition-all ${
                                        url?.startsWith('/admin/users') 
                                            ? 'text-[#bbc3ff] bg-[#222a3d]/50' 
                                            : 'text-slate-400 hover:text-white hover:bg-[#222a3d]/30'
                                    }`}
                                    aria-label="Manage Users"
                                >
                                    <span className="material-symbols-outlined">manage_accounts</span>
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#222a3d] text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        Manage Users
                                    </span>
                                </Link>

                                {/* Feedback Button */}
                                <Link 
                                    href={route('admin.feedback.index')}
                                    className="group relative p-2 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#222a3d]/30 transition-all focus:outline-none"
                                    aria-label="View Feedback"
                                >
                                    <span className="material-symbols-outlined">rate_review</span>
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#222a3d] text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        Feedback
                                    </span>
                                </Link>
                            </>
                        )}
                        
                       {auth?.user?.role === 'user' ? (
                            /* Stats Link with Tooltip */
                            <Link 
                                href={route('stats')} 
                                className={`group relative p-2 rounded-lg flex items-center justify-center transition-all ${
                                    url?.startsWith('/stats') 
                                        ? 'text-[#bbc3ff] bg-[#222a3d]/50' 
                                        : 'text-slate-400 hover:text-white hover:bg-[#222a3d]/30'
                                }`}
                            >
                                <span className="material-symbols-outlined">query_stats</span>
                                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#222a3d] text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Stats
                                </span>
                            </Link>
                        ) : null}
                    </div>

                    {auth?.user ? (
                        /* Account Dropdown for Authenticated Users */
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="group relative p-2 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined">account_circle</span>
                                    {/* Tooltip */}
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#222a3d] text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        Account
                                    </span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content 
                                align="right" 
                                width="48"
                                contentClasses="py-1 bg-[#131b2e] border border-[#222a3d] shadow-2xl rounded-md"
                            >
                                <Dropdown.Link 
                                    href={route('profile.edit')}
                                    className="!text-slate-300 hover:!bg-[#222a3d] hover:!text-white focus:!bg-[#222a3d] focus:!text-white transition-colors"
                                >
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="!text-slate-300 hover:!bg-[#222a3d] hover:!text-white focus:!bg-[#222a3d] focus:!text-white transition-colors w-full text-left"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
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

            {/* Modals */}
            {isLeaderboardOpen && (
                <Leaderboard onClose={() => setIsLeaderboardOpen(false)} />
            )}

            <AboutModal 
                isOpen={isAboutOpen} 
                onClose={() => setIsAboutOpen(false)} 
            />
        </>
    );
}