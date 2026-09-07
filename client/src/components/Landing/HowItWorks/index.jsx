import React from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '../../ui';
import WorkflowStepCard from './WorkflowStepCard';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create a Request',
      description:
        'Enter the required blood group, units needed, location, and relevant details.',
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff5e50] via-[#d93829] to-[#b32316] flex items-center justify-center text-white shadow-[0_6px_14px_-2px_rgba(217,56,41,0.38),inset_1px_2px_3px_rgba(255,255,255,0.45),inset_-1px_-2px_4px_rgba(110,12,6,0.4)]">
            <svg
              className="w-5 h-5 fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <div className="w-3.5 h-3.5 clay-sphere-crimson absolute -top-1 -right-1 animate-float-slow pointer-events-none" />
        </div>
      ),
    },
    {
      number: '02',
      title: 'Find Compatible Donors',
      description:
        'BloodWeb identifies potentially compatible donors based on blood group, availability, and location.',
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff5e50] via-[#d93829] to-[#b32316] flex items-center justify-center text-white shadow-[0_6px_14px_-2px_rgba(217,56,41,0.38),inset_1px_2px_3px_rgba(255,255,255,0.45),inset_-1px_-2px_4px_rgba(110,12,6,0.4)]">
            <svg
              className="w-5 h-5 fill-none stroke-current stroke-[2.4]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div className="w-3.5 h-3.5 clay-sphere-crimson absolute -top-1 -right-1 animate-float-slow pointer-events-none" />
        </div>
      ),
    },
    {
      number: '03',
      title: 'Notify Donors',
      description:
        'Suitable donors can be notified about the request so they can choose whether to respond.',
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff5e50] via-[#d93829] to-[#b32316] flex items-center justify-center text-white shadow-[0_6px_14px_-2px_rgba(217,56,41,0.38),inset_1px_2px_3px_rgba(255,255,255,0.45),inset_-1px_-2px_4px_rgba(110,12,6,0.4)]">
            <svg
              className="w-5 h-5 fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="w-3.5 h-3.5 clay-sphere-crimson absolute -top-1 -right-1 animate-float-slow pointer-events-none" />
        </div>
      ),
    },
    {
      number: '04',
      title: 'Coordinate the Donation',
      description:
        'Once a donor responds, the people involved can coordinate through the platform.',
      icon: (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff5e50] via-[#d93829] to-[#b32316] flex items-center justify-center text-white shadow-[0_6px_14px_-2px_rgba(217,56,41,0.38),inset_1px_2px_3px_rgba(255,255,255,0.45),inset_-1px_-2px_4px_rgba(110,12,6,0.4)]">
            <svg
              className="w-5 h-5 fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="w-3.5 h-3.5 clay-sphere-crimson absolute -top-1 -right-1 animate-float-slow pointer-events-none" />
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-16 overflow-hidden scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge
            variant="inset"
            className="inline-flex items-center gap-2 mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
              Simple Steps, Bigger Impact
            </span>
          </Badge>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight">
            How BloodWeb Works
          </h2>

          <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed max-w-2xl mx-auto">
            From request to response — all in one place.
          </p>
        </div>

        {/* 4 Connected Step Cards with Desktop Directional Arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative h-full">
              <WorkflowStepCard
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delay={idx * 0.1}
              />

              {/* Desktop Directional Arrow between cards */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-stone-500 font-bold text-xl select-none"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
