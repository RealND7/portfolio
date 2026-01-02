import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dateString = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}(${days[now.getDay()]})`;
      setCurrentDate(dateString);
    };
    
    updateDate();
    const timer = setInterval(updateDate, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Project', path: '/projects' },
    { name: 'Skills', path: '/skills' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-50 h-16 border-b border-gray-800">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Left Side: Date, Weather */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-200 min-w-[200px]">
          <span>{currentDate}</span>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-brand-lime" />
            <span>Gyeonggi -4.2°C</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex h-full items-start flex-1 justify-end mr-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                h-14 px-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded-b-2xl ml-2 border-x border-b border-gray-700/50
                ${isActive(item.path) 
                  ? 'bg-brand-blue text-white shadow-[0_4px_14px_0_rgba(53,69,214,0.39)] translate-y-0 z-10' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 translate-y-[-4px] hover:translate-y-0'}
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side: Name */}
        <div className="hidden md:block font-bold text-lg tracking-wide whitespace-nowrap min-w-fit">
          PARK YOUNG SUN
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none ml-auto"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-t border-gray-800 overflow-hidden absolute w-full"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Date & Weather */}
              <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-800 text-sm text-gray-400">
                <span>{currentDate}</span>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-brand-lime" />
                  <span>Gyeonggi -4.2°C</span>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-bold ${
                    isActive(item.path)
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
