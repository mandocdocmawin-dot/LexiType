import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AiChatModal({ isOpen, onClose, auth }) {
    const [messages, setMessages] = useState([]);
    const [inputQuestion, setInputQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [remainingLimit, setRemainingLimit] = useState(null);
    const messagesEndRef = useRef(null);

    // Scroll to the bottom when a new message is added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch initial feedback automatically when the modal opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // CHECK NATIN KUNG NAKA-LOG IN ANG USER
            if (auth?.user) {
                fetchAIAnalysis();
            } else {
                // KUNG HINDI NAKA-LOG IN, ITO LANG ANG IPAPAKITA NATIN
                setMessages([{ 
                    role: 'ai', 
                    content: "Hello! Please log in to your account so I can analyze your typing data and give you personalized tips." 
                }]);
            }
        }
    }, [isOpen]);

    const fetchAIAnalysis = async (question = "") => {
        // Double check kung naka-log in bago mag-request
        if (!auth?.user) return; 

        setIsLoading(true);

        // If the user typed a question, append it to the chat history
        if (question) {
            setMessages((prev) => [...prev, { role: 'user', content: question }]);
        }

        try {
            const response = await axios.post('/ai-analysis', {
                question: question
            });

            // Append the AI's response to the chat history
            setMessages((prev) => [...prev, { 
                role: 'ai', 
                content: response.data.message 
            }]);

            // Update limit
            if (response.data.remaining_requests !== undefined) {
                setRemainingLimit(response.data.remaining_requests);
            }

        } catch (error) {
            console.error("AI Fetch Error:", error);
            
            // Show generic error message on failure
            setMessages((prev) => [...prev, { 
                role: 'ai', 
                content: "Sorry, I cannot connect to the server right now." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputQuestion.trim() || isLoading) return;

        fetchAIAnalysis(inputQuestion);
        setInputQuestion(""); // Clear input
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

                {/* Quota Indicator (Only show if user is logged in) */}
                {auth?.user && remainingLimit !== null && (
                    <div className="px-6 py-2 bg-[#3d5afe]/10 border-b border-[#3d5afe]/10 flex justify-between items-center">
                        <span className="text-xs text-[#8e8fa2]">Daily AI Limit</span>
                        <span className={`text-xs font-bold ${remainingLimit > 0 ? 'text-[#bbc3ff]' : 'text-red-400'}`}>
                            {remainingLimit} / 6 remaining
                        </span>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
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
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputQuestion}
                            onChange={(e) => setInputQuestion(e.target.value)}
                            placeholder={auth?.user ? "Ask for typing tips..." : "Log in to ask questions..."}
                            className="flex-1 bg-[#0b1326] text-white border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3d5afe]/50 transition-colors disabled:opacity-50"
                            disabled={isLoading || !auth?.user} // Na-disable kapag hindi logged in
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !inputQuestion.trim() || !auth?.user}
                            className="bg-[#3d5afe] text-white p-2 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#3d5afe]/80 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}