import React, { useState } from 'react';
import { HeartPulse, LayoutDashboard, LifeBuoy, LogOut } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state for verification
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) => 
    `relative text-sm font-medium transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-white cursor-pointer ${
      isActive ? 'text-primary dark:text-white' : 'text-slate-600 dark:text-slate-400'
    }`;

  const ActiveIndicator = () => (
    <motion.div 
      layoutId="activeNav"
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Blood<span className="text-primary">Web</span>
          </h2>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Home
                {isActive && <ActiveIndicator />}
              </>
            )}
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                About
                {isActive && <ActiveIndicator />}
              </>
            )}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 relative">
          {!isAuthenticated ? (
            <button 
              onClick={() => {
                navigate('/login');
              }}
              className="hidden sm:flex h-10 items-center justify-center rounded bg-primary px-6 text-sm font-bold text-white transition-transform active:scale-95 cursor-pointer"
            >
              Join Now
            </button>
          ) : (
            <div className="relative">
              <div 
                className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 p-0.5 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img alt="Profile" className="h-full w-full rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" />
              </div>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-primary/20 bg-background-light dark:bg-background-dark p-2 shadow-lg shadow-black/10 dark:shadow-black/40"
                  >
                    <div className="flex flex-col gap-1">
                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/help" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                        <LifeBuoy className="w-4 h-4" /> Help Center
                      </Link>
                      <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
                      <button 
                        onClick={() => {
                          setIsAuthenticated(false);
                          setIsDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
