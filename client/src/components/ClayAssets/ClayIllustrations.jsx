import React from 'react';
import { motion } from 'framer-motion';

// =========================================================================
// 1. 3D CLAY HANDS HOLDING RED HEART WITH CROSS
// =========================================================================
export const ClayHandsHeart = ({ size = 160, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
        rotate: [0, 0.5, -0.5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_16px_24px_rgba(180,40,30,0.28)]"
      >
        <defs>
          {/* Heart 3D Radial Gradient */}
          <radialGradient id="clayHeartGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff6b5c" />
            <stop offset="30%" stopColor="#ea3e2f" />
            <stop offset="70%" stopColor="#c52417" />
            <stop offset="100%" stopColor="#87120a" />
          </radialGradient>

          {/* Hands Warm Clay Gradient */}
          <radialGradient id="clayHandGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffd8c9" />
            <stop offset="45%" stopColor="#f7bca7" />
            <stop offset="85%" stopColor="#dba18b" />
            <stop offset="100%" stopColor="#b87d68" />
          </radialGradient>

          {/* White Cross Radial Gradient */}
          <radialGradient id="crossGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f3eae0" />
            <stop offset="100%" stopColor="#ded1c1" />
          </radialGradient>

          {/* Heart Specular Gradient */}
          <linearGradient id="heartSpecular" x1="20%" y1="10%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#ff9a8f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="6" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.25" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft Ambient Ground Shadow */}
        <ellipse cx="100" cy="156" rx="65" ry="10" fill="rgba(80, 50, 40, 0.18)" className="blur-[3px]" />

        {/* Left Palm / Wrist */}
        <path
          d="M32 145 C28 120 40 100 62 88 C72 82 85 86 92 98 C98 108 94 122 84 136 C72 152 48 155 32 145 Z"
          fill="url(#clayHandGrad)"
          filter="url(#handShadow)"
        />

        {/* Right Palm / Wrist */}
        <path
          d="M168 145 C172 120 160 100 138 88 C128 82 115 86 108 98 C102 108 106 122 116 136 C128 152 152 155 168 145 Z"
          fill="url(#clayHandGrad)"
          filter="url(#handShadow)"
        />

        {/* Left Hand Fingers cupping heart */}
        <g filter="url(#handShadow)">
          <path d="M52 92 C45 78 55 64 68 68 C76 70 82 80 80 92 Z" fill="url(#clayHandGrad)" />
          <path d="M66 82 C60 66 72 54 84 58 C92 62 96 74 92 86 Z" fill="url(#clayHandGrad)" />
          <path d="M80 78 C76 62 90 52 100 58 C106 63 108 74 102 85 Z" fill="url(#clayHandGrad)" />
        </g>

        {/* Right Hand Fingers cupping heart */}
        <g filter="url(#handShadow)">
          <path d="M148 92 C155 78 145 64 132 68 C124 70 118 80 120 92 Z" fill="url(#clayHandGrad)" />
          <path d="M134 82 C140 66 128 54 116 58 C108 62 104 74 108 86 Z" fill="url(#clayHandGrad)" />
          <path d="M120 78 C124 62 110 52 100 58 C94 63 92 74 98 85 Z" fill="url(#clayHandGrad)" />
        </g>

        {/* Main 3D Heart */}
        <path
          d="M100 42 C82 12 40 22 40 56 C40 86 78 114 100 128 C122 114 160 86 160 56 C160 22 118 12 100 42 Z"
          fill="url(#clayHeartGrad)"
        />

        {/* Heart Specular Highlight */}
        <path
          d="M100 46 C84 20 52 28 52 56 C52 76 74 96 90 110 C86 98 70 78 70 60 C70 42 86 36 100 46 Z"
          fill="url(#heartSpecular)"
        />

        {/* 3D Medical Cross in Heart */}
        <g>
          {/* Cross Shadow */}
          <rect x="91" y="55" width="18" height="42" rx="5" fill="rgba(80, 10, 5, 0.4)" />
          <rect x="79" y="67" width="42" height="18" rx="5" fill="rgba(80, 10, 5, 0.4)" />
          
          {/* Vertical Bar */}
          <rect x="91" y="53" width="18" height="42" rx="5" fill="url(#crossGrad)" />
          {/* Horizontal Bar */}
          <rect x="79" y="65" width="42" height="18" rx="5" fill="url(#crossGrad)" />

          {/* Cross Inner Highlights */}
          <rect x="93" y="55" width="14" height="6" rx="3" fill="#ffffff" opacity="0.8" />
          <rect x="81" y="67" width="6" height="14" rx="3" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Floating Mini Hearts */}
        <g opacity="0.9">
          <path
            d="M32 30 C26 18 10 24 10 36 C10 48 24 58 32 64 C40 58 54 48 54 36 C54 24 38 18 32 30 Z"
            fill="url(#clayHeartGrad)"
            transform="scale(0.35) translate(30, 20)"
          />
          <path
            d="M168 24 C162 14 148 18 148 28 C148 38 160 46 168 52 C176 46 188 38 188 28 C188 18 174 14 168 24 Z"
            fill="url(#clayHeartGrad)"
            transform="scale(0.3) translate(360, 40)"
          />
        </g>
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 2. 3D CLAY MAIL ENVELOPE WITH FLOATING HEART
// =========================================================================
export const ClayMailEnvelope = ({ size = 150, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -7, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg
        viewBox="0 0 180 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_16px_22px_rgba(90,60,45,0.18)]"
      >
        <defs>
          <radialGradient id="envBody" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f5efe6" />
            <stop offset="100%" stopColor="#decbb9" />
          </radialGradient>
          <radialGradient id="envFlap" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fcf8f2" />
            <stop offset="65%" stopColor="#ebdccf" />
            <stop offset="100%" stopColor="#d6c0af" />
          </radialGradient>
          <radialGradient id="heartRed" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="40%" stopColor="#e83e30" />
            <stop offset="85%" stopColor="#bd2013" />
            <stop offset="100%" stopColor="#7a0f07" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="90" cy="138" rx="60" ry="8" fill="rgba(80, 50, 40, 0.16)" className="blur-[3px]" />

        {/* Envelope Back Body */}
        <rect x="25" y="45" width="130" height="85" rx="16" fill="url(#envBody)" />

        {/* Inside Pocket Shading */}
        <path d="M30 50 L90 92 L150 50 L150 120 L30 120 Z" fill="#e8dacb" />

        {/* Floating 3D Heart popping out */}
        <g transform="translate(62, 10)">
          <path
            d="M28 12 C18 0 0 6 0 24 C0 42 22 58 28 66 C34 58 56 42 56 24 C56 6 38 0 28 12 Z"
            fill="url(#heartRed)"
            className="drop-shadow-[0_8px_12px_rgba(180,30,20,0.35)]"
          />
          {/* Specular */}
          <path
            d="M28 14 C20 4 6 8 6 22 C6 30 14 40 22 48 C20 40 12 30 12 20 C12 12 20 8 28 14 Z"
            fill="#ffffff"
            opacity="0.6"
          />
        </g>

        {/* Envelope Front Flaps */}
        <path
          d="M25 130 L90 82 L155 130 Z"
          fill="url(#envFlap)"
          className="drop-shadow-[0_-3px_5px_rgba(80,50,40,0.08)]"
        />
        <path d="M25 50 L90 95 L25 130 Z" fill="#ecdccd" opacity="0.9" />
        <path d="M155 50 L90 95 L155 130 Z" fill="#e3cfbf" opacity="0.9" />

        {/* Front Top Fold Border */}
        <path
          d="M25 45 L90 94 L155 45"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Mini Floating Sparks */}
        <circle cx="28" cy="28" r="4" fill="#ff6b5c" />
        <circle cx="152" cy="36" r="3.5" fill="#ea3e2f" />
        <circle cx="140" cy="18" r="5" fill="#f87171" opacity="0.8" />
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 3. 3D CLAY DESK CALENDAR
// =========================================================================
export const ClayCalendar = ({ size = 110, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.05 }}
    >
      <svg
        viewBox="0 0 120 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_18px_rgba(90,60,45,0.15)]"
      >
        <defs>
          <radialGradient id="calTop" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="50%" stopColor="#e83e30" />
            <stop offset="100%" stopColor="#9b190e" />
          </radialGradient>
          <radialGradient id="calBody" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#faf3ea" />
            <stop offset="100%" stopColor="#dfd0be" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="60" cy="118" rx="42" ry="6" fill="rgba(80, 50, 40, 0.16)" className="blur-[2.5px]" />

        {/* Main Body */}
        <rect x="18" y="24" width="84" height="90" rx="18" fill="url(#calBody)" />

        {/* Red Header Bar */}
        <path d="M18 42 C18 32 26 24 36 24 L84 24 C94 24 102 32 102 42 L102 48 L18 48 Z" fill="url(#calTop)" />

        {/* Binder Rings */}
        <rect x="34" y="16" width="8" height="16" rx="4" fill="#ffffff" />
        <rect x="78" y="16" width="8" height="16" rx="4" fill="#ffffff" />

        {/* Cute Face / Date Bars */}
        <circle cx="46" cy="74" r="3.5" fill="#1c1d22" />
        <circle cx="74" cy="74" r="3.5" fill="#1c1d22" />
        <path d="M54 82 C56 86 64 86 66 82" stroke="#1c1d22" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Blush Cheeks */}
        <ellipse cx="40" cy="80" rx="4" ry="2.5" fill="#ff8d80" opacity="0.6" />
        <ellipse cx="80" cy="80" rx="4" ry="2.5" fill="#ff8d80" opacity="0.6" />

        {/* Bottom subtle edge */}
        <path d="M22 108 C34 112 86 112 98 108" stroke="rgba(160,140,120,0.3)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 4. 3D CLAY MAP PIN ON ISOMETRIC MAP
