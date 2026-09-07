import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Heart } from 'lucide-react';
import { Button } from '../../ui';

export const HeroActions = ({ onRequestBlood, onDonate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: 0.3 }}
    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
  >
    <Button
      variant="crimson"
      size="lg"
      onClick={onRequestBlood}
      className="group w-full sm:w-auto"
    >
      <Droplets className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform mr-2" />
      <span>Request Blood</span>
    </Button>

    <Button
      variant="cream"
      size="lg"
      onClick={onDonate}
      className="group w-full sm:w-auto"
    >
      <Heart className="w-4 h-4 text-[#d93829] fill-[#d93829] group-hover:scale-110 transition-transform mr-2" />
      <span>I Want to Donate</span>
    </Button>
  </motion.div>
);

export default HeroActions;
