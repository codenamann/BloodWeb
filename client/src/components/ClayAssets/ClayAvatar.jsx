import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const ClayAvatar = ({
  type = 'alex',
  size = 84,
  showBadge = false,
  badgeColor = 'crimson',
  name = '',
  bloodGroup = '',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Outer Clay Node Container */}
      <div
        className="clay-node flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Shading */}
            <radialGradient id={`skinGrad-${type}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffdfc9" />
              <stop offset="70%" stopColor="#f3be9b" />
              <stop offset="100%" stopColor="#d99f78" />
            </radialGradient>

            {/* Red Shirt Gradient */}
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e94334" />
              <stop offset="50%" stopColor="#cc2d1e" />
              <stop offset="100%" stopColor="#9c1b0f" />
            </linearGradient>

            {/* Hair Gradients */}
            <radialGradient id="hairGradBrown" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#6a452e" />
              <stop offset="75%" stopColor="#452715" />
              <stop offset="100%" stopColor="#2c1709" />
            </radialGradient>

            <radialGradient id="hairGradDark" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#3d3a42" />
              <stop offset="75%" stopColor="#25242a" />
              <stop offset="100%" stopColor="#151419" />
            </radialGradient>

            {/* Soft Shadow filter */}
            <filter id={`softInnerShadow-${type}`}>
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="1.5"
                floodColor="#8e5d3c"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Background clay fill inside circle */}
          <circle cx="50" cy="50" r="48" fill="#f8f4ee" />

          {/* Type 1: Alex (Male with brown quiff) */}
          {type === 'alex' && (
            <g id="alex-character">
              {/* Neck */}
              <path
                d="M44 65 L56 65 L56 75 L44 75 Z"
                fill="url(#skinGrad-alex)"
              />
              {/* Red Shirt */}
              <path
                d="M26 82 C26 73 34 68 50 68 C66 68 74 73 74 82 L74 100 L26 100 Z"
                fill="url(#shirtGrad)"
              />
              <path
                d="M44 68 C44 72 47 75 50 75 C53 75 56 72 56 68 Z"
                fill="#f3be9b"
              />
              {/* Ears */}
              <ellipse cx="32" cy="48" rx="4.5" ry="6" fill="#f3be9b" />
              <ellipse cx="68" cy="48" rx="4.5" ry="6" fill="#f3be9b" />
              {/* Head Base */}
              <rect
                x="34"
                y="32"
                width="32"
                height="34"
                rx="14"
                fill="url(#skinGrad-alex)"
              />
              {/* Hair Back */}
              <path
                d="M32 36 C32 20 40 16 50 16 C60 16 68 20 68 36 C68 36 67 27 50 27 C33 27 32 36 32 36 Z"
                fill="url(#hairGradBrown)"
              />
              {/* Clay Quiff Hair */}
              <path
                d="M31 34 C31 18 43 14 54 14 C67 14 69 24 67 34 C64 30 58 24 48 24 C38 24 33 29 31 34 Z"
                fill="url(#hairGradBrown)"
              />
              {/* Eyebrows */}
              <path
                d="M39 42 Q44 40 47 42"
                stroke="#452715"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M53 42 Q56 40 61 42"
                stroke="#452715"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Eyes */}
              <circle cx="43" cy="47" r="2.4" fill="#25242a" />
              <circle cx="57" cy="47" r="2.4" fill="#25242a" />
              <circle cx="42.2" cy="46" r="0.8" fill="#ffffff" />
              <circle cx="56.2" cy="46" r="0.8" fill="#ffffff" />
              {/* Nose */}
              <path
                d="M50 47 Q51.5 51 50 53"
                stroke="#d99f78"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Friendly Smile */}
              <path
                d="M45 56 Q50 61 55 56"
                stroke="#aa4238"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Rosy Cheeks */}
              <circle cx="39" cy="52" r="3" fill="#ff7f70" opacity="0.3" />
              <circle cx="61" cy="52" r="3" fill="#ff7f70" opacity="0.3" />
            </g>
          )}

          {/* Type 2: Sarah (Female with long dark hair) */}
          {type === 'sarah' && (
            <g id="sarah-character">
              {/* Long Hair Back */}
              <path
                d="M26 40 C24 60 25 80 32 88 C34 76 34 60 34 40 Z"
                fill="url(#hairGradDark)"
              />
              <path
                d="M74 40 C76 60 75 80 68 88 C66 76 66 60 66 40 Z"
                fill="url(#hairGradDark)"
              />
              {/* Neck */}
              <path
                d="M44 65 L56 65 L56 75 L44 75 Z"
                fill="url(#skinGrad-sarah)"
              />
              {/* Red Shirt */}
              <path
                d="M26 82 C26 73 34 68 50 68 C66 68 74 73 74 82 L74 100 L26 100 Z"
                fill="url(#shirtGrad)"
              />
              <path
                d="M44 68 C44 72 47 75 50 75 C53 75 56 72 56 68 Z"
                fill="#f3be9b"
              />
              {/* Ears */}
              <ellipse cx="32" cy="50" rx="4" ry="5.5" fill="#f3be9b" />
              <ellipse cx="68" cy="50" rx="4" ry="5.5" fill="#f3be9b" />
              {/* Head Base */}
              <rect
                x="34"
                y="34"
                width="32"
                height="32"
                rx="14"
                fill="url(#skinGrad-sarah)"
              />
              {/* Hair Top & Front Strands */}
              <path
                d="M28 42 C28 20 40 16 50 16 C60 16 72 20 72 42 C70 30 65 24 50 24 C35 24 30 30 28 42 Z"
                fill="url(#hairGradDark)"
              />
              <path
                d="M30 32 C34 26 44 26 48 34 C44 38 34 48 30 58 C28 48 29 38 30 32 Z"
                fill="url(#hairGradDark)"
              />
              <path
                d="M70 32 C66 26 56 26 52 34 C56 38 66 48 70 58 C72 48 71 38 70 32 Z"
                fill="url(#hairGradDark)"
              />
              {/* Eyebrows */}
              <path
                d="M38 43 Q43 41 46 43"
                stroke="#25242a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M54 43 Q57 41 62 43"
                stroke="#25242a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Eyes with Lashes */}
              <circle cx="42" cy="48" r="2.4" fill="#25242a" />
              <circle cx="58" cy="48" r="2.4" fill="#25242a" />
              <circle cx="41.2" cy="47" r="0.8" fill="#ffffff" />
              <circle cx="57.2" cy="47" r="0.8" fill="#ffffff" />
              {/* Soft Smile */}
              <path
                d="M45 56 Q50 61 55 56"
                stroke="#d43f33"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Rosy Cheeks */}
              <circle cx="38" cy="53" r="3.5" fill="#ff7f70" opacity="0.35" />
              <circle cx="62" cy="53" r="3.5" fill="#ff7f70" opacity="0.35" />
            </g>
          )}

          {/* Type 3: David (Male with Glasses) */}
          {type === 'david' && (
            <g id="david-character">
              {/* Neck */}
              <path
                d="M44 65 L56 65 L56 75 L44 75 Z"
                fill="url(#skinGrad-david)"
              />
              {/* Red Shirt */}
              <path
                d="M26 82 C26 73 34 68 50 68 C66 68 74 73 74 82 L74 100 L26 100 Z"
                fill="url(#shirtGrad)"
              />
              <path
                d="M44 68 C44 72 47 75 50 75 C53 75 56 72 56 68 Z"
                fill="#f3be9b"
              />
              {/* Ears */}
              <ellipse cx="32" cy="49" rx="4.5" ry="6" fill="#f3be9b" />
              <ellipse cx="68" cy="49" rx="4.5" ry="6" fill="#f3be9b" />
              {/* Head Base */}
              <rect
                x="34"
                y="32"
                width="32"
                height="34"
                rx="14"
                fill="url(#skinGrad-david)"
              />
              {/* Dark Short Hair */}
              <path
                d="M30 36 C30 18 42 15 50 15 C62 15 70 20 70 36 C68 28 60 22 50 22 C38 22 32 28 30 36 Z"
                fill="url(#hairGradDark)"
              />
              {/* Glasses */}
              <rect
                x="37"
                y="44"
                width="11"
                height="9"
                rx="3.5"
                fill="none"
                stroke="#1d1e23"
                strokeWidth="2"
              />
              <rect
                x="52"
                y="44"
                width="11"
                height="9"
                rx="3.5"
                fill="none"
                stroke="#1d1e23"
                strokeWidth="2"
              />
              <path d="M48 48 L52 48" stroke="#1d1e23" strokeWidth="2" />
              <path d="M33 47 L37 47" stroke="#1d1e23" strokeWidth="1.5" />
              <path d="M63 47 L67 47" stroke="#1d1e23" strokeWidth="1.5" />
              {/* Eyes behind glass */}
              <circle cx="42.5" cy="48.5" r="2" fill="#25242a" />
              <circle cx="57.5" cy="48.5" r="2" fill="#25242a" />
              {/* Nose */}
              <path
                d="M50 49 Q51.5 52 50 54"
                stroke="#d99f78"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Smile */}
              <path
                d="M45 58 Q50 62 55 58"
                stroke="#aa4238"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="38" cy="54" r="2.8" fill="#ff7f70" opacity="0.25" />
              <circle cx="62" cy="54" r="2.8" fill="#ff7f70" opacity="0.25" />
            </g>
          )}

          {/* Type 4: Elena (Female with dark styled hair) */}
          {type === 'elena' && (
            <g id="elena-character">
              {/* Hair Back */}
              <path
                d="M26 38 C24 55 26 70 34 76 C36 65 36 50 36 38 Z"
                fill="url(#hairGradDark)"
              />
              <path
                d="M74 38 C76 55 74 70 66 76 C64 65 64 50 64 38 Z"
                fill="url(#hairGradDark)"
              />
              {/* Neck */}
              <path
                d="M44 65 L56 65 L56 75 L44 75 Z"
                fill="url(#skinGrad-elena)"
              />
              {/* Red Shirt */}
              <path
                d="M26 82 C26 73 34 68 50 68 C66 68 74 73 74 82 L74 100 L26 100 Z"
                fill="url(#shirtGrad)"
              />
              <path
                d="M44 68 C44 72 47 75 50 75 C53 75 56 72 56 68 Z"
                fill="#f3be9b"
              />
              {/* Ears */}
              <ellipse cx="32" cy="50" rx="4" ry="5.5" fill="#f3be9b" />
              <ellipse cx="68" cy="50" rx="4" ry="5.5" fill="#f3be9b" />
              {/* Head Base */}
              <rect
                x="34"
                y="34"
                width="32"
                height="32"
                rx="14"
                fill="url(#skinGrad-elena)"
              />
              {/* Hair Front */}
              <path
                d="M28 36 C28 18 40 16 50 16 C60 16 72 18 72 36 C68 28 62 23 50 23 C38 23 32 28 28 36 Z"
                fill="url(#hairGradDark)"
              />
              {/* Eyebrows */}
              <path
                d="M38 42 Q43 40 46 42"
                stroke="#25242a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M54 42 Q57 40 62 42"
                stroke="#25242a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Eyes */}
              <circle cx="42" cy="47" r="2.3" fill="#25242a" />
              <circle cx="58" cy="47" r="2.3" fill="#25242a" />
              <circle cx="41.2" cy="46" r="0.8" fill="#ffffff" />
              <circle cx="57.2" cy="46" r="0.8" fill="#ffffff" />
              {/* Smile */}
              <path
                d="M45 56 Q50 61 55 56"
                stroke="#d43f33"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Rosy Cheeks */}
              <circle cx="38" cy="52" r="3.2" fill="#ff7f70" opacity="0.35" />
              <circle cx="62" cy="52" r="3.2" fill="#ff7f70" opacity="0.35" />
            </g>
          )}

          {/* Type 5: Neutral Profile */}
          {type === 'neutral' && (
            <g id="neutral-character">
              <linearGradient
                id="neutralGrad"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e8e2d7" />
                <stop offset="100%" stopColor="#c5baa7" />
              </linearGradient>
              {/* Shoulders / Body */}
              <path
                d="M22 88 C22 72 34 60 50 60 C66 60 78 72 78 88 L78 100 L22 100 Z"
                fill="url(#neutralGrad)"
              />
              {/* Head */}
              <circle cx="50" cy="40" r="18" fill="url(#neutralGrad)" />
            </g>
          )}
        </svg>
      </div>

      {/* Checkmark 3D Badge */}
      {showBadge && (
        <div
          className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full text-white shadow-md ${
            badgeColor === 'green' ? 'clay-check-green' : 'clay-check-badge'
          }`}
          style={{ width: size * 0.32, height: size * 0.32 }}
        >
          <Check strokeWidth={3.5} className="w-3/5 h-3/5" />
        </div>
      )}
    </div>
  );
};

export default ClayAvatar;
