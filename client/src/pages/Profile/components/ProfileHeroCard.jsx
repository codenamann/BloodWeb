import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Droplet,
  Calendar,
  Phone,
  Mail,
  Edit2,
} from 'lucide-react';
import { differenceInYears } from 'date-fns';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';
import ClayStatStrip from '../../../components/ui/ClayStatStrip';
import ClayStatItem from '../../../components/ui/ClayStatItem';
import { useAuth } from '../../../context/AuthContext';
import AvatarCropModal from '../../../components/common/AvatarCropModal';

const ProfileHeroCard = () => {
  const { currentUser, updateUser } = useAuth();
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  return (
    <div className="relative clay-card p-5 sm:p-6 w-full flex flex-col justify-between overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
        <svg
          className="absolute right-0 top-0 w-2/3 h-full object-cover opacity-60"
          viewBox="0 0 400 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 150C80 80 200 40 400 60V0H0V150Z"
            fill="#fceceb"
            opacity="0.4"
          />
          <path
            d="M150 150C220 100 300 80 400 110V150H150Z"
            fill="#fceceb"
            opacity="0.6"
          />
        </svg>
        <Droplet className="absolute right-[20%] top-8 w-10 h-10 text-[#d93829] fill-[#d93829] opacity-80 drop-shadow-sm rotate-[-5deg]" />
      </div>

      {/* Top Section: Identity & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <ClayAvatar src={currentUser?.avatar} type="neutral" size={84} />
            <button
              type="button"
              onClick={() => setIsCropModalOpen(true)}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#d93829] text-white flex items-center justify-center shadow-sm border-[3px] border-[#f5f1ea] hover:scale-105 transition-transform"
              title="Change profile picture"
            >
              <Edit2 className="w-3 h-3 fill-current" />
            </button>
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[28px] font-black text-stone-900 tracking-tight leading-none">
                {currentUser?.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[10px] font-bold flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
            <p className="text-[13px] font-semibold text-stone-500">
              BloodWeb • Helping save lives ❤️
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Profile Information Stats */}
      <ClayStatStrip>
        <ClayStatItem
          icon={Droplet}
          iconColor="red"
          fillIcon={true}
          label="Blood Group"
          value={currentUser?.bloodGroup || 'Not Set'}
        />
        <ClayStatItem
          icon={Calendar}
          iconColor="red"
          label="Age"
          value={
            currentUser?.dob
              ? `${differenceInYears(new Date(), new Date(currentUser.dob))} years`
              : 'Not Set'
          }
        />
        <ClayStatItem
          icon={Phone}
          iconColor="red"
          label="Phone"
          value={currentUser?.phone || 'Not Set'}
        />
        <ClayStatItem
          icon={Mail}
          iconColor="red"
          label="Email"
          value={currentUser?.email || 'Not Set'}
          title={currentUser?.email}
        />
        <ClayStatItem
          icon={MapPin}
          iconColor="red"
          label="Location"
          value={
            currentUser?.location?.city
              ? `${currentUser.location.city}, ${currentUser.location.state}`
              : 'Not Set'
          }
          title={
            currentUser?.location?.city
              ? `${currentUser.location.area ? currentUser.location.area + ', ' : ''}${currentUser.location.city}, ${currentUser.location.state}`
              : 'Not Set'
          }
        />
      </ClayStatStrip>

      <AvatarCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentAvatar={currentUser?.avatar}
        onAvatarUpdated={(updatedUser) => updateUser(updatedUser)}
      />
    </div>
  );
};

export default ProfileHeroCard;
