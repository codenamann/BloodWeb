import React from 'react';
import { motion } from 'framer-motion';
import {
  Crosshair,
  Share2,
  Zap,
  Database,
  Map as MapIcon,
  Layers,
  Mail,
  Rocket,
  ArrowRight,
  ShieldCheck,
  Heart,
  Droplets,
  Activity,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ClayAvatar from '../components/ClayAssets/ClayAvatar';
import ClayBloodDrop from '../components/ClayAssets/ClayBloodDrop';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] antialiased font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16 sm:pb-20">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 clay-inset-pill"
            >
              <Heart className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
              <span className="text-xs font-extrabold tracking-wide text-[#575965]">
                Platform Architecture &amp; Mission
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1c1d22] tracking-tight leading-[1.1]"
            >
              Connecting Humans to<br />
              <span className="text-[#d93829]">Save Lives in Real Time</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-lg text-[#575965] font-medium leading-relaxed max-w-2xl mx-auto"
            >
              BloodWeb was architected with a single non-negotiable principle: in critical medical emergencies, no one should have to wait for manual phone calls, unverified social media posts, or slow bureaucratic chains.
            </motion.p>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE ENGINE & CORE ARCHITECTURE */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1c1d22]">The Matching Engine</h2>
              <p className="text-xs sm:text-sm text-[#575965] font-medium max-w-lg mx-auto">
                How BloodWeb routes emergency requests to compatible donors in milliseconds
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="clay-card p-6 sm:p-8 bg-white space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl clay-card-crimson flex items-center justify-center text-white shadow-md">
                    <Crosshair className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1c1d22]">Proximity &amp; Compatibility</h3>
                  <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed">
                    Evaluates antigen compatibility across all 8 major blood groups, combined with geospatial distance within a 10km radius.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#d93829]">
                  <span>70% Proximity Weight</span>
                  <span>Formula Verified</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="clay-card p-6 sm:p-8 bg-white space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl clay-card-crimson flex items-center justify-center text-white shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1c1d22]">Reliability Score Engine</h3>
                  <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed">
                    Tracks volunteer commitment and confirmed donation completions, prioritizing the most reliable responders when seconds count.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#d93829]">
                  <span>30% Reliability Weight</span>
                  <span>Zero-Spam Filter</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="clay-card p-6 sm:p-8 bg-white space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl clay-card-crimson flex items-center justify-center text-white shadow-md">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1c1d22]">Live Coordination Rooms</h3>
                  <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed">
                    1:1 private rooms paired directly with every active blood request for instant messaging, token tracking, and hospital arrival updates.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Live WebSocket Sync</span>
                  <span>Full Transparency</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CORE METRICS STRIP */}
        {/* ========================================================================= */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto clay-card-flat p-6 sm:p-10 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-[#d93829]">0.4s</div>
                <div className="text-xs font-bold text-[#747682] uppercase tracking-wider">Broadcast Latency</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-[#1c1d22]">100%</div>
                <div className="text-xs font-bold text-[#747682] uppercase tracking-wider">Verified Hospitals</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-emerald-600">8 Mins</div>
                <div className="text-xs font-bold text-[#747682] uppercase tracking-wider">Avg Response Time</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-[#1c1d22]">24 / 7</div>
                <div className="text-xs font-bold text-[#747682] uppercase tracking-wider">Emergency Readiness</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1c1d22] tracking-tight">
              Ready to be part of the network?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto clay-btn-crimson px-7 py-3.5 text-xs sm:text-sm font-bold shadow-lg"
              >
                Join as Verified Donor
              </Link>
              <Link
                to="/requests"
                className="w-full sm:w-auto clay-btn-cream px-7 py-3.5 text-xs sm:text-sm font-bold text-[#1c1d22]"
              >
                Explore Active Requests
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
