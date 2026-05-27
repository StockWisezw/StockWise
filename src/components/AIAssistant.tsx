import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Phone, Terminal, Loader2 } from 'lucide-react';
import { rawSupabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_email: string;
  text: string;
  created_at: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'support'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rawSupabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await rawSupabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to realtime postgres_changes
    const channel = rawSupabase
      .channel('public:chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => {
      rawSupabase.removeChannel(channel);
    };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      const sender_id = currentUser?.id || 'anonymous';
      const sender_email = currentUser?.email || 'anonymous@tareza.co.zw';

      const { error } = await rawSupabase.from('chat_messages').insert({
        id: uuidv4(),
        sender_id,
        sender_email,
        text: textToSend,
        created_at: new Date().toISOString()
      });

      if (error) {
        toast.error('Failed to dispatch support message');
      }
    } catch (err) {
      toast.error('Could not connect to support channel');
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 dark:bg-white dark:border-white text-white dark:text-zinc-900 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Floating Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-22 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden z-50 font-sans"
          >
            {/* Header */}
            <div className="bg-zinc-900 dark:bg-zinc-900 px-4 py-3 flex items-center justify-between text-white border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm tracking-tight">Tareza Support Centre</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800/80 text-xs font-semibold bg-zinc-50 dark:bg-zinc-900/10">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2.5 text-center transition-all ${
                  activeTab === 'chat'
                    ? 'border-b-2 border-zinc-950 text-zinc-950 dark:border-white dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Support Chat
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`flex-1 py-2.5 text-center transition-all ${
                  activeTab === 'support'
                    ? 'border-b-2 border-zinc-950 text-zinc-950 dark:border-white dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Support
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0 bg-zinc-50/50 dark:bg-zinc-950/20">
              {activeTab === 'chat' ? (
                <>
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-400">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                      <MessageSquare className="h-8 w-8 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-semibold">Start a real-time thread</p>
                      <p className="text-[10px] mt-1 max-w-[200px]">Send a message to sync instantly with technical support agents.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {messages.map((msg) => {
                        const isMe = msg.sender_id === (currentUser?.id || 'anonymous');
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[9px] text-zinc-400 mb-1 px-1">
                              {msg.sender_email.split('@')[0]}
                            </span>
                            <div
                              className={`max-w-[80%] rounded-xl px-3 py-1.5 text-xs ${
                                isMe
                                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                                  : 'bg-zinc-200 text-zinc-950 dark:bg-zinc-800/80 dark:text-white'
                              }`}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col h-full justify-center space-y-4 p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Phone className="h-10 w-10 text-indigo-500 mb-2 stroke-[1.5]" />
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Need Immediate Help?</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Our on-call support team is available 24/7 for urgent escalations.</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://wa.me/263776699950"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Contact WhatsApp Support
                    </a>
                    
                    <a
                      href="/developer-panel"
                      className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:text-white transition-all font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      Open Diagnostic Terminal
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar for Chat */}
            {activeTab === 'chat' && (
              <form 
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask for support..."
                  className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-xs px-3 py-2 rounded-xl outline-none border-b border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 transition-all dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-8 w-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