// =========================================================================
export const ClayMapPin = ({ size = 130, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.1 }}
    >
      <svg
        viewBox="0 0 140 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_14px_20px_rgba(90,60,45,0.18)]"
      >
        <defs>
          <radialGradient id="pinRed" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="40%" stopColor="#e83e30" />
            <stop offset="85%" stopColor="#bd2013" />
            <stop offset="100%" stopColor="#7a0f07" />
          </radialGradient>
          <radialGradient id="mapTile" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#faf6ef" />
            <stop offset="70%" stopColor="#ebe1d1" />
            <stop offset="100%" stopColor="#d5c4af" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="70" cy="140" rx="55" ry="8" fill="rgba(80, 50, 40, 0.16)" className="blur-[3px]" />

        {/* Folded 3D Map Base */}
        <g>
          {/* Left Panel */}
          <polygon points="15,115 50,130 50,95 15,80" fill="url(#mapTile)" />
          {/* Center Panel */}
          <polygon points="50,130 90,118 90,83 50,95" fill="#f4ede3" />
          {/* Right Panel */}
          <polygon points="90,118 125,130 125,95 90,83" fill="#e6d8c5" />

          {/* Map Grid Roads */}
          <path d="M22 96 Q50 115 90 98 T120 110" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M40 88 L60 125" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Standing 3D Red Pin */}
        <g transform="translate(42, 10)">
          {/* Pin Shadow on map */}
          <ellipse cx="28" cy="84" rx="14" ry="4" fill="rgba(80, 20, 15, 0.3)" />

          {/* Pin Body */}
          <path
            d="M28 80 C28 80 8 46 8 28 C8 12.5 17 0 28 0 C39 0 48 12.5 48 28 C48 46 28 80 28 80 Z"
            fill="url(#pinRed)"
            className="drop-shadow-[0_8px_14px_rgba(180,30,20,0.4)]"
          />

          {/* White Medical Cross Inside Pin */}
          <rect x="25" y="16" width="6" height="20" rx="2" fill="#ffffff" />
          <rect x="18" y="23" width="20" height="6" rx="2" fill="#ffffff" />

          {/* Specular Highlight on Pin Head */}
          <ellipse cx="20" cy="16" rx="4" ry="7" transform="rotate(-30 20 16)" fill="#ffffff" opacity="0.6" />
        </g>
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 5. 3D CLAY DROP CHARACTER WITH SIGN
// =========================================================================
export const ClayDropCharacter = ({ size = 130, signText = "Real People Real Impact", className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 150 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_16px_22px_rgba(180,30,20,0.3)]"
      >
        <defs>
          <radialGradient id="charDropGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="35%" stopColor="#e83e30" />
            <stop offset="75%" stopColor="#c52417" />
            <stop offset="100%" stopColor="#87120a" />
          </radialGradient>
          <radialGradient id="signGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f7efe4" />
            <stop offset="100%" stopColor="#dfd1c0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="75" cy="158" rx="55" ry="7" fill="rgba(80, 30, 20, 0.2)" className="blur-[2.5px]" />

        {/* Cute Feet */}
        <ellipse cx="48" cy="150" rx="10" ry="6" fill="#c52417" />
        <ellipse cx="78" cy="150" rx="10" ry="6" fill="#c52417" />

        {/* Main Blood Drop Body */}
        <path
          d="M60 25 C60 25 24 75 24 105 C24 128 40 146 62 146 C84 146 100 128 100 105 C100 75 60 25 60 25 Z"
          fill="url(#charDropGrad)"
        />

        {/* Soft Specular Highlight */}
        <path
          d="M58 35 C58 35 34 75 34 100 C34 112 40 120 48 124 C44 118 42 108 42 98 C42 80 58 48 58 35 Z"
          fill="#ffffff"
          opacity="0.55"
        />

        {/* Friendly Face */}
        <circle cx="50" cy="100" r="3" fill="#1c1d22" />
        <circle cx="72" cy="100" r="3" fill="#1c1d22" />
        <path d="M58 108 C60 112 66 112 68 108" stroke="#1c1d22" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="105" rx="3.5" ry="2" fill="#ff8d80" opacity="0.7" />
        <ellipse cx="78" cy="105" rx="3.5" ry="2" fill="#ff8d80" opacity="0.7" />

        {/* Little Arms */}
        <path d="M28 108 C20 112 16 120 22 126" stroke="#c52417" strokeWidth="6" strokeLinecap="round" />
        
        {/* Right Arm holding Sign Stick */}
        <path d="M96 110 L115 95" stroke="#c52417" strokeWidth="6" strokeLinecap="round" />

        {/* Sign Pole */}
        <rect x="114" y="60" width="4" height="85" rx="2" fill="#b09278" />

        {/* Sign Board */}
        <g transform="translate(90, 30)">
          <rect x="0" y="0" width="56" height="42" rx="8" fill="url(#signGrad)" className="drop-shadow-md" />
          <text x="28" y="15" textAnchor="middle" fill="#d93829" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
            Real
          </text>
          <text x="28" y="24" textAnchor="middle" fill="#1c1d22" fontSize="6.5" fontWeight="800" fontFamily="sans-serif">
            People
          </text>
          <text x="28" y="33" textAnchor="middle" fill="#1c1d22" fontSize="6" fontWeight="700" fontFamily="sans-serif">
            Real Impact
          </text>
        </g>
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 6. 3D CLAY CHARACTER BOY (CARING DONOR)
// =========================================================================
export const ClayCharacterBoy = ({ size = 150, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.1 }}
    >
      <svg
        viewBox="0 0 160 175"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_16px_24px_rgba(90,60,45,0.2)]"
      >
        <defs>
          <radialGradient id="boySkin" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffd8c9" />
            <stop offset="55%" stopColor="#f7bca7" />
            <stop offset="100%" stopColor="#dba18b" />
          </radialGradient>
          <radialGradient id="boyHair" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4a3b32" />
            <stop offset="70%" stopColor="#2c221c" />
            <stop offset="100%" stopColor="#150f0c" />
          </radialGradient>
          <radialGradient id="boyShirt" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="45%" stopColor="#e83e30" />
            <stop offset="100%" stopColor="#9b190e" />
          </radialGradient>
          <radialGradient id="dropRed" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ff6554" />
            <stop offset="40%" stopColor="#e83e30" />
            <stop offset="100%" stopColor="#87120a" />
          </radialGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="80" cy="165" rx="55" ry="7" fill="rgba(80, 50, 40, 0.18)" className="blur-[2.5px]" />

        {/* Torso / Shirt */}
        <path d="M45 125 C45 105 115 105 115 125 L120 165 L40 165 Z" fill="url(#boyShirt)" />

        {/* Neck */}
        <rect x="70" y="85" width="20" height="20" rx="8" fill="url(#boySkin)" />

        {/* Head */}
        <circle cx="80" cy="62" r="30" fill="url(#boySkin)" />

        {/* Fluffy Clay Hair */}
        <path
          d="M50 56 C46 32 65 20 80 20 C95 20 114 32 110 56 C110 40 98 32 80 32 C62 32 50 40 50 56 Z"
          fill="url(#boyHair)"
        />
        <circle cx="56" cy="38" r="12" fill="url(#boyHair)" />
        <circle cx="78" cy="28" r="14" fill="url(#boyHair)" />
        <circle cx="98" cy="34" r="12" fill="url(#boyHair)" />

        {/* Ears */}
        <circle cx="48" cy="65" r="7" fill="url(#boySkin)" />
        <circle cx="112" cy="65" r="7" fill="url(#boySkin)" />

        {/* Eyes & Smile */}
        <circle cx="68" cy="62" r="3.5" fill="#1c1d22" />
        <circle cx="92" cy="62" r="3.5" fill="#1c1d22" />
        <path d="M74 72 C76 76 84 76 86 72" stroke="#1c1d22" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Blush */}
        <ellipse cx="62" cy="68" rx="4" ry="2.5" fill="#ff8d80" opacity="0.6" />
        <ellipse cx="98" cy="68" rx="4" ry="2.5" fill="#ff8d80" opacity="0.6" />

        {/* Arms holding Giant Blood Drop */}
        <path d="M42 125 C30 135 45 155 60 148" stroke="#f7bca7" strokeWidth="12" strokeLinecap="round" />
        <path d="M118 125 C130 135 115 155 100 148" stroke="#f7bca7" strokeWidth="12" strokeLinecap="round" />

        {/* Held 3D Blood Drop */}
        <g transform="translate(100, 75)">
          <path
            d="M20 5 C20 5 0 25 0 40 C0 52 10 62 20 62 C30 62 40 52 40 40 C40 25 20 5 20 5 Z"
            fill="url(#dropRed)"
            className="drop-shadow-[0_8px_12px_rgba(180,30,20,0.4)]"
          />
          <ellipse cx="14" cy="36" rx="3" ry="7" transform="rotate(-20 14 36)" fill="#ffffff" opacity="0.7" />
        </g>
      </svg>
    </motion.div>
  );
};

// =========================================================================
// 7. AMBIENT FLOATING CLAY SPHERES
// =========================================================================
export const ClayFloatingSpheres = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 -left-3 w-8 h-8 rounded-full clay-sphere-crimson opacity-70 shadow-lg"
      />
      <motion.div
        animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 -right-2 w-6 h-6 rounded-full clay-sphere-crimson opacity-60 shadow-md"
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-12 w-5 h-5 rounded-full clay-sphere opacity-50 shadow-sm"
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 6, 0] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-1/4 right-8 w-7 h-7 rounded-full clay-sphere-crimson opacity-65 shadow-md"
      />
    </div>
  );
};

export default {
  ClayHandsHeart,
  ClayMailEnvelope,
  ClayCalendar,
  ClayMapPin,
  ClayDropCharacter,
  ClayCharacterBoy,
  ClayFloatingSpheres,
};
