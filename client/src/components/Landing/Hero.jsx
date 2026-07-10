import React from 'react';
import { motion } from 'framer-motion';
import Metrics from './Metrics';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden hero-gradient px-6 py-20 text-center">
      {/* Background Pulse Line with subtle breathing animation */}
      <motion.div 
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="pulse-line"
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl space-y-8"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Live Network Status: Critical
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-7xl">
          Every Second Counts.<br />
          <span className="text-primary">Every Drop Matters.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
          A real-time lifeline powered by people. Request blood in seconds, or toggle your status to become an instant donor. No middlemen—just immediate, location-based matching when every second matters.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 min-w-[200px] items-center justify-center rounded-lg bg-primary px-8 text-lg font-bold text-white transition-colors hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            Request Blood Now
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 min-w-[200px] items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-lg font-bold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
          >
            Register to Donate
          </motion.button>
        </motion.div>
      </motion.div>

      <Metrics />
    </section>
  );
};

export default Hero;
