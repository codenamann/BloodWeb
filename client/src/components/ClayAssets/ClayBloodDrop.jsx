import React from 'react';
import { motion } from 'framer-motion';

export const ClayBloodDrop = ({ size = 120, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.3 }}
    >
      <svg
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_25px_rgba(180,30,20,0.45)]"
      >
        <defs>
          {/* Main 3D Clay Body Gradient */}
          <radialGradient
            id="clayBodyGrad"
            cx="40%"
            cy="35%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="25%" stopColor="#e83e30" />
            <stop offset="65%" stopColor="#c52417" />
            <stop offset="100%" stopColor="#87120a" />
          </radialGradient>

          {/* Top Specular Soft Highlight */}
          <linearGradient id="specularGrad" x1="30%" y1="15%" x2="50%" y2="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#ff9a8f" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Edge Rim Light */}
          <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#550500" stopOpacity="0.6" />
          </linearGradient>

          {/* Clay Inset Shadow Filter */}
          <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="2" dy="5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft Drop Shadow under the drop */}
        <ellipse
          cx="50"
          cy="124"
          rx="26"
          ry="6"
          fill="rgba(80, 20, 15, 0.35)"
          className="blur-[2px]"
        />

        {/* Teardrop Base Body */}
        <path
          d="M50 8 C50 8 18 64 18 88 C18 106 32.3 120 50 120 C67.7 120 82 106 82 88 C82 64 50 8 50 8 Z"
          fill="url(#clayBodyGrad)"
        />

        {/* Inner Clay Depth Shading */}
        <path
          d="M50 10 C50 10 20 65 20 88 C20 104.5 33.5 118 50 118 C66.5 118 80 104.5 80 88 C80 65 50 10 50 10 Z"
          fill="url(#rimLight)"
          mixBlendMode="overlay"
        />

        {/* Glossy Primary Highlight (Soft Inflated Clay Curve) */}
        <path
          d="M48 20 C48 20 30 60 30 82 C30 92 36 100 44 103 C41 98 38 90 38 82 C38 65 50 32 50 32 C50 32 48.5 24 48 20 Z"
          fill="url(#specularGrad)"
        />

        {/* Glossy Dot Specular */}
        <ellipse
          cx="38"
          cy="68"
          rx="6"
          ry="14"
          transform="rotate(-20 38 68)"
          fill="#ffffff"
          opacity="0.55"
        />
        <ellipse
          cx="36"
          cy="65"
          rx="3"
          ry="7"
          transform="rotate(-20 36 65)"
          fill="#ffffff"
          opacity="0.85"
        />

        {/* Subtle Bottom Ambient Bounce Light */}
        <path
          d="M34 114 C40 118 60 118 66 114 C60 116 40 116 34 114 Z"
          fill="#ffffff"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  );
};

export default ClayBloodDrop;
