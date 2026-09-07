import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui';

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="h-full flex flex-col"
    >
      <Card className="p-6 sm:p-7 rounded-[26px] bg-white flex flex-col justify-start h-full group hover:-translate-y-1.5 transition-transform duration-200">
        {/* Icon Container with soft red clay tint */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#ffdcd7] via-[#fbeae8] to-[#f5d5d0] border border-red-200/50 flex items-center justify-center text-[#d93829] mb-5 shadow-xs group-hover:scale-105 transition-transform">
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#d93829] stroke-[2.2]" />}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-black text-[#1c1d22] mb-2 leading-snug group-hover:text-[#d93829] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#575965] font-medium leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
