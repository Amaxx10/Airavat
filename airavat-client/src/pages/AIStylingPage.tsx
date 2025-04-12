export function AIStylingPage() {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">AI Styling</h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M21 9H3" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg">Calendar Events</h3>
        </div>
        <p className="text-gray-600 mb-4">Connect with Google Calendar to get outfit recommendations for your upcoming events.</p>
        <button className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-2 flex items-center justify-center gap-2 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 4V20M18 4V20" stroke="currentColor" strokeWidth="2" />
            <rect width="20" height="18" x="2" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M2 9H22" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Connect Calendar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4">Create a Style</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
            <select className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option>Select occasion</option>
              <option>Business Meeting</option>
              <option>Casual Outing</option>
              <option>Date Night</option>
              <option>Formal Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style Preference</label>
            <select className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option>Select style</option>
              <option>Classic</option>
              <option>Minimalist</option>
              <option>Street Style</option>
              <option>Vintage</option>
            </select>
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg py-3 font-medium shadow-md">
            Generate Outfit
          </button>
        </div>
      </div>
    </div>
  );
} 