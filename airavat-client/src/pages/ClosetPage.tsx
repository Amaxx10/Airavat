"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Cloud, Sun } from "lucide-react"

interface Weather {
  location: string
  temp: string
  condition: string
}

interface ClothingItem {
  id: string
  name: string
  image: string
  category: string
}

export function ClosetPage() {
  const [weather, setWeather] = useState<Weather>({
    location: "Valley of the Wind",
    temp: "72°F",
    condition: "Sunny with clouds",
  })

  const [clothes, setClothes] = useState<ClothingItem[]>([
    { id: "1", name: "Meadow Blouse", image: "/placeholder.svg?height=150&width=150", category: "Tops" },
    { id: "2", name: "Forest Trousers", image: "/placeholder.svg?height=150&width=150", category: "Bottoms" },
    { id: "3", name: "Sky Dress", image: "/placeholder.svg?height=150&width=150", category: "Dresses" },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setClothes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: "New Treasure",
          image: imageUrl,
          category: "Uncategorized",
        },
      ])
    }
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const filteredClothes = selectedCategory ? clothes.filter((item) => item.category === selectedCategory) : []

  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      {/* Weather */}
      <div className="ghibli-card p-4 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-ghibli-night">{weather.location}</h3>
            <p className="text-ghibli-night opacity-70 font-serif text-sm">{weather.condition}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-ghibli-sky bg-opacity-30 flex items-center justify-center">
              <Sun size={24} className="text-ghibli-forest" />
            </div>
            <span className="text-xl font-serif text-ghibli-forest">{weather.temp}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between mb-2">
        <label className="bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-ghibli hover:shadow-ghibli-lg transition-all hover:-translate-y-1 cursor-pointer">
          <Camera size={18} />
          <span className="font-serif">Add Item</span>
          <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
        </label>
        <button className="ghibli-card px-4 py-2 text-ghibli-forest font-serif hover:shadow-ghibli transition-shadow">
          Organize
        </button>
      </div>

      {/* Closet */}
      <h2 className="text-xl font-serif font-medium text-ghibli-night mt-6 mb-4">My Magical Wardrobe</h2>

      {selectedCategory ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif text-ghibli-night">{selectedCategory}</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-ghibli-forest hover:text-ghibli-sky font-serif transition-colors"
            >
              Back to Categories
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredClothes.map((item) => (
              <div key={item.id} className="ghibli-card overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h3 className="font-serif text-ghibli-night">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {["Tops", "Bottoms", "Dresses", "Shoes", "Accessories", "Outerwear"].map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="ghibli-card overflow-hidden transition-all hover:shadow-ghibli-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-ghibli-cloud to-ghibli-sky opacity-30 flex items-center justify-center">
                <Cloud size={32} className="text-white" />
              </div>
              <div className="p-3">
                <h3 className="font-serif text-ghibli-night">{category}</h3>
                <p className="text-xs text-ghibli-night opacity-60 font-serif">
                  {clothes.filter((item) => item.category === category).length} items
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

