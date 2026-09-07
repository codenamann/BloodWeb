import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui';

export const WorkflowStepCard = ({
  number,
  icon,
  title,
  description,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay }}
    className="h-full flex flex-col"
  >
    <Card className="p-6 sm:p-7 rounded-[26px] bg-white flex flex-col justify-between h-full group hover:-translate-y-1.5 transition-transform duration-200">
      <div>
        {/* Top Bar: Stacked Number & 3D Clay Icon */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col select-none">
            <span className="text-sm font-black text-[#d93829] font-mono leading-none tracking-wider">
              {number}
            </span>
            <span className="text-sm font-black text-[#d93829]/25 font-mono leading-none tracking-wider mt-0.5">
              {number}
            </span>
          </div>

          <div className="shrink-0">{icon}</div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-black text-[#1c1d22] mb-2 leading-snug group-hover:text-[#d93829] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#575965] font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  </motion.div>
);

export default WorkflowStepCard;
