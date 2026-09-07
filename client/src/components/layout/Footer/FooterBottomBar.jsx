import React from 'react';

export const FooterBottomBar = () => (
  <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#747682] font-semibold border-t border-stone-200/80">
    <div className="text-center sm:text-left">
      © {new Date().getFullYear()} BloodWeb. Built to make a difference.
    </div>

    <div className="flex items-center gap-4 text-[11px]">
      <a
        href="https://github.com/codenamann/BloodWeb"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#d93829] transition-colors"
      >
        Source Code
      </a>
      <span>&bull;</span>
      <a href="#about" className="hover:text-[#d93829] transition-colors">
        About Project
      </a>
    </div>
  </div>
);

export default FooterBottomBar;
