import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ClayLogo from '../../ClayAssets/ClayLogo';
import { Button } from '../../ui';
import { useAuth } from '../../../context/AuthContext';
import NavLinks from './NavLinks';
import MobileDrawer from './MobileDrawer';

export const Navbar = ({ onRequestBlood, onDonate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSession, setActiveSession] = useState('hero');
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const isLoggedIn = !!currentUser || isAuthenticated;

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why BloodWeb', href: '#why-bloodweb' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          const currentSection = visibleSections[0].target;
          const sectionId = currentSection.id;

          setActiveSession(sectionId);
        }
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // if (href === '#hero' || href === '/') {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    //   return;
    // }

    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 select-none w-full bg-[#f6f1eb]/95 backdrop-blur-md border-b border-slate-300/40 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Logo */}
          <ClayLogo size="lg" />

          {/* Desktop Navigation Links */}
          <NavLinks
            links={navLinks}
            onNavClick={handleNavClick}
            activeSection={activeSession}
          />

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="crimson"
                size="default"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 rounded-2xl! shadow-md"
              >
                <span>Go to app</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="cream"
                  size="default"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="crimson"
                  size="default"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            {isLoggedIn ? (
              <Button
                variant="crimson"
                size="default"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 shadow-md py-2! pr-3"
              >
                <span>Go to app</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                variant="crimson"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl clay-btn-cream text-slate-700 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileDrawer
            links={navLinks}
            isLoggedIn={isLoggedIn}
            onNavClick={handleNavClick}
            onGoToApp={() => {
              setMobileMenuOpen(false);
              navigate('/dashboard');
            }}
            onLogin={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
            onGetStarted={() => {
              setMobileMenuOpen(false);
              navigate('/register');
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
