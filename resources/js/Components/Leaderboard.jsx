import React, { useState, useEffect } from 'react';

const Leaderboard = ({ onClose, isLoggedIn = false }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Infinite Scroll States
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const LIMIT = 10; // Number of items per page

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        // Added limit parameter to ensure the backend knows how many items to return
        const response = await fetch(`/api/leaderboard?page=${page}&limit=${LIMIT}`); 
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const result = await response.json();
        
        if (result.success) {
          const newData = Array.isArray(result.data) ? result.data : result.data.data || [];
          
          if (page === 1) {
            setLeaderboardData(newData);
          } else {
            // Append new users to the existing list
            setLeaderboardData(prevData => [...prevData, ...newData]);
          }

          // If the API returns fewer items than our limit, we've reached the end
          if (newData.length < LIMIT) {
            setHasMore(false);
          }
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); 
        setIsFetchingMore(false);
      }
    };

    fetchLeaderboard();
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      if (!isLoading && !isFetchingMore && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans"
        onClick={onClose} 
    >
      <div 
        className="bg-[#131b2e] w-full max-w-[480px] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e2638] rounded-xl flex items-center justify-center shadow-inner border border-white/5">
              <svg className="w-5 h-5 text-[#9fa8da]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide leading-tight">Global Top Scorers</h2>
              <p className="text-[11px] text-slate-400 font-medium">Velocity Pro Elite League</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-[40px_1fr_90px] px-6 py-2.5 text-[9px] font-bold tracking-widest text-slate-500 uppercase bg-[#0f1524]/50">
          <div className="text-center">RANK</div>
          <div className="pl-2">USER</div>
          <div className="text-right">WPM VELOCITY</div>
        </div>

        {/* Dynamic List Area with Infinite Scroll */}
        <div 
          className="flex flex-col pt-1 pb-2 max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors"
          onScroll={handleScroll}
        >
          {isLoading && page === 1 && (
            <div className="text-center text-slate-400 py-10 text-sm flex flex-col items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting to leaderboards...</span>
            </div>
          )}

          {error && page === 1 && (
            <div className="text-center text-red-400 py-10 text-sm">Error: {error}</div>
          )}

          {!isLoading && !error && leaderboardData.length === 0 && (
            <div className="text-center text-slate-500 py-10 text-sm">No records found yet. Be the first!</div>
          )}

          {!isLoading && !error && leaderboardData.map((item, idx) => {
            // Calculate global rank dynamically if backend doesn't provide it
            const globalRank = item.rank || String(idx + 1).padStart(2, '0');
            
            return (
              <div 
                key={item.user_id || idx} 
                className="grid grid-cols-[40px_1fr_90px] items-center px-6 py-2 hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className={`text-sm font-bold text-center ${item.rankColor || 'text-slate-500'}`}>
                  {globalRank}
                </div>
                
                <div className="flex items-center gap-3 pl-2">
                  {item.hasAvatar ? (
                    <div className={`w-7 h-7 rounded-full bg-slate-700 overflow-hidden ring-1 ${item.avatarRing || 'ring-slate-600'}`}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`} alt={item.user} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#22283d] flex items-center justify-center text-[10px] font-bold text-slate-400 ring-1 ring-slate-700">
                      {item.initials || (item.user ? item.user.substring(0, 2).toUpperCase() : '')}
                    </div>
                  )}
                  <span className="text-slate-200 font-semibold text-sm group-hover:text-white transition-colors">{item.user}</span>
                </div>
                
                <div className="text-right text-sm font-bold text-white tracking-wide">
                  {item.score}
                </div>
              </div>
            );
          })}

          {/* Loading more indicator */}
          {isFetchingMore && hasMore && (
            <div className="text-center py-4 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
              <svg className="animate-spin h-3.5 w-3.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading more...</span>
            </div>
          )}

          {/* End of list text */}
          {!hasMore && leaderboardData.length > 0 && (
            <div className="text-center py-4">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                End of Leaderboard
              </span>
            </div>
          )}
        </div>

        {/* Conditional Footer Section ("Your Position") based on isLoggedIn */}
        {isLoggedIn && (
          <div className="relative bg-[#182136] px-6 py-4 border-t border-slate-700/60 mt-auto">
            {/* ... Existing Footer Code ... */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#a5b4fc] text-[#131b2e] text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase shadow-lg border border-[#c7d2fe]/20">
                YOUR POSITION
              </span>
            </div>

            <div className="grid grid-cols-[40px_1fr_90px] items-center pt-2">
              <div className="text-base font-bold text-slate-400 text-center">
                #142
              </div>
              
              <div className="flex items-center gap-3 pl-2">
                <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden ring-2 ring-[#a5b4fc]/30 shadow-lg">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FlowState" alt="FlowState_User" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm tracking-wide">FlowState_User</span>
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 mt-0.5 uppercase">Personal Best</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end justify-center">
                <span className="text-2xl font-black text-[#a5b4fc] leading-none">124</span>
                <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mt-1">MAX WPM</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;