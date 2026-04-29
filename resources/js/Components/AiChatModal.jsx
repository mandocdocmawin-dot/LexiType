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
            fetchAIAnalysis();
        }
    }, [isOpen]);

    const fetchAIAnalysis = async (question = "") => {
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
                content: response.data.message,
                stats: {
                    wpm: response.data.best_wpm,
                    accuracy: response.data.avg_accuracy,
                    focusLetters: response.data.focus_letters
                }
            }]);

            if (response.data.remaining_requests !== undefined) {
                setRemainingLimit(response.data.remaining_requests);
            }

        } catch (error) {
            console.error("AI Analysis Error:", error);
            setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, I cannot connect to the server right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputQuestion.trim()) return;
        
        const questionToAsk = inputQuestion;
        setInputQuestion(""); // Clear the input box
        fetchAIAnalysis(questionToAsk);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0b1326] border border-[#3d5afe]/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-[#131b2e] p-4 flex justify-between items-center border-b border-[#3d5afe]/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3d5afe]/20 flex items-center justify-center text-[#3d5afe]">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                            <h2 className="text-white font-bold font-headline tracking-wide">LexiType Coach</h2>
                            {remainingLimit !== null && (
                                <p className="text-xs text-[#8e8fa2]">Credits remaining today: {remainingLimit}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[#8e8fa2] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-[#3d5afe] text-white rounded-tr-sm' 
                                    : 'bg-[#1e293b] text-[#dae2fd] rounded-tl-sm border border-white/5'
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                
                                {/* Show stats if the message is from AI and contains statistics (usually the first message) */}
                                {msg.role === 'ai' && msg.stats && msg.stats.wpm > 0 && index === 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-black/20 p-2 rounded-lg">
                                            <span className="text-[#8e8fa2] block mb-1">Best WPM</span>
                                            <span className="font-bold text-white">{msg.stats.wpm}</span>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded-lg">
                                            <span className="text-[#8e8fa2] block mb-1">Accuracy</span>
                                            <span className="font-bold text-white">{msg.stats.accuracy}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#1e293b] p-3 rounded-2xl rounded-tl-sm border border-white/5">
                                <span className="material-symbols-outlined animate-spin text-[#3d5afe]">sync</span>
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
                            placeholder="Ask for typing tips..."
                            className="flex-1 bg-[#0b1326] text-white border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3d5afe]/50 transition-colors"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !inputQuestion.trim()}
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