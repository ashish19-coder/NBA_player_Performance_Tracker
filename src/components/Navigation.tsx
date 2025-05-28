import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, Users, Activity, Moon, Sun } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BarChart2 className="mr-2" size={18} /> },
    { path: '/compare', label: 'Compare Players', icon: <Users className="mr-2" size={18} /> },
  ];

  return (
    <nav className="bg-blue-600 dark:bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Activity size={28} />
            <span className="text-xl font-bold">NBA Player Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-blue-800 ${
                  location.pathname === item.path 
                    ? 'bg-blue-700 dark:bg-blue-800' 
                    : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 mr-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-700 dark:border-blue-800">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-3 px-4 hover:bg-blue-700 dark:hover:bg-blue-800 ${
                  location.pathname === item.path 
                    ? 'bg-blue-700 dark:bg-blue-800' 
                    : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;