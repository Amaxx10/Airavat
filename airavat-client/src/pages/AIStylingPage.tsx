import { Calendar, Sparkles } from "lucide-react"
import axios from "axios";
import { backendURL } from "../config/backendURL";
import { useState } from "react";
import { Link } from "react-router-dom";

export function AIStylingPage() {
  const [outfitData, setOutfitData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSummonOutfit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/ai/ai_styling`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setOutfitData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-medium ghibli-gradient-text mb-2">Fashion Spirit Styling</h2>
        <p className="text-ghibli-night opacity-70 font-serif">Let the spirits guide your style journey</p>
      </div>

      <div className="ghibli-card p-6 mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-ghibli-sky opacity-20 blur-xl"></div>

        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-ghibli-meadow bg-opacity-30 flex items-center justify-center">
            <Calendar size={24} className="text-ghibli-forest" />
          </div>
          <h3 className="font-serif text-lg text-ghibli-night">Seasonal Events</h3>
        </div>

        <p className="text-ghibli-night opacity-80 font-serif mb-4">
          Connect your calendar to receive outfit suggestions for your upcoming events and seasonal changes.
        </p>
        <Link to="/calendar">
  <button className="w-full ghibli-card py-3 flex items-center justify-center gap-2 font-serif text-ghibli-night">
    <Calendar size={18} />
    <span>Connect Calendar</span>
  </button>
</Link>
      </div>

      <div className="ghibli-card p-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-ghibli-blossom opacity-20 blur-xl"></div>

        <h3 className="font-serif text-lg text-ghibli-night mb-4 relative z-10">Create a Magical Style</h3>

        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">Occasion</label>
            <select className="w-full ghibli-input font-serif">
              <option>Select occasion</option>
              <option>Morning Adventure</option>
              <option>Afternoon Tea</option>
              <option>Evening Gathering</option>
              <option>Moonlight Festival</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">Style Essence</label>
            <select className="w-full ghibli-input font-serif">
              <option>Select style</option>
              <option>Forest Spirit</option>
              <option>Ocean Whisper</option>
              <option>Sky Wanderer</option>
              <option>Earth Guardian</option>
            </select>
          </div>

          <div>
            {/* <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">Color Palette</label>
            <div className="flex gap-2 mb-4">
              {["#a8d8ea", "#c5e0b4", "#ffcdb2", "#ffc8dd", "#d4a373"].map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div> */}
          </div>

          <button onClick={handleSummonOutfit} className="w-full bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-xl py-3 font-serif shadow-ghibli hover:shadow-ghibli-lg transition-shadow transform hover:-translate-y-1">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={18} />
              <span>Summon Your Outfit</span>
            </div>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center">
          <p className="font-serif">Summoning your magical outfit...</p>
        </div>
      )}

      {outfitData && (
        <div className="ghibli-card p-6 space-y-4">
          <h3 className="font-serif text-lg text-ghibli-night">Your Magical Outfit</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-serif">Upper Garment</h4>
              <img 
                src={outfitData.suggestion.upper_garment.image} 
                alt="Upper garment"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm">{outfitData.suggestion.upper_garment.description}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-serif">Lower Garment</h4>
              <img 
                src={outfitData.suggestion.lower_garment.image} 
                alt="Lower garment"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm">{outfitData.suggestion.lower_garment.description}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

