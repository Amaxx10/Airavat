import { Home, Search, Heart, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md border-t border-ghibli-sky border-opacity-30 px-6 py-3 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center ${isActive("/") ? "text-ghibli-forest" : "text-ghibli-night text-opacity-60"}`}
        >
          <div className={`p-2 rounded-full ${isActive("/") ? "bg-ghibli-meadow bg-opacity-30" : ""}`}>
            <Home size={22} />
          </div>
          <span className="text-xs mt-1 font-serif">Feed</span>
        </Link>

        <Link
          to="/closet"
          className={`flex flex-col items-center ${isActive("/closet") ? "text-ghibli-forest" : "text-ghibli-night text-opacity-60"}`}
        >
          <div className={`p-2 rounded-full ${isActive("/closet") ? "bg-ghibli-meadow bg-opacity-30" : ""}`}>
            <Search size={22} />
          </div>
          <span className="text-xs mt-1 font-serif">Closet</span>
        </Link>

        <Link
          to="/try-on"
          className={`flex flex-col items-center ${isActive("/try-on") ? "text-ghibli-forest" : "text-ghibli-night text-opacity-60"}`}
        >
          <div className={`p-2 rounded-full ${isActive("/try-on") ? "bg-ghibli-meadow bg-opacity-30" : ""}`}>
            <Heart size={22} />
          </div>
          <span className="text-xs mt-1 font-serif">Try On</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center ${isActive("/profile") ? "text-ghibli-forest" : "text-ghibli-night text-opacity-60"}`}
        >
          <div className={`p-2 rounded-full ${isActive("/profile") ? "bg-ghibli-meadow bg-opacity-30" : ""}`}>
            <User size={22} />
          </div>
          <span className="text-xs mt-1 font-serif">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

