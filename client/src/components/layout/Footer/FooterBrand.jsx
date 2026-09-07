import React from 'react';
import ClayLogo from '../../ClayAssets/ClayLogo';

export const FooterBrand = () => (
  <div className="space-y-3">
    <ClayLogo size="lg" />
    
    <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed max-w-xs">
      Real-time blood donation coordination.
      <br />
      Built for people who care.
    </p>
  </div>
);

export default FooterBrand;
