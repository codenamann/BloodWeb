import { Droplets, CheckCircle2, Activity } from 'lucide-react';
import ClayBloodDrop from '../../ClayAssets/ClayBloodDrop';
import ClayPedestal from '../../ClayAssets/ClayPedestal';
import { Avatar, Badge } from '../../ui';
import HeroFloatingCard from './HeroFloatingCard';

export const HeroHubScene = () => {
  return (
    <div className="relative w-full flex justify-center">
      {/* Scaled Wrapper for mobile devices */}
      <div className="relative w-full max-w-[600px] aspect-600/520">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Top Left Line */}
          <div
            className="absolute left-45 top-43 h-[2px] bg-[#d93829] rounded-full origin-left"
            style={{
              width: '12%',
              transform: 'rotate(-140deg)',
            }}
          />

          {/* Top Right Line */}
          <div
            className="absolute right-8 top-30 h-[2px] bg-[#d93829] rounded-full origin-left"
            style={{
              width: '14%',
              transform: 'rotate(140deg)',
            }}
          />

          {/* Bottom Left Line */}
          <div
            className="absolute left-40 bottom-50 h-[2px] bg-[#d93829] rounded-full origin-left"
            style={{
              width: '10%',
              transform: 'rotate(140deg)',
            }}
          />

          {/* Bottom Right Line */}
          <div
            className="absolute right-12 bottom-39 h-[2px] bg-[#d93829] rounded-full origin-left"
            style={{
              width: '11%',
              transform: 'rotate(-145deg)',
            }}
          />
        </div>

        {/* Center Pedestal & Glossy Blood Drop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <ClayPedestal>
            <ClayBloodDrop size={105} />
          </ClayPedestal>
        </div>

        {/* 4 DONOR CLAY NODES */}
        <div className="absolute z-20" style={{ left: '2%', top: '6%' }}>
          <Avatar
            clayType="alex"
            size={100}
            showBadge={true}
            badgeColor="crimson"
          />
        </div>

        <div className="absolute z-20" style={{ right: '2%', top: '6%' }}>
          <Avatar
            clayType="sarah"
            size={100}
            showBadge={true}
            badgeColor="crimson"
          />
        </div>

        <div className="absolute z-20" style={{ right: '2%', bottom: '15%' }}>
          <Avatar
            clayType="david"
            size={100}
            showBadge={true}
            badgeColor="crimson"
          />
        </div>

        <div className="absolute z-20" style={{ left: '2%', bottom: '15%' }}>
          <Avatar
            clayType="elena"
            size={100}
            showBadge={true}
            badgeColor="crimson"
          />
        </div>

        {/* 3 FLOATING CLAY NOTIFICATION CARDS */}
        {/* Card 1: Urgent Request */}
        <div className="absolute z-30" style={{ right: '20%', top: '0%' }}>
          <HeroFloatingCard
            icon={<Droplets className="w-5 h-5 fill-[#d93829]" />}
            iconBg="bg-red-50 text-[#d93829]"
            category="Urgent Request"
            categoryColor="text-[#d93829]"
            title="O- Blood Group"
            subtitle="City General Hospital"
            animation="slow"
            footer={
              <Badge variant="crimson" className="px-2 py-0.2 text-[9px]">
                2km away
              </Badge>
            }
          />
        </div>

        {/* Card 2: Match Found */}
        <div className="absolute z-30" style={{ left: '15%', bottom: '-5%' }}>
          <HeroFloatingCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            iconBg="bg-emerald-50 text-emerald-600"
            category="Match Found"
            categoryColor="text-emerald-600"
            title="A Donor is On the Way"
            subtitle="Verified volunteer donor"
            animation="reverse"
            footer={
              <Badge variant="emerald" className="px-2 py-0.2 text-[9px]">
                8 min
              </Badge>
            }
          />
        </div>

        {/* Card 3: Lives Connected */}
        <div className="absolute z-30" style={{ right: '10%', bottom: '-5%' }}>
          <HeroFloatingCard
            icon={<Activity className="w-5 h-5 text-[#d93829]" />}
            iconBg="bg-red-50 text-[#d93829]"
            category="Lives Connected"
            categoryColor="text-[#d93829]"
            title="Together, we're Stronger."
            subtitle="Active Volunteer Network"
            animation="slow"
            footer={
              <>
                <div className="flex -space-x-1 overflow-hidden">
                  <div className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white overflow-hidden">
                    <Avatar clayType="alex" size={14} />
                  </div>
                  <div className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white overflow-hidden">
                    <Avatar clayType="sarah" size={14} />
                  </div>
                  <div className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white overflow-hidden">
                    <Avatar clayType="david" size={14} />
                  </div>
                </div>
                <Badge
                  variant="pill"
                  className="px-1.5 py-0.2 text-[8px] font-bold"
                >
                  +120
                </Badge>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HeroHubScene;
