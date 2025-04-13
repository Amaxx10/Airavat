import { Calendar, MapPin, Clock } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  dressCode: string
  image: string
}

export function CalendarEventsPage() {
  const events: Event[] = [
    {
      id: 1,
      title: "Tech Startup Networking Mixer",
      date: "2024-03-25",
      time: "18:00 - 21:00",
      location: "Innovation Hub, San Francisco",
      description: "Network with tech entrepreneurs and investors. Business casual attire recommended.",
      dressCode: "Business Casual",
      image: "/events/tech-mixer.jpg"
    },
    {
      id: 2,
      title: "Spring Fashion Week Preview",
      date: "2024-03-28",
      time: "19:00 - 22:00",
      location: "Design District, Los Angeles",
      description: "Exclusive preview of upcoming spring collections. Creative formal attire.",
      dressCode: "Creative Formal",
      image: "/events/fashion-week.jpg"
    },
    {
      id: 3,
      title: "Art Gallery Opening Night",
      date: "2024-03-30",
      time: "20:00 - 23:00",
      location: "Modern Art Gallery, New York",
      description: "Celebrate the opening of a new contemporary art exhibition.",
      dressCode: "Smart Casual",
      image: "/events/art-gallery.jpg"
    },
    {
      id: 4,
      title: "Business Leadership Conference",
      date: "2024-04-02",
      time: "09:00 - 17:00",
      location: "Convention Center, Chicago",
      description: "Annual gathering of industry leaders and innovators.",
      dressCode: "Professional Business",
      image: "/events/conference.jpg"
    },
    {
      id: 5,
      title: "Wine Tasting Evening",
      date: "2024-04-05",
      time: "19:00 - 22:00",
      location: "Vintage Wine Cellar, Boston",
      description: "Exclusive wine tasting event with sommeliers.",
      dressCode: "Elegant Casual",
      image: "/events/wine-tasting.jpg"
    },
    {
      id: 6,
      title: "Tech Product Launch",
      date: "2024-04-08",
      time: "14:00 - 17:00",
      location: "Tech Hub, Seattle",
      description: "Launch of revolutionary AI-powered fashion app.",
      dressCode: "Business Casual",
      image: "/events/product-launch.jpg"
    },
    {
      id: 7,
      title: "Charity Gala Dinner",
      date: "2024-04-12",
      time: "19:00 - 23:00",
      location: "Grand Hotel, Miami",
      description: "Annual charity gala supporting fashion education.",
      dressCode: "Black Tie",
      image: "/events/gala.jpg"
    },
    {
      id: 8,
      title: "Creative Workshop",
      date: "2024-04-15",
      time: "10:00 - 16:00",
      location: "Creative Space, Portland",
      description: "Hands-on workshop about sustainable fashion.",
      dressCode: "Casual Comfortable",
      image: "/events/workshop.jpg"
    },
    {
      id: 9,
      title: "Fashion Tech Meetup",
      date: "2024-04-18",
      time: "18:30 - 21:00",
      location: "Innovation Center, Austin",
      description: "Monthly meetup for fashion tech enthusiasts.",
      dressCode: "Smart Casual",
      image: "/events/meetup.jpg"
    },
    {
      id: 10,
      title: "Seasonal Fashion Show",
      date: "2024-04-20",
      time: "20:00 - 23:00",
      location: "Fashion District, Las Vegas",
      description: "Exclusive preview of summer collections.",
      dressCode: "Formal Evening",
      image: "/events/fashion-show.jpg"
    }
  ]

  return (
    <div className="animate-fadeIn space-y-6 pb-6">
      <div className="ghibli-card p-6">
        <div className="flex items-center mb-6">
          <Calendar className="w-8 h-8 text-ghibli-forest mr-3" />
          <h1 className="text-2xl font-serif text-ghibli-night">Upcoming Events</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="ghibli-card p-4 hover:shadow-ghibli-lg transition-all">
              {/* <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-ghibli-sky">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div> */}
              
              <h3 className="text-xl font-serif text-ghibli-night mb-2">{event.title}</h3>
              
              <div className="space-y-2 text-ghibli-night opacity-80">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.date} • {event.time}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <p className="mt-3 text-ghibli-night opacity-70">{event.description}</p>
              
              <div className="mt-4 pt-4 border-t border-ghibli-sky">
                <span className="text-sm font-medium text-ghibli-forest">Dress Code: {event.dressCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 