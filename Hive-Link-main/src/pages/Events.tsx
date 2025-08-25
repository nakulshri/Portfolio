import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Clock, MapPin, Users } from 'lucide-react';

const events = [
  {
    id: '1',
    name: 'Tech Conference 2024',
    date: 'Mar 15, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'Sharda Pai Auditorium',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    attendees: 120,
    description: 'Annual technology conference featuring industry leaders and innovative showcases.'
  },
  {
    id: '2',
    name: 'Career Fair',
    date: 'Mar 20, 2024',
    time: '2:00 PM - 6:00 PM',
    location: 'Student Activity Center',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
    attendees: 250,
    description: 'Connect with top employers and explore career opportunities across various industries.'
  },
  {
    id: '3',
    name: 'Research Symposium',
    date: 'Mar 25, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Science Building',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    attendees: 85,
    description: 'Annual showcase of groundbreaking research projects from various departments.'
  }
];

export function Events() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="safe-top px-4 h-[52px] flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">Events</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="fixed top-[52px] left-0 right-0 bg-white z-40 px-4 pb-3 pt-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full h-11 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500 border-none"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[132px] pb-20 px-4 space-y-3 max-w-screen-sm mx-auto">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base">{event.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.description}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Users size={14} />
                  <span>{event.attendees} Attending</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium active:bg-blue-700 transition-colors">
                Register
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}