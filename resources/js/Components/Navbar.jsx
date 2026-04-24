import React, { useState } from 'react'; // Added useState
import { Link, usePage } from '@inertiajs/react';
import Leaderboard from './Leaderboard'; // Import the Leaderboard component (Adjust the path if it's in a different folder, like '@/Components/Leaderboard')

export default function Navbar({ auth }) {
    const { url } = usePage();
    
    // 1. Initialize our state to track if the modal is open
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    const navLinkClasses = (path) => {
        return url === path
            ? "text-[#bbc3ff] font-bold border-b-2 border-[#3d5afe] pb-1 transition-all" 
            : "text-slate-400 hover:text-white transition-colors"; 
    };

    return (
        // 2. Wrap everything in a React Fragment
        <>
            <header className="bg-[#131b2e] text-slate-400 font-medium flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-[1920px] mx-auto fixed top-0 left-0 right-0 z-40">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                        <img src="/img/logo.png" alt="Lexitype Logo" className="h-12 w-auto" />
                        
                        <div className="text-xl font-bold tracking-tight text-white font-headline">
                            LEXITYPE
                        </div>
                    </Link>
                    
                    {auth?.user ? (
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
                            <Link href="/dashboard" className={navLinkClasses('/dashboard')}>Dashboard</Link>
                            <Link href="/about" className={navLinkClasses('/about')}>About</Link>
                        </nav>
                    ) : (
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
                            <Link href="/" className={navLinkClasses('/')}>Home</Link>
                            <Link href="/about" className={navLinkClasses('/about')}>About</Link>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4">
                        {/* 3. Add onClick handler to open the leaderboard */}
                        <button 
                            onClick={() => setIsLeaderboardOpen(true)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
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

            {/* 4. Conditionally render the modal and pass the onClose prop */}
            {isLeaderboardOpen && (
                <Leaderboard onClose={() => setIsLeaderboardOpen(false)} />
            )}
        </>
    );
}