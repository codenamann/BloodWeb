import { motion } from 'motion/react';

export const NavLinks = ({ links, onNavClick, activeSection }) => (
  <nav className="hidden lg:flex items-center gap-7">
    {links.map((link) => {
      const isActive = link.href === `#${activeSection}`;
      return (
        <motion.a
          key={link.name}
          href={link.href}
          onClick={(e) => onNavClick(e, link.href)}
          className={`group relative text-[15px] font-semibold transition-colors duration-150 py-1.5 ${
            isActive
              ? 'text-[#d93829] font-bold'
              : 'text-[#575965] hover:text-[#1c1d22]'
          }`}
          animate={{
            scale: isActive ? 1.1 : 1,
            fontWeight: isActive ? 'bold' : 'normal',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {link.name}
          {isActive && (
            <motion.span
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
              layoutId="active-nav-indicator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d93829]"
            />
          )}
        </motion.a>
      );
    })}
  </nav>
);

export default NavLinks;
