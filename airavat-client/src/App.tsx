"use client"

import { useState } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { Outlet } from "react-router-dom"
import { Navigation } from "./components/Navigation"
import { GhibliDecoration } from "./components/GhibliIllustrations"
import { flaskURL } from "./config/backendURL"

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (message: string) => {
    try {
      setMessages(prev => [...prev, {text: message, isUser: true}]);
      setIsTyping(true);
      setInput('');

      const response = await fetch(`${flaskURL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setMessages(prev => [...prev, 
        {text: data.response, isUser: false}
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev,
        {text: 'Sorry, I encountered an error. Please try again!', isUser: false}
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full font-sans relative overflow-hidden">
      {/* Background decorations */}
      <GhibliDecoration position="top-0 right-0" />
      <GhibliDecoration position="bottom-0 left-0" />

      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <h1 className="font-serif text-2xl text-center font-medium ghibli-gradient-text">Whimsical Wardrobe</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        <div className="container mx-auto max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Navigation */}
      <Navigation />

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-full p-5 shadow-ghibli flex items-center gap-0 transform transition-all duration-300 hover:shadow-ghibli-lg hover:-translate-y-1 z-10"
      >
        <MessageSquare size={25} />
        <span className="font-serif"></span>
      </button>

      {/* AI Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white bg-opacity-90 rounded-2xl w-full max-w-md h-3/4 overflow-hidden flex flex-col shadow-ghibli-lg border border-white">
            <div className="bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white p-4 flex justify-between items-center">
              <h3 className="font-serif font-medium">Fashion Spirit</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-ghibli-cloud transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-lg mb-2 ${
                    msg.isUser ? 'bg-ghibli-sky text-white' : 'bg-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg mb-2">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <form onSubmit={e => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage(input);
                  setInput('');
                }
              }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="w-full p-2 rounded border"
                  placeholder="Ask your fashion spirit..."
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

