import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';

export const MobileDrawer = ({
  links,
  onNavClick,
  onLogin,
  onGetStarted,
}) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="lg:hidden bg-[#faf7f2] border-b border-stone-200/80 px-4 sm:px-6 py-5 space-y-4 shadow-2xl overflow-hidden"
  >
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => onNavClick(e, link.href)}
          className="text-sm font-bold text-[#1c1d22] py-2.5 px-3 rounded-xl hover:bg-white flex items-center justify-between transition-colors"
        >
          <span>{link.name}</span>
          {link.name === 'Home' && <span className="w-2 h-2 rounded-full bg-[#d93829]" />}
        </a>
      ))}
    </nav>

    <div className="pt-3 border-t border-stone-200/60 flex flex-col gap-2.5">
      <Button
        variant="cream"
        onClick={onLogin}
        className="w-full py-3 text-xs sm:text-sm font-bold"
      >
        Log in
      </Button>
      <Button
        variant="crimson"
        onClick={onGetStarted}
        className="w-full py-3 text-xs sm:text-sm font-bold shadow-md"
      >
        Get Started
      </Button>
    </div>
  </motion.div>
);

export default MobileDrawer;
