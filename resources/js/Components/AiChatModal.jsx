import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AiChatModal({ isOpen, onClose, auth }) {
    // Initialize state from sessionStorage if it exists
    const [messages, setMessages] = useState(() => {
        const savedMessages = sessionStorage.getItem('lexitype_chat_history');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    
    const [inputQuestion, setInputQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [remainingLimit, setRemainingLimit] = useState(null);
    
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Scroll to the bottom when a new message is added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Save messages to sessionStorage whenever they update
        sessionStorage.setItem('lexitype_chat_history', JSON.stringify(messages));
    }, [messages]);

    // Clear session storage when the user logs out
    useEffect(() => {
        if (!auth?.user) {
            sessionStorage.removeItem('lexitype_chat_history');
            setMessages([]);
        }
    }, [auth?.user]);

    // Fetch initial feedback automatically when the modal opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            if (auth?.user) {
                fetchAIAnalysis();
            } else {
                setMessages([{ 
                    role: 'ai', 
                    content: "Hello! Please log in to your account so I can analyze your typing data and give you personalized tips." 
                }]);
            }
        }
    }, [isOpen, auth?.user]);

    const fetchAIAnalysis = async (question = "") => {
        if (!auth?.user) return; 

        setIsLoading(true);

        if (question) {
            setMessages((prev) => [...prev, { role: 'user', content: question }]);
        }

        try {
            const response = await axios.post('/ai-analysis', {
                question: question
            });

            setMessages((prev) => [...prev, { 
                role: 'ai', 
                content: response.data.message 
            }]);

            if (response.data.remaining_requests !== undefined) {
                setRemainingLimit(response.data.remaining_requests);
            }

        } catch (error) {
            console.error("AI Fetch Error:", error);
            
            setMessages((prev) => [...prev, { 
                role: 'ai', 
                content: "Sorry, I cannot connect to the server right now." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle dynamic textarea resizing
    const handleInputChange = (e) => {
        setInputQuestion(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputQuestion.trim() || isLoading) return;

        fetchAIAnalysis(inputQuestion);
        setInputQuestion(""); 
        
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div 
                className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0b1326] rounded-2xl shadow-[0_0_50px_rgba(61,90,254,0.15)] border border-[#3d5afe]/20 overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#131b2e] border-b border-[#3d5afe]/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3d5afe]/20 flex items-center justify-center text-[#3d5afe]">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                            <h2 className="text-white font-bold font-space text-lg">LexiType AI</h2>
                            <p className="text-xs text-[#8e8fa2] font-body">Your Personal Typing Coach</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#8e8fa2] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Quota Indicator */}
                {auth?.user && remainingLimit !== null && (
                    <div className="px-6 py-2 bg-[#3d5afe]/10 border-b border-[#3d5afe]/10 flex justify-between items-center">
                        <span className="text-xs text-[#8e8fa2]">Daily AI Limit</span>
                        <span className={`text-xs font-bold ${remainingLimit > 0 ? 'text-[#bbc3ff]' : 'text-red-400'}`}>
                            {remainingLimit} / 6 remaining
                        </span>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1a233a] hover:[&::-webkit-scrollbar-thumb]:bg-[#3d5afe]/50 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {/* Added 'break-words' and 'whitespace-pre-wrap' below */}
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed break-words whitespace-pre-wrap ${
                                    msg.role === 'user' 
                                        ? 'bg-[#3d5afe] text-white rounded-tr-none' 
                                        : 'bg-[#1a233a] text-[#bbc3ff] rounded-tl-none border border-white/5'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#1a233a] text-[#bbc3ff] rounded-2xl rounded-tl-none px-4 py-3 border border-white/5 flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#3d5afe] animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-[#3d5afe] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full bg-[#3d5afe] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#131b2e] border-t border-[#3d5afe]/20">
                    {/* Changed form layout to flex-col to accommodate the counter below the input row */}
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-1.5">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={textareaRef}
                                value={inputQuestion}
                                maxLength={250} // Added character limit
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); 
                                        if (!isLoading && inputQuestion.trim() && auth?.user) {
                                            handleSendMessage(e);
                                        }
                                    }
                                }}
                                placeholder={auth?.user ? "Ask for typing tips..." : "Log in to ask questions..."}
                                rows={1}
                                className="flex-1 bg-[#0b1326] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3d5afe]/50 transition-colors disabled:opacity-50 resize-none min-h-[42px] max-h-[120px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1a233a] hover:[&::-webkit-scrollbar-thumb]:bg-[#3d5afe]/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                                disabled={isLoading || !auth?.user}
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !inputQuestion.trim() || !auth?.user}
                                className="bg-[#3d5afe] text-white p-2 w-10 h-[42px] shrink-0 rounded-xl flex items-center justify-center hover:bg-[#3d5afe]/80 disabled:opacity-50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                        
                        {/* Character Counter Display */}
                        {auth?.user && (
                            <div className="text-right pr-12">
                                <span className={`text-[10px] font-body transition-colors ${
                                    inputQuestion.length >= 250 ? 'text-red-400 font-bold' : 'text-[#8e8fa2]'
                                }`}>
                                    {inputQuestion.length} / 250
                                </span>
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}