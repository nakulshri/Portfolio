import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, MapPin, Info } from 'lucide-react';

const buildings = [
  {
    id: '1',
    name: 'AB 2',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585',
    hours: '7:00 AM - 10:00 PM',
    location: 'North Campus',
    facilities: ['Labs', 'Lecture Halls', 'Study Areas'],
    description: 'Home to state-of-the-art research facilities and modern classrooms.'
  },
  {
    id: '2',
    name: 'Main Library',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
    hours: '24/7',
    location: 'Central Campus',
    facilities: ['Study Rooms', 'Computer Lab', 'Cafe'],
    description: 'A comprehensive research library with extensive digital and print collections.'
  },
  {
    id: '3',
    name: 'Student Activity Center',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3',
    hours: '6:00 AM - 11:00 PM',
    location: 'South Campus',
    facilities: ['Food Court', 'Meeting Rooms', 'Recreation'],
    description: 'The hub of student life featuring dining, recreation, and meeting spaces.'
  }
];

export function Buildings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="safe-top px-4 h-[60px] flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f7fa] hover:bg-[#e8eaf6] active:bg-[#c5cae9] transition-colors"
          >
            <ArrowLeft size={20} className="text-[#1a237e]" />
          </button>
          <h1 className="text-xl font-semibold text-[#1a237e]">Buildings</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="fixed top-[60px] left-0 right-0 bg-white z-40 px-4 pb-4 pt-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" size={18} />
          <input
            type="text"
            placeholder="Search buildings..."
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f5f7fa] text-sm focus:ring-2 focus:ring-[#1a237e] border-none transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[140px] pb-20 px-4 space-y-6 max-w-screen-sm mx-auto">
        {buildings.map(building => (
          <div key={building.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={building.image}
                alt={building.name}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-semibold text-xl">{building.name}</h3>
                <p className="text-white/90 text-sm mt-2">{building.description}</p>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Clock size={18} className="text-[#1a237e]" />
                  <span>{building.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <MapPin size={18} className="text-[#1a237e]" />
                  <span>{building.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Info size={18} className="text-[#1a237e] mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-[#666666] mb-2">Facilities</div>
                  <div className="flex flex-wrap gap-2">
                    {building.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-[#f5f7fa] px-3 py-1.5 rounded-full text-sm text-[#1a237e] font-medium"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/map')}
                className="w-full mt-2 bg-[#1a237e] text-white py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md active:scale-98 transition-all"
              >
                View on Map
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}