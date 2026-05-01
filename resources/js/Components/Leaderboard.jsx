import React, { useState, useEffect } from 'react';

const Leaderboard = ({ onClose }) => { 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserStats, setCurrentUserStats] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/leaderboard?limit=1000`); 
        const result = await response.json();
        
        if (result.success) {
          const newData = Array.isArray(result.data) ? result.data : result.data.data || [];
          setLeaderboardData(newData);

          // MAGIC TRICK: Dito natin idede-detect ang Laravel Auth!
          // Kung kasama ang 'currentUserPosition' sa response, alam natin na logged in siya.
          if ('currentUserPosition' in result) {
            setIsAuthenticated(true);
            setCurrentUserStats(result.currentUserPosition);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      {/* Modal Container */}
      <div 
        className="bg-[#131b2e] w-full max-w-[480px] rounded-[24px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[85vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER SECTION */}
        <div className="p-6 pb-0 shrink-0">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1c2642] rounded-2xl flex items-center justify-center border border-slate-700">
                        <span className="text-[#a5b4fc] text-2xl">👑</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Global Top Scorers</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Velocity Pro Elite League</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Column Labels */}
            <div className="flex justify-between items-center px-2 py-3 border-t border-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-12">Rank</span>
                <span className="flex-1 ml-4">User</span>
                <span>WPM Velocity</span>
            </div>
        </div>

        {/* SCROLLABLE LIST SECTION (With custom matching scrollbar) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500 pr-2">
            {isLoading ? (
                <div className="text-center py-6 text-[#a5b4fc] text-xs font-bold tracking-widest uppercase animate-pulse">
                    Loading Leaderboard...
                </div>
            ) : (
                leaderboardData.map((user, index) => (
                    <div key={user.id || index} className="flex items-center justify-between bg-[#182136]/50 p-3 px-4 rounded-2xl border border-slate-700/30">
                        <div className="flex items-center gap-4 flex-1">
                            <span className={`font-bold w-6 ${index < 3 ? 'text-[#a5b4fc]' : 'text-slate-500'}`}>#{index + 1}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user}`} alt="avatar" />
                                </div>
                                <span className="text-slate-200 font-medium text-sm">{user.user}</span>
                            </div>
                        </div>
                        <span className="text-lg font-black text-[#4edea3]">{user.score}</span>
                    </div>
                ))
            )}
        </div>

        {/* --- STICKY FOOTER SECTION --- */}
        {/* Pinalitan natin ang isLoggedIn ng isAuthenticated */}
        {isAuthenticated && (
          <div className="relative bg-[#202940] px-6 py-5 shrink-0 z-10 border-t border-slate-700/50 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
            
            {/* Overlapping Pill Badge */}
            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2">
              <span className="bg-[#c7d2fe] text-[#131b2e] text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md">
                Your Position
              </span>
            </div>

            {currentUserStats ? (
              <div className="flex justify-between items-center pt-1">
                
                {/* Left Side: Rank and User Info */}
                <div className="flex items-center gap-6">
                    {/* Rank Number */}
                    <div className="text-2xl font-bold text-[#c7d2fe] w-12">
                      #{currentUserStats.rank}
                    </div>
                    
                    {/* Avatar & Username */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-[#131b2e] p-0.5 border-2 border-[#a5b4fc]/70 overflow-hidden flex items-center justify-center">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserStats.user}`} 
                          alt="avatar" 
                          className="w-full h-full object-cover rounded-xl" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[15px] tracking-wide leading-tight">
                          {currentUserStats.user}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-[#a5b4fc]/70 uppercase mt-1">
                          Personal Best
                        </span>
                      </div>
                    </div>
                </div>
                
                {/* Right Side: Score */}
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-black text-[#f1f5f9] leading-none tabular-nums tracking-tight">
                    {currentUserStats.score}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1.5">
                    AVG WPM
                  </div>
                </div>
                
              </div>
            ) : (
               <div className="text-center py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  No stats recorded yet. Play a session!
               </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;