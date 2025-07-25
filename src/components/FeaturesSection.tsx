import React from 'react'
import { NewBentoGrid } from './BentoGrid'

// Import SVG icons as React components
const RamenIcon: React.FC = () => (
  <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <ellipse cx="64" cy="85" rx="45" ry="8" fill="currentColor" opacity="0.3"/>
      <path d="M19 75c0 15 20 25 45 25s45-10 45-25V65c0-5-20-8-45-8s-45 3-45 8v10z" fill="currentColor" opacity="0.7"/>
      <path d="M35 65c5-10 15-8 20 0s10 10 15-5 10-8 15 0" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9"/>
      <path d="M30 70c8-8 12-5 18 2s8 8 16-2 12-6 18 2" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
      <path d="M32 75c6-6 10-3 14 3s6 6 12-3 10-4 14 3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
      <line x1="75" y1="25" x2="85" y2="65" stroke="currentColor" strokeWidth="3" opacity="0.8"/>
      <line x1="80" y1="22" x2="90" y2="62" stroke="currentColor" strokeWidth="3" opacity="0.8"/>
      <path d="M45 45c0-8 2-12 0-18s2-8 0-12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M55 40c0-6 2-10 0-14s2-6 0-10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M65 42c0-7 2-11 0-16s2-7 0-11" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
    </g>
  </svg>
)

const RequestIcon: React.FC = () => (
  <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <rect x="25" y="20" width="60" height="80" rx="8" fill="currentColor" opacity="0.3"/>
      <rect x="25" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
      <line x1="35" y1="35" x2="75" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <line x1="35" y1="45" x2="70" y2="45" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <line x1="35" y1="55" x2="65" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <line x1="35" y1="65" x2="72" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <path d="M95 50L110 35L95 20" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.8"/>
      <line x1="90" y1="35" x2="105" y2="35" stroke="currentColor" strokeWidth="3" opacity="0.8"/>
      <circle cx="90" cy="85" r="18" fill="currentColor" opacity="0.4"/>
      <circle cx="90" cy="85" r="18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
      <line x1="90" y1="75" x2="90" y2="95" stroke="currentColor" strokeWidth="3" opacity="0.9"/>
      <line x1="80" y1="85" x2="100" y2="85" stroke="currentColor" strokeWidth="3" opacity="0.9"/>
      <circle cx="40" cy="80" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="50" cy="85" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="60" cy="80" r="2" fill="currentColor" opacity="0.5"/>
    </g>
  </svg>
)

const CareIcon: React.FC = () => (
  <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <path d="M64 105c-25-20-45-35-45-55 0-15 12-25 25-25 8 0 15 4 20 10 5-6 12-10 20-10 13 0 25 10 25 25 0 20-20 35-45 55z" fill="currentColor" opacity="0.6"/>
      <path d="M64 100c-22-18-40-32-40-50 0-13 10-22 22-22 7 0 13 3 18 9 5-6 11-9 18-9 12 0 22 9 22 22 0 18-18 32-40 50z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
      <path d="M35 75c-3 5-5 10-3 15 2 8 10 12 18 10l8-2" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <path d="M93 75c3 5 5 10 3 15-2 8-10 12-18 10l-8-2" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7"/>
      <circle cx="45" cy="40" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="85" cy="45" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="40" cy="60" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="90" cy="60" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="50" cy="25" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="78" cy="28" r="1" fill="currentColor" opacity="0.6"/>
      <path d="M35 30l2-2 2 2-2 2-2-2z" fill="currentColor" opacity="0.5"/>
      <path d="M95 35l1.5-1.5 1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" opacity="0.5"/>
    </g>
  </svg>
)

export const FeaturesSection: React.FC = () => {
  const cards = [
    {
      id: "skill",
      colSpan: 2 as const,
      rowSpan: 2 as const,
      element: (
        <div className="relative h-full p-6 bg-black text-white rounded-2xl overflow-hidden">
          <div className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 opacity-80 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <RamenIcon />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end space-y-2 lg:space-y-3">
            <h3 className="font-recursive text-xl font-semibold md:text-2xl lg:text-3xl">
              Speedy Turnovers
            </h3>
            <h4 className="font-recursive text-base font-medium opacity-90 md:text-lg lg:text-xl">
              Skill
            </h4>
            <p className="text-sm leading-snug opacity-80 md:text-[15px] lg:text-base">
              Receive your design or web development within a few business days on average.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "request",
      colSpan: 1 as const,
      rowSpan: 1 as const,
      element: (
        <div className="relative h-full p-6 bg-orange-500 text-white rounded-2xl overflow-hidden">
          <div className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 opacity-80 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <RequestIcon />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end space-y-2 lg:space-y-3">
            <h3 className="font-recursive text-xl font-semibold md:text-2xl lg:text-3xl">
              Worry‑free Pricing
            </h3>
            <h4 className="font-recursive text-base font-medium opacity-90 md:text-lg lg:text-xl">
              Request
            </h4>
            <p className="text-sm leading-snug opacity-80 md:text-[15px] lg:text-base">
              Subscribe & request as many design & web development requests as you'd like.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "care",
      colSpan: 3 as const,
      rowSpan: 2 as const,
      element: (
        <div className="relative h-full p-6 bg-fuchsia-300 text-gray-900 rounded-2xl overflow-hidden">
          <div className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 opacity-80 md:h-28 md:w-28 lg:h-32 lg:w-32">
            <CareIcon />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end space-y-2 lg:space-y-3">
            <h3 className="font-recursive text-xl font-semibold md:text-2xl lg:text-3xl">
              No Frustration
            </h3>
            <h4 className="font-recursive text-base font-medium opacity-90 md:text-lg lg:text-xl">
              Care
            </h4>
            <p className="text-sm leading-snug opacity-80 md:text-[15px] lg:text-base">
              We'll revise the work until you're 100% satisfied.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          Our Features
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Everything you need to bring your ideas to life
        </p>
      </div>
      <NewBentoGrid items={cards} />
    </section>
  );
};

export default FeaturesSection;