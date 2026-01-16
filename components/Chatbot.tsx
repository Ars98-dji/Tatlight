
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Bonjour ! Je suis De-tatchegnon, votre guide mystique. Comment puis-je vous aider à briller aujourd'hui ?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: "You are 'De-tatchegnon', a mystical and elegant AI assistant for the 'Tatlight' digital platform. You speak French. You are helpful, slightly poetic, and expert in digital products (ebooks, instrumentals, templates). You help users find content to 'shine' in their projects."
        }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "La lumière est trouble en ce moment, réessayez plus tard.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-brand-dark rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">Auto_Awesome</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[380px] h-[550px] bg-brand-night border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary">auto_awesome</span>
               </div>
               <div>
                 <h3 className="text-white text-sm font-bold">De-tatchegnon</h3>
                 <p className="text-[10px] text-green-400">En ligne</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-brand-dark rounded-br-none' 
                    : 'bg-white/10 text-white rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question ici..."
                className="w-full bg-white/5 border-none rounded-full px-5 py-3 text-sm text-white focus:ring-1 focus:ring-primary"
              />
              <button 
                onClick={handleSend}
                className="absolute right-1 top-1 h-9 w-9 bg-primary text-brand-dark rounded-full flex items-center justify-center hover:brightness-110"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
