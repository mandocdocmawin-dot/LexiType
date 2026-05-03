import React, { useState, useEffect, useRef } from 'react';
import AiChatModal from './AiChatModal';

export default function AppParent() {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [auth, setAuth] = useState({ user: true }); 

    const appWrapperRef = useRef(null);

    // Focus Management Effect
    useEffect(() => {
        // 1. Tell the browser to focus the window
        window.focus();

        // 2. Push the element focus to the end of the execution queue
        // to ensure the DOM is fully ready to receive it.
        const focusTimeout = setTimeout(() => {
            if (appWrapperRef.current) {
                appWrapperRef.current.focus();
            }
        }, 0);

        return () => clearTimeout(focusTimeout);
    }, []);

    useEffect(() => {
        const handleGlobalClick = () => {
            if (isFeedbackModalOpen || isAiModalOpen || status === 'finished') return;
            if (inputRef.current) { inputRef.current.focus(); setShowFocusHint(false); }
        };

        const handleGlobalKeydown = (e) => {
            const isModifierPressed = e.ctrlKey || e.metaKey;
            const isShiftPressed = e.shiftKey;

            if (isModifierPressed && isShiftPressed && e.code === 'KeyA') {
                e.preventDefault(); 
                if (auth.user) {
                    setIsAiModalOpen(prev => !prev);
                } else {
                    alert('Please log in to chat with your AI Coach!');
                }
                return; 
            }

            if (e.key === 'Escape') {
                if (isAiModalOpen) {
                    setIsAiModalOpen(false);
                    return; 
                }
                if (isFeedbackModalOpen) {
                    setIsFeedbackModalOpen(false);
                    return; 
                }
                if (status === 'finished') {
                    resetTest();
                    return; 
                }
            }

            if (isFeedbackModalOpen || isAiModalOpen || status === 'finished' || document.activeElement === inputRef.current) {
                return;
            }
            
            if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey && inputRef.current) {
                inputRef.current.focus();
                setShowFocusHint(false);
            }
        };

        window.addEventListener('click', handleGlobalClick);
        window.addEventListener('keydown', handleGlobalKeydown);
        
        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleGlobalKeydown);
        };
    }, [isAiModalOpen, auth.user]);

    return (
        <div 
            ref={appWrapperRef}
            tabIndex={-1}
            className="min-h-screen bg-gray-900 text-white p-8 outline-none"
        >
            <h1 className="text-3xl font-bold mb-4">Your Application</h1>
            
            <button 
                onClick={() => setIsAiModalOpen(true)}
                className="bg-[#3d5afe] px-4 py-2 rounded-lg text-white font-medium"
            >
                Open AI Chat (or press Ctrl+Shift+A)
            </button>

            <AiChatModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                auth={auth} 
            />
        </div>
    );
}