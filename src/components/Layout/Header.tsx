import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isMobile }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Year Selector */}
          <select className="hidden sm:block px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Année 2024-2025</option>
            <option>Année 2023-2024</option>
          </select>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-800">Admin Principal</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;