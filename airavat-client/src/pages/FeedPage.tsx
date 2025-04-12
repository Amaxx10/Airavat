import { Film, Heart, MessageCircle, Share2 } from "lucide-react"

export function FeedPage() {
  const feedItems = [
    {
      id: 1,
      username: "miyazaki_style",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=400&width=300",
      caption: "Inspired by the colors of the valley. Nature's palette is truly the most beautiful.",
      likes: 342,
      comments: 28,
    },
    {
      id: 2,
      username: "totoro_fashion",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=400&width=300",
      caption: "Forest spirits guided me to this outfit combination. Embracing earthy tones today.",
      likes: 517,
      comments: 42,
    },
  ]

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
              <button className="mr-4 transform transition hover:scale-110">
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
    </div>
  )
}

