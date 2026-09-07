import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Badge } from '../../ui';

export const HeroBadge = ({ text = 'Real-time • Reliable • Human' }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Badge variant="inset" className="inline-flex items-center gap-2">
      <Heart className="w-3 h-3 text-[#d93829] fill-[#d93829]" />
      <span className="text-[11px] sm:text-xs font-extrabold tracking-wide">
        {text}
      </span>
    </Badge>
  </motion.div>
);

export default HeroBadge;
