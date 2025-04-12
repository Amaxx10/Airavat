import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-purple-50 to-indigo-50 font-sans">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>

      {/* Navigation */}
      <Navigation />

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-lg flex items-center gap-2 transform transition-transform hover:scale-105 z-10"
      >
        <MessageSquare size={18} />
        <span className="font-medium">AI Fashion Stylist</span>
      </button>

      {/* AI Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md h-3/4 overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">AI Fashion Stylist</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {/* Chat messages would go here */}
              <div className="mb-4 max-w-xs ml-auto bg-indigo-500 text-white rounded-lg p-3">
                Hello! I'm your AI Fashion Stylist. How can I help you today?
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask about your style..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button className="bg-indigo-500 text-white rounded-full p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
