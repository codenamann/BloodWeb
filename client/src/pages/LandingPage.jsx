import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import CallToAction from '../components/Landing/CallToAction';

const LandingPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-sans">
      <div className="flex min-h-screen flex-col ">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
