import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface Weather {
  location: string;
  temp: string;
  condition: string;
}

interface ClothingItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

export function ClosetPage() {
  const [weather, setWeather] = useState<Weather>({
    location: 'Loading...',
    temp: '--',
    condition: 'Loading...',
  });

  const [clothes, setClothes] = useState<ClothingItem[]>([
    { id: '1', name: 'Blue T-Shirt', image: 'https://via.placeholder.com/150', category: 'Tops' },
    { id: '2', name: 'Black Jeans', image: 'https://via.placeholder.com/150', category: 'Bottoms' },
    { id: '3', name: 'Red Dress', image: 'https://via.placeholder.com/150', category: 'Dresses' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First, get the user's location from IP
        const ipResponse = await fetch('https://api.ipapi.com/api/check?access_key=YOUR_IPAPI_KEY');
        const ipData = await ipResponse.json();
        
        // Then, get the weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${ipData.latitude}&lon=${ipData.longitude}&units=imperial&appid=YOUR_OPENWEATHER_API_KEY`
        );
        const weatherData = await weatherResponse.json();
        
        setWeather({
          location: ipData.city,
          temp: `${Math.round(weatherData.main.temp)}°F`,
          condition: weatherData.weather[0].main
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeather({
          location: "Location unavailable",
          temp: "--°F",
          condition: "Weather data unavailable"
        });
      }
    };

    fetchWeather();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setClothes(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: 'New Item',
          image: imageUrl,
          category: 'Uncategorized',
        },
      ]);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredClothes = selectedCategory
    ? clothes.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="animate-fadeIn">
      {/* Weather */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{weather.location}</h3>
            <p className="text-gray-500">{weather.condition}</p>
          </div>
          <div className="text-2xl font-bold text-indigo-700">{weather.temp}</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between mb-6">
        <label className="bg-indigo-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-md cursor-pointer">
          <Camera size={18} />
          <span>Add Item</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <button className="bg-white text-indigo-600 border border-indigo-200 rounded-lg px-4 py-2 shadow-sm">
          Organize
        </button>
      </div>

      {/* Closet */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Closet</h2>

      {selectedCategory ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{selectedCategory}</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Back to Categories
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredClothes.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'].map(category => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800">{category}</h3>
                <p className="text-xs text-gray-500">
                  {clothes.filter(item => item.category === category).length} items
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
