import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: LogOut, label: 'Log Out', action: () => {}, danger: true },
  ];

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
          <h1 className="text-xl font-bold text-[#1a237e]">Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[76px] pb-20 px-4 space-y-6 max-w-screen-sm mx-auto">
        {/* Profile Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#e8eaf6] flex items-center justify-center">
              <User size={40} className="text-[#1a237e]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Guest User</h2>
              <p className="text-sm text-[#666666]">Student</p>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-[#f5f7fa] active:bg-[#e8eaf6] transition-colors
                  ${index !== menuItems.length - 1 ? 'border-b border-[#e8eaf6]' : ''}`}
              >
                <Icon 
                  size={20} 
                  className={item.danger ? 'text-red-500' : 'text-[#1a237e]'} 
                />
                <span className={item.danger ? 'text-red-500' : 'text-[#1a1a1a]'}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </section>

        {/* App Info */}
        <section className="text-center">
          <h3 className="text-sm font-medium text-[#1a237e]">Hive Link v1.0.0</h3>
          <p className="text-xs text-[#666666] mt-1">© 2025 Manipal University Jaipur</p>
        </section>
      </main>
    </div>
  );
} 