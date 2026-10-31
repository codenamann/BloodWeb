import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

function LocationCard({ location, onSet }) {
  const area = location?.area;
  const city = location?.city;
  const state = location?.state;

  const formatPlace = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  const locationText = area
    ? `${formatPlace(area)}, ${formatPlace(city)}`
    : city
      ? `${formatPlace(city)}, ${formatPlace(state)}`
      : 'Not Set';

  return (
    <div className="clay-card p-5 bg-[#fdfbf9] flex flex-col gap-6 justify-between relative overflow-hidden group w-full">
      <div className="flex justify-between items-center relative z-10">
        {/* Blood Drop Pedestal (using clay-btn-cream shadow with custom background for that pinkish cream look) */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center clay-pedestal shrink-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
        >
          <MapPin className="w-5 h-5 text-clay-crimson-dark [&>path]:fill-current [&>circle]:fill-[#fff3f1] [&>circle]:stroke-[#fff3f1] [&>circle]:stroke-[1.5px]" />
        </div>

        {/* Set Button (only visible if no blood group) */}
        {!location ? (
          <button
            onClick={onSet}
            className="clay-btn-cream pl-3 pr-2 py-[7px] text-xs text-[#d93829] font-black flex items-center gap-1 tracking-wide"
            style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
          >
            Set <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={onSet}
            className="clay-btn-cream pl-3 pr-2 py-[7px] text-[11px] text-clay-charcoal-muted! flex items-center gap-1 tracking-wide"
            style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
          >
            Update <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        )}
      </div>

      <div className=" relative z-10 pl-1">
        <div className="text-[9px] font-bold text-stone-500/80 uppercase tracking-[0.15em] mb-1.5">
          Location
        </div>

        <div className="text-[18px] font-black text-stone-900 tracking-tight leading-tight mb-2 line-clamp-1">
          {locationText}
        </div>

        {!location ? (
          <p className="text-[10px] text-stone-500/90 font-medium leading-snug">
            Set your location to help nearby people find you.
          </p>
        ) : (
          <p className="text-[10px] text-stone-500/90 font-medium leading-snug">
            Your location is set and visible to help nearby people find you.
          </p>
        )}
      </div>
    </div>
  );
}

export default LocationCard;
