
import React from 'react';
import { CakeIcon, LogoutIcon } from './icons';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <CakeIcon className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Pastelería Admin
          </h1>
        </div>
        <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Cerrar sesión"
        >
            <LogoutIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;