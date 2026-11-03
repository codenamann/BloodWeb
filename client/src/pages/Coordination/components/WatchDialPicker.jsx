import React, { useRef, useState, useEffect } from 'react';

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 200;
const PADDING_Y = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2; // 78px

export const WatchDialPicker = ({ options, selectedIndex, onChange }) => {
  const containerRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(selectedIndex * ITEM_HEIGHT);
  const dragRef = useRef({ isDown: false, startY: 0, startScrollTop: 0 });

  // Initialize and center on mount or when selectedIndex changes while closed
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const target = selectedIndex * ITEM_HEIGHT;
    el.scrollTop = target;
    setScrollPos(target);
  }, []);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const current = el.scrollTop;
    setScrollPos(current);

    const idx = Math.round(current / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(options.length - 1, idx));
    if (clamped !== selectedIndex) {
      onChange(clamped);
    }
  };

  const handleItemClick = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
    onChange(idx);
  };

  // Drag interaction
  const handleMouseDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    dragRef.current = {
      isDown: true,
      startY: e.clientY,
      startScrollTop: el.scrollTop,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDown || !containerRef.current) return;
    e.preventDefault();
    const deltaY = e.clientY - dragRef.current.startY;
    containerRef.current.scrollTop = dragRef.current.startScrollTop - deltaY;
  };

  const handleMouseUp = () => {
    if (!dragRef.current.isDown || !containerRef.current) return;
    dragRef.current.isDown = false;
    const el = containerRef.current;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(options.length - 1, idx));
    el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
    onChange(clamped);
  };

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ perspective: '900px' }}
    >
      {/* Center Selection Pill (matches watch reference) */}
      <div
        style={{ height: `${ITEM_HEIGHT}px` }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 bg-stone-100/90 rounded-2xl pointer-events-none shadow-2xs z-0"
      />

      {/* Top and Bottom Fading Vignettes */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/85 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none z-20" />

      {/* Continuous 3D Cylinder Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        style={{
          height: `${CONTAINER_HEIGHT}px`,
          paddingTop: `${PADDING_Y}px`,
          paddingBottom: `${PADDING_Y}px`,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full overflow-y-auto snap-y snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth no-scrollbar z-10"
      >
        {options.map((val, idx) => {
          // Continuous distance from center line (in unit slots)
          const offset = (idx * ITEM_HEIGHT - scrollPos) / ITEM_HEIGHT;
          const absOffset = Math.abs(offset);

          // Continuous cylinder math
          const scale = Math.max(0.68, 1 - absOffset * 0.16);
          const opacity = Math.max(0, 1 - Math.pow(absOffset / 2.2, 1.8));
          const rotateX = -offset * 26; // degrees rotation around cylinder
          const isCenter = absOffset < 0.45;

          return (
            <div
              key={val}
              onClick={() => handleItemClick(idx)}
              style={{
                height: `${ITEM_HEIGHT}px`,
                transform: `rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                transformOrigin: 'center center',
              }}
              className="snap-center flex items-center justify-center cursor-pointer transition-[color,font-weight] duration-150"
            >
              <span
                className={`tracking-tight ${
                  isCenter
                    ? 'text-2xl font-black text-stone-900'
                    : 'text-xl font-bold text-stone-400'
                }`}
              >
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchDialPicker;
