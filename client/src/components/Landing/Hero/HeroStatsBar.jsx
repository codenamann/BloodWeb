import React from 'react';
import { motion } from 'framer-motion';
import { Users, Droplets, MapPin, Clock } from 'lucide-react';
import { Card } from '../../ui';

const StatItem = ({ icon: Icon, value, label, isFirst = false }) => (
  <div
    className={`flex items-center gap-2.5 pr-2 ${!isFirst ? 'sm:pl-3 pt-2 sm:pt-0' : ''}`}
  >
    <div className="w-8 h-8 rounded-full bg-red-100/80 flex items-center justify-center shrink-0 text-[#d93829]">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-base sm:text-lg font-black text-[#1c1d22] leading-tight">
        {value}
      </div>
      <div className="text-[10px] sm:text-[11px] font-semibold text-[#747682]">
        {label}
      </div>
    </div>
  </div>
);

export const HeroStatsBar = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Active Donors' },
    { icon: Droplets, value: '12K+', label: 'Lives Helped' },
    { icon: MapPin, value: '250+', label: 'Cities Covered' },
    { icon: Clock, value: '24/7', label: 'Always Here' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card
        variant="flat"
        className="p-3.5 sm:p-4.5 mt-4 sm:mt-6 bg-gradient-to-r from-[#ffffff] to-[#faf6f0]"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/60">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              isFirst={i === 0}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default HeroStatsBar;
