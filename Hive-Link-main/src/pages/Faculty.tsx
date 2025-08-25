import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Mail, Phone, MapPin, User } from 'lucide-react';

const facultyMembers = [
  {
    id: '1',
    name: 'Dr. Shikha Chaudhary',
    department: 'Information Technology',
    email: 'shikha.chaudhary@gmail.com',
    phone: '+91 91161 33011',
    office: 'AB2, LG007'
  },
  {
    id: '2',
    name: 'Prof. Namrata Bharadwaj',
    department: 'Economics',
    email: 'namrata.bharadwaj@manipal.edu',
    phone: '+91 98288 05883',
    office: 'AB 3, Room 236'
  },
  {
    id: '3',
    name: 'Dr Lokesh Sharma',
    department: 'Information Technology',
    email: 'lokesh.sharma@manipal.edu',
    phone: '+91 95724xxxxx',
    office: 'Admission Office, Dome Building'
  },
 
];

export function Faculty() {
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
          <h1 className="text-lg font-semibold">Faculty Directory</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="fixed top-[52px] left-0 right-0 bg-white z-40 px-4 pb-3 pt-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search faculty..."
            className="w-full h-11 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500 border-none"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[132px] pb-20 px-4 space-y-3 max-w-screen-sm mx-auto">
        {facultyMembers.map(faculty => (
          <div key={faculty.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">{faculty.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{faculty.department}</p>
                <div className="mt-3 space-y-2">
                  <button className="w-full flex items-center gap-2 text-xs sm:text-sm text-gray-600 active:text-gray-800">
                    <Mail size={14} />
                    <span className="flex-1 text-left">{faculty.email}</span>
                  </button>
                  <button className="w-full flex items-center gap-2 text-xs sm:text-sm text-gray-600 active:text-gray-800">
                    <Phone size={14} />
                    <span className="flex-1 text-left">{faculty.phone}</span>
                  </button>
                  <button className="w-full flex items-center gap-2 text-xs sm:text-sm text-gray-600 active:text-gray-800">
                    <MapPin size={14} />
                    <span className="flex-1 text-left">{faculty.office}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}