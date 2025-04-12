"use client"

import { useState } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { Outlet } from "react-router-dom"
import { Navigation } from "./components/Navigation"
import { GhibliDecoration } from "./components/GhibliIllustrations"

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")

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
        className="fixed bottom-20 right-4 bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-full p-3 shadow-ghibli flex items-center gap-2 transform transition-all duration-300 hover:shadow-ghibli-lg hover:-translate-y-1 z-10"
      >
        <MessageSquare size={18} />
        <span className="font-serif">Fashion Spirit</span>
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
            <div className="flex-1 overflow-y-auto p-4 bg-ghibli-cloud bg-opacity-30">
              {/* Chat messages */}
              <div className="mb-4 max-w-xs ml-auto bg-ghibli-forest text-white rounded-2xl p-3 shadow-sm">
                <p className="font-serif">Hello! I'm your Fashion Spirit. How can I help you find your style today?</p>
              </div>

              <div className="mb-4 max-w-xs bg-white bg-opacity-70 rounded-2xl p-3 shadow-sm">
                <p className="font-serif">
                  I can suggest outfits, help you organize your closet, or give you style advice for any occasion.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-ghibli-sky border-opacity-30 flex gap-2">
              <input
                type="text"
                placeholder="Ask about your style..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 ghibli-input font-serif"
              />
              <button className="bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

