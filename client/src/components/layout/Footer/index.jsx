import React from 'react';
import FooterBrand from './FooterBrand';
import FooterLinks from './FooterLinks';
import FooterBottomBar from './FooterBottomBar';

export const Footer = () => {
  return (
    <footer className="relative bg-[#eee7dd]/70 border-t border-stone-200/80 pt-12 sm:pt-16 pb-8 sm:pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Top Footer Grid: 2 Columns (Brand / Links) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <FooterBrand />
          </div>
          <div className="lg:col-span-7">
            <FooterLinks />
          </div>
        </div>

        {/* Bottom Bar */}
        <FooterBottomBar />
      </div>
    </footer>
  );
};

export default Footer;
