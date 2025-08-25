"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { collection, addDoc } from "firebase/firestore" // Firebase functions
import { db } from "../firebase" // Import Firestore
import { MapPin, Building2, Calendar, Users, Search, User, Clock, Navigation, Plus } from "lucide-react"



export function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  const recentPlaces = [
    {
      id: "1",
      name: "AB1",
      image: "https://miro.medium.com/v2/resize:fit:1400/0*4CRzZkB-NqQlAEtP.jpg",
      time: "2 days ago",
    },
    {
      id: "2",
      name: "Main Library",
      image: "https://jaipur.manipal.edu/fohs/img/facilities/lab/lib-3.png",
      time: "5 days ago",
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      name: "Tech Conference 2024",
      location: "SMT Sharda Pai auditorium",
      date: "Mar 15, 2024",
      time: "10:00 AM",
    },
    {
      id: "2",
      name: "Career Fair",
      location: "Student Activity Center",
      date: "Mar 20, 2024",
      time: "2:00 PM",
    },
  ]

  // Firestore Function: Add a New Place
  const addPlaceToFirestore = async () => {
    setLoading(true);
  
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const newPlace = {
            name: "New Campus Spot",
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
            
            latitude, // Captured location
            longitude, // Captured location
            timestamp: new Date(),
          };
  
          await addDoc(collection(db, "places"), newPlace);
          alert("New place added successfully!");
        } catch (error) {
          console.error("Error adding place:", error);
          alert("Failed to add place!");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not get location. Please enable location services.");
        setLoading(false);
      }
    );
  };
  

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="safe-top px-4 h-[60px] flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1a237e]">
            Hive Link
          </h1>
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f7fa] hover:bg-[#e8eaf6] active:bg-[#c5cae9] transition-colors"
          >
            <User size={20} className="text-[#1a237e]" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="fixed top-[60px] left-0 right-0 bg-white z-40 px-4 pb-4 pt-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" size={18} />
          <input
            type="text"
            placeholder="Search places..."
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f5f7fa] text-sm focus:ring-2 focus:ring-[#1a237e] border-none transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[140px] pb-20 px-4 space-y-6 max-w-screen-sm mx-auto">
        {/* Quick Access Icons */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { icon: Users, label: "Faculty", color: "[#1a237e]", path: "/faculty" },
            { icon: Calendar, label: "Events", color: "[#2196f3]", path: "/events" },
            { icon: Building2, label: "Buildings", color: "[#f50057]", path: "/buildings" },
            { icon: MapPin, label: "Map", color: "[#1a237e]", path: "/map" },
          ].map(({ icon: Icon, label, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md active:scale-95 transition-all`}
            >
              <Icon size={24} className={`mb-2 text-${color}`} />
              <span className="text-xs font-medium text-center leading-tight text-[#1a1a1a]">{label}</span>
            </button>
          ))}
        </div>

        {/* Recent Places */}
        <section className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1a1a1a] flex items-center gap-2">
              <Clock size={18} className="text-[#1a237e]" />
              Recent Places
            </h2>
            <button className="text-sm text-[#1a237e] font-medium hover:text-[#2196f3] transition-colors">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentPlaces.map((place) => (
              <button
                key={place.id}
                className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md active:scale-98 transition-all"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-medium leading-tight">{place.name}</h3>
                  <p className="text-white/90 text-xs mt-1">{place.time}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Add Place Button */}
        <button
          onClick={addPlaceToFirestore}
          disabled={loading}
          className="w-full flex items-center justify-center bg-[#1a237e] text-white py-3 rounded-xl shadow-sm hover:shadow-md active:scale-98 transition-all disabled:bg-gray-300 disabled:shadow-none"
        >
          <Plus size={20} className="mr-2" />
          {loading ? "Adding..." : "Add New Place"}
        </button>

        {/* Upcoming Events */}
        <section className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1a1a1a] flex items-center gap-2">
              <Calendar size={18} className="text-[#1a237e]" />
              Upcoming Events
            </h2>
            <button className="text-sm text-[#1a237e] font-medium hover:text-[#2196f3] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                className="w-full bg-[#f5f7fa] p-4 rounded-xl text-left hover:bg-[#e8eaf6] active:bg-[#c5cae9] transition-colors"
              >
                <h3 className="font-medium text-sm text-[#1a1a1a]">{event.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#666666] mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8eaf6] safe-bottom">
        <div className="flex justify-around items-center h-[64px] max-w-screen-sm mx-auto">
          {[
            { icon: Navigation, label: "Home", path: "/" },
            { icon: MapPin, label: "Navigation", path: "/navigation" },
            { icon: MapPin, label: "Live Map", path: "/livemap" },
            { icon: User, label: "Profile", path: "/profile" },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center p-1 min-w-[72px] h-full active:scale-95 transition-all
                ${location.pathname === path ? "text-[#1a237e]" : "text-[#666666] hover:text-[#2196f3]"}`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

