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
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const EngineCard = ({ icon: Icon, title, description, badge, stats, isWide }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-8 hover:bg-white/4 transition-all ${isWide ? 'md:col-span-2' : ''}`}
  >
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 px-2 py-1 rounded-md">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-[90%] font-medium">
          {description}
        </p>
      </div>

      {stats ? (
        <div className="mt-auto flex flex-wrap gap-4 pt-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col px-6 py-4 rounded-xl bg-primary/5 border border-primary/10 min-w-[140px]">
              <span className="text-2xl font-black text-primary tracking-tighter">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors cursor-pointer">
          System Active <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
    
    {/* Decorative background element for Geospatial card */}
    {title === "Geospatial Matching" && (
      <div className="absolute top-1/2 -right-4 w-48 h-48 bg-slate-900/40 rounded-lg -translate-y-1/2 rotate-12 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-full h-full border border-white/10 rounded-lg flex flex-col gap-2 p-4">
          <div className="h-2 w-1/2 bg-white/10 rounded" />
          <div className="h-2 w-3/4 bg-white/10 rounded" />
          <div className="h-2 w-1/4 bg-white/10 rounded" />
        </div>
      </div>
    )}
  </motion.div>
);

const StackItem = ({ icon: Icon, name }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/2 p-8 aspect-square hover:bg-white/4 transition-all group"
  >
    <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
      <Icon className="w-10 h-10" />
    </div>
    <span className="text-md font-bold tracking-tight text-slate-300 group-hover:text-white">{name}</span>
  </motion.div>
);

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-200 antialiased font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
             <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.span variants={itemVariants} className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-primary">
              The BloodWeb Manifesto
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.95]">
              The Origin: Evolution of <span className="text-primary italic">an Idea</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              What began as a localized college project has mutated into a production-grade lifeline. 
              BloodWeb bridges the gap between those in urgent need and the heroes ready to provide it.
            </motion.p>
          </motion.div>
        </section>

        {/* Engine Section */}
        <section className="py-24 px-6 bg-white/1">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">The Engine</h2>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">How it actually works</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EngineCard 
                icon={Crosshair} 
                title="Precision Location"
                description="High-fidelity coordinate tracking ensuring we pinpoint donors and recipients within a sub-5 meter radius for maximum efficiency."
              />
              <EngineCard 
                icon={Share2} 
                title="Geospatial Matching"
                description="Our matching algorithm calculates real-time traffic, blood type compatibility, and donor availability to create the perfect circuit of life in under 2 seconds."
              />
              <EngineCard 
                isWide
                icon={Zap} 
                badge="Real-time Core"
                title="Millisecond Alerts"
                description="When life hangs in the balance, every millisecond counts. Our push notification architecture is optimized for zero-latency delivery across all active carriers."
                stats={[
                  { label: "Latency", value: "0.4ms" },
                  { label: "Uptime", value: "99.9%" }
                ]}
              />
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic text-center">The Tech Stack</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StackItem icon={Database} name="MERN Stack" />
              <StackItem icon={MapIcon} name="Leaflet" />
              <StackItem icon={Layers} name="Framer Motion" />
              <StackItem icon={Mail} name="Email OTP" />
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative overflow-hidden rounded-[32px] border border-white/5 bg-linear-to-br from-white/3 to-transparent p-12 md:p-20"
             >
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-10">
                    <h2 className="text-5xl font-black tracking-tighter text-white leading-none">
                      The Roadmap:<br />
                      <span className="italic opacity-50 underline decoration-primary decoration-4 underline-offset-8">What's Next</span>
                    </h2>
                    
                    <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                      The web is only the beginning. We are currently architecting the <span className="text-primary font-bold italic">Mobile Migration</span>. 
                      Leveraging React Native, BloodWeb will soon live natively on your device, providing hardware-level access to location services and critical alerts.
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="bg-primary px-4 py-2 rounded-lg font-black text-sm tracking-tighter italic">Q4 2024</div>
                      <div className="flex gap-2 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                           <Rocket className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex justify-end pr-10">
                     <motion.div 
                       animate={{ 
                         y: [0, -20, 0],
                         rotate: [0, 5, 0]
                       }}
                       transition={{ 
                         duration: 6,
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                       className="text-white opacity-10"
                     >
                        <Rocket className="w-64 h-64" strokeWidth={1} />
                     </motion.div>
                  </div>
                </div>
             </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
