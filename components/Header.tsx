
import React from 'react';
import { CakeIcon, LogoutIcon } from './icons';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <CakeIcon className="h-8 w-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Pastelería Admin
          </h1>
        </div>
        <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
