"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera, Sun } from "lucide-react"
import axios from "axios"
import { ngrokURL, backendURL } from "../config/backendURL"

interface Weather {
  location: string
  temp: string
  condition: string
}

interface ClothingItem {
  id: string
  image: string
  description?: string
}

export function ClosetPage() {
  const [weather] = useState<Weather>({
    location: "Mumbai, Maharashtra",
    temp: "28°C",
    condition: "Partly Cloudy",
  });

  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch closet items from backend
  useEffect(() => {
    const fetchClosetItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${backendURL}/closet/get_images`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }

        const data = await response.json();
        console.log('Closet response data:', data);
        
        if (!data.images || !Array.isArray(data.images)) {
          throw new Error('Invalid response format: expected images array');
        }

        // Transform the response data into our ClothingItem format
        const transformedItems = data.images.map((image: string, index: number) => ({
          id: `item-${index}`,
          image: image,
          description: `Clothing item ${index + 1}`
        }))

        setClothes(transformedItems)
        setError(null)
      } catch (err) {
        console.error("Error fetching closet items:", err)
        setError("Failed to load closet items. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClosetItems()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("image", file)
        formData.append("description", "New clothing item")
        formData.append("dress_type", "upper garment")

        const response = await axios.get(`${ngrokURL}/closet/get_images`)

        // Add the new item to the state
        const newItem = {
          id: response.data.dress.dress_id.toString(),
          image: response.data.dress.image,
          description: response.data.dress.description
        }

        setClothes(prev => [...prev, newItem])
      } catch (err) {
        console.error("Error uploading image:", err)
        setError("Failed to upload image. Please try again.")
      }
    }
  }

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
      </div>

      {/* Closet Grid */}
      <h2 className="text-xl font-serif font-medium text-ghibli-night mt-6 mb-4">My Magical Wardrobe</h2>

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin w-8 h-8 border-4 border-ghibli-forest border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {clothes.map((item) => (
            <div key={item.id} className="ghibli-card cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-ghibli-lg group">
              <div className="relative pt-[100%]">
                <img 
                  src={item.image} 
                  alt={item.description || "Clothing item"} 
                  className="absolute inset-0 w-full h-full object-contain bg-white p-2"
                />
              </div>
              {item.description && (
                <div className="p-3 bg-white">
                  <p className="text-sm text-center text-black opacity-80 font-serif">{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

