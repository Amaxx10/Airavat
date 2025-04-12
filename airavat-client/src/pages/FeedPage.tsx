import { Film } from 'lucide-react';

export function FeedPage() {
  return (
    <div className="animate-fadeIn -mx-4 h-full">
      <div className="relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center p-4">
            <Film size={40} className="mx-auto text-gray-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-700">Style Feed</h3>
            <p className="text-gray-500 mt-2">Swipe up to discover trending styles and follow your favorite fashion influencers.</p>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 z-10">
          <div className="flex flex-col items-center gap-4">
            <button className="bg-white rounded-full p-2 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="bg-white rounded-full p-2 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
            <button className="bg-white rounded-full p-2 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 