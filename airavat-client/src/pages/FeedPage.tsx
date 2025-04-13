import { Film, Heart, MessageCircle, Share2, X } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { ngrokURL } from "../config/backendURL"

interface ProductLink {
  title: string
  link: string
  thumbnail: string
}

export function FeedPage() {
  const [productLinks, setProductLinks] = useState<ProductLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const feedItems = [
    {
      id: 1,
      username: "miyaz_style",
      avatar: "/feed1.jpg?height=40&width=40",
      image: "/feed1.jpg?height=400&width=300",
      caption: "Effortless elegance. Our AI analyzes this look for key trends and similar styles",
      likes: 342,
      comments: 28,
    },
    {
      id: 2,
      username: "totoro_fashion",
      avatar: "/feed2.jpg?height=40&width=40",
      image: "/feed2.jpg?height=400&width=300",
      caption: "Cozy vibes in my favorite hoodie. Perfect for a chilly evening",
      likes: 517,
      comments: 159,
    },
    {
      id: 3,
      username: "rodigues_dsouza",
      avatar: "/feed3.jpg?height=40&width=40",
      image: "/feed3.jpg?height=400&width=300",
      caption: "Unlock the secrets of this outfit. Our AI breaks down the details for you",
      likes: 117,
      comments: 23,
    },
    {
      id: 4,
      username: "selena_helen",
      avatar: "/feed4.jpg?height=40&width=40",
      image: "/feed4.jpg?height=400&width=300",
      caption: "Forest spirits guided me to this outfit combination. Embracing earthy tones today.",
      likes: 991,
      comments: 344,
    },
  ]

  const handleLike = async (imageUrl: string) => {
    try {
      setIsLoading(true)
      
      // Fetch the image and convert it to a File object
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], "feed-image.jpg", { type: blob.type })
      
      // Create FormData and append the image
      const formData = new FormData()
      formData.append("image", file)
      formData.append("description", "Fashion feed image analysis")
      formData.append("location", JSON.stringify({ lat: 0, lng: 0 }))
      formData.append(
        "question",
        "Describe the image as if someone is reporting a problem to an authority. Focus on the key issue being reported. Be concise and avoid any introductory or concluding remarks. Do not include any JSON data or preamble/postamble. Do not mention the image itself or that you are describing it. Just state the problem as a report."
      )

      console.log(ngrokURL)
      // Send to the backend
      const res = await axios.post(`${ngrokURL}/query/get_query`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      
      console.log(res.data.product_links)

      setProductLinks(res.data.product_links)
      setShowPopup(true)
    } catch (error) {
      console.error("Error fetching product links:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      {feedItems.length > 0 ? (
        feedItems.map((item) => (
          <div key={item.id} className="ghibli-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-ghibli-sky">
                <img
                  src={item.avatar || "/placeholder.svg"}
                  alt={item.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-3 font-serif text-ghibli-night">{item.username}</span>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={item.image || "/placeholder.svg"}
                alt="Fashion post"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-30"></div>
            </div>

            {/* Actions */}
            <div className="flex items-center p-4">
              <button 
                className="mr-4 transform transition hover:scale-110"
                onClick={() => handleLike(item.image)}
              >
                <Heart size={24} className="text-ghibli-night" />
              </button>
              <button className="mr-4 transform transition hover:scale-110">
                <MessageCircle size={24} className="text-ghibli-night" />
              </button>
              <button className="transform transition hover:scale-110">
                <Share2 size={24} className="text-ghibli-night" />
              </button>
              <span className="ml-auto font-serif text-sm text-ghibli-night">{item.likes} likes</span>
            </div>

            {/* Caption */}
            <div className="px-4 pb-4">
              <p className="font-serif text-ghibli-night">
                <span className="font-medium">{item.username}</span> {item.caption}
              </p>
              <p className="mt-1 text-sm text-ghibli-night opacity-60 font-serif">View all {item.comments} comments</p>
            </div>
          </div>
        ))
      ) : (
        <div className="ghibli-card p-8 text-center">
          <Film size={40} className="mx-auto text-ghibli-forest mb-4" />
          <h3 className="text-xl font-serif font-medium text-ghibli-night mb-2">Style Feed</h3>
          <p className="text-ghibli-night opacity-70 font-serif">
            Discover trending styles and follow your favorite fashion influencers.
          </p>
        </div>
      )}

      {/* Product Links Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-serif text-ghibli-night">Similar Products</h3>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-ghibli-night hover:text-ghibli-forest transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-ghibli-forest border-t-transparent rounded-full"></div>
                </div>
              ) : productLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productLinks.map((product, index) => (
                    <a 
                      key={index}
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghibli-card p-4 hover:shadow-ghibli-lg transition-all hover:-translate-y-1"
                    >
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-serif text-ghibli-night line-clamp-2">{product.title}</h4>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-ghibli-night opacity-70">
                  No similar products found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

