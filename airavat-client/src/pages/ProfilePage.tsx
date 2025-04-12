import { ChevronRight } from "lucide-react"

export function ProfilePage() {
  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      <div className="flex flex-col items-center mb-8 relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-ghibli-sky to-ghibli-meadow p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-ghibli-cloud">
            <img src="/placeholder.svg?height=112&width=112" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-serif text-ghibli-night">Alex Johnson</h2>
        <p className="text-ghibli-night opacity-70 font-serif italic">Style Wanderer</p>

        <div className="absolute -z-10 top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-ghibli-sky opacity-20 blur-xl animate-breathe"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="ghibli-card py-4 text-center">
          <p className="text-xl font-serif font-medium text-ghibli-forest">127</p>
          <p className="text-xs text-ghibli-night opacity-70 font-serif">Items</p>
        </div>
        <div className="ghibli-card py-4 text-center">
          <p className="text-xl font-serif font-medium text-ghibli-forest">34</p>
          <p className="text-xs text-ghibli-night opacity-70 font-serif">Outfits</p>
        </div>
        <div className="ghibli-card py-4 text-center">
          <p className="text-xl font-serif font-medium text-ghibli-forest">82</p>
          <p className="text-xs text-ghibli-night opacity-70 font-serif">Likes</p>
        </div>
      </div>

      <div className="space-y-3">
        {["Style Preferences", "Saved Outfits", "Fashion Calendar", "Notifications", "Privacy", "Help & Support"].map(
          (item) => (
            <div key={item} className="ghibli-card p-4 flex justify-between items-center ghibli-button">
              <span className="font-serif text-ghibli-night">{item}</span>
              <ChevronRight size={20} className="text-ghibli-forest" />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

