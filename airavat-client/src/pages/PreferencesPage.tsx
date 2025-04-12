import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Sparkles, Save } from "lucide-react"
import { backendURL } from "../config/backendURL"

const bodyShapes = [
  { id: "lean", label: "Lean/Slim" },
  { id: "athletic", label: "Athletic/Fit" },
  { id: "muscular", label: "Muscular/Built" },
  { id: "plus-size", label: "Plus Size" },
  { id: "petite", label: "Petite" },
  { id: "average", label: "Average" }
]

const styleCategories = [
  { id: "baggy", label: "Baggy & Comfortable" },
  { id: "athletic", label: "Athletic" },
  { id: "sporty", label: "Sporty" },
  { id: "professional", label: "Professional" },
  { id: "old-money", label: "Old Money" },
  { id: "minimalist", label: "Minimalist" },
  { id: "streetwear", label: "Streetwear" },
  { id: "bohemian", label: "Bohemian" },
  { id: "vintage", label: "Vintage" }
]

export function PreferencesPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    gender: "",
    skinTone: "",
    bodyShape: "",
    stylePreferences: [] as string[],
    colorPreferences: [] as string[]
  });

  const handleStyleToggle = (styleId: string) => {
    setFormData(prev => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(styleId)
        ? prev.stylePreferences.filter(id => id !== styleId)
        : [...prev.stylePreferences, styleId]
    }));
  };

  const isFormValid = () => {
    return formData.gender && formData.skinTone && formData.bodyShape && formData.stylePreferences.length > 0;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isFormValid()) {
        setError("Please fill out all fields");
        return;
      }

      console.log("Submitting preferences:", formData);
      console.log("API URL:", `${backendURL}/preference/preferences`);
      
      const response = await axios.post(`${backendURL}/preference/preferences`, {
        preferences: formData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Server response:", response.data);
      localStorage.setItem('stylePreferences', JSON.stringify(formData));
      navigate("/closet");
    } catch (error: any) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to save preferences: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-medium ghibli-gradient-text mb-2">
          Style Preferences
        </h2>
        <p className="text-ghibli-night opacity-70 font-serif">
          Help us understand your unique style
        </p>
      </div>

      <div className="space-y-6">
        <div className="ghibli-card p-6">
          <h3 className="font-serif text-lg text-ghibli-night mb-4">About You</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">
                Gender
              </label>
              <select 
                className="w-full ghibli-input font-serif"
                value={formData.gender}
                onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">
                Skin Tone
              </label>
              <select 
                className="w-full ghibli-input font-serif"
                value={formData.skinTone}
                onChange={e => setFormData(prev => ({ ...prev, skinTone: e.target.value }))}
              >
                <option value="">Select skin tone</option>
                <option value="fair">Fair</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="olive">Olive</option>
                <option value="brown">Brown</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-serif text-ghibli-night opacity-80 mb-2">
                Body Shape
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bodyShapes.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setFormData(prev => ({ ...prev, bodyShape: shape.id }))}
                    className={`p-3 rounded-xl font-serif text-sm transition-all ${
                      formData.bodyShape === shape.id
                        ? "bg-ghibli-forest text-white"
                        : "bg-white bg-opacity-50 text-ghibli-night hover:bg-opacity-70"
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ghibli-card p-6">
          <h3 className="font-serif text-lg text-ghibli-night mb-4">Style Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {styleCategories.map(style => (
              <button
                key={style.id}
                onClick={() => handleStyleToggle(style.id)}
                className={`p-3 rounded-xl font-serif text-sm transition-all ${
                  formData.stylePreferences.includes(style.id)
                    ? "bg-ghibli-forest text-white"
                    : "bg-white bg-opacity-50 text-ghibli-night hover:bg-opacity-70"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid()}
          className={`w-full bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-xl py-3 font-serif shadow-ghibli hover:shadow-ghibli-lg transition-all transform hover:-translate-y-1 ${
            (isLoading || !isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Save size={18} />
            <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
          </div>
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
