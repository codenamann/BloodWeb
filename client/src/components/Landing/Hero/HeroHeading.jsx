import React from 'react';
import { motion } from 'framer-motion';

export const HeroHeading = () => (
  <div className="space-y-3 sm:space-y-4">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-black text-[#1c1d22] leading-[1.08] tracking-tight"
    >
      When blood<br />
      is needed,<br />
      <span className="text-[#d93829]">connection</span><br />
      <span className="text-[#d93829]">matters.</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="text-xs sm:text-base text-[#575965] font-medium leading-relaxed max-w-md"
    >
      BloodWeb connects people in need with verified donors in real time. Because every second can save a life.
    </motion.p>
  </div>
);

export default HeroHeading;
