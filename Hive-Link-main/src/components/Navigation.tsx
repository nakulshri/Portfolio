import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, User } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/map"
          className={`flex flex-col items-center p-2 ${
            isActive('/map') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Map size={24} />
          <span className="text-xs mt-1">Map</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 ${
            isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}