import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Switch from '../ui/Switch';
import { toast } from '../ui/toast';
function AvailabilityCard({ availability, onToggle }) {
  return (
    <div className="clay-card p-5 bg-[#fdfbf9] flex flex-col gap-6 justify-between relative overflow-hidden group w-full">
      <div className="flex justify-between items-center relative z-10">
        {/* Blood Drop Pedestal (using clay-btn-cream shadow with custom background for that pinkish cream look) */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center clay-pedestal shrink-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
        >
          <span
            className={`w-4 h-4 rounded-full ${availability ? 'clay-sphere-emerald' : 'clay-sphere-stone'}`}
          />
        </div>

        <Switch
          checked={availability || false}
          onChange={async () => {
            try {
              if (onToggle) await onToggle();
              toast.success(
                availability ? 'Availability Paused' : 'Now Available',
                availability
                  ? 'You will no longer receive blood requests.'
                  : 'You are now visible to the matching engine!'
              );
            } catch (err) {
              if (err?.message !== 'Blood group is required before enabling availability.') {
                toast.error(
                  'Cannot Toggle Availability',
                  err?.response?.data?.message ||
                    'Please update your profile first.'
                );
              }
            }
          }}
        />
      </div>

      <div className=" relative z-10 pl-1">
        <div className="text-[9px] font-bold text-stone-500/80 uppercase tracking-[0.15em] mb-1.5">
          Donor Availability
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={availability ? 'available' : 'paused'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.05 } },
            }}
          >
            <motion.div
              variants={{
                initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
                animate: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                },
                exit: {
                  opacity: 0,
                  y: -4,
                  filter: 'blur(2px)',
                  transition: { duration: 0.2, ease: 'easeIn' },
                },
              }}
              className={`text-[18px] font-black ${
                availability ? 'text-emerald-700' : 'text-stone-600'
              } tracking-tight leading-tight mb-1 line-clamp-1`}
            >
              {availability ? 'Available' : 'Paused'}
            </motion.div>

            <motion.p
              variants={{
                initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
                animate: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                },
                exit: {
                  opacity: 0,
                  y: -4,
                  filter: 'blur(2px)',
                  transition: { duration: 0.2, ease: 'easeIn' },
                },
              }}
              className="text-[10px] text-stone-500/90 font-medium leading-snug"
            >
              {availability
                ? 'You can receive live blood requests.'
                : 'Toggle to become available for blood requests.'}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AvailabilityCard;
