export function ProfilePage() {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Alex Johnson</h2>
        <p className="text-gray-500">Style Enthusiast</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-white rounded-xl py-3 shadow-sm">
          <p className="text-xl font-bold text-indigo-600">127</p>
          <p className="text-xs text-gray-500">Items</p>
        </div>
        <div className="bg-white rounded-xl py-3 shadow-sm">
          <p className="text-xl font-bold text-indigo-600">34</p>
          <p className="text-xs text-gray-500">Outfits</p>
        </div>
        <div className="bg-white rounded-xl py-3 shadow-sm">
          <p className="text-xl font-bold text-indigo-600">82</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
      </div>

      <div className="space-y-4">
        {["Settings", "Style Preferences", "Notifications", "Privacy", "Help & Support", "About"].map(item => (
          <div key={item} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
            <span className="font-medium text-gray-800">{item}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
} 