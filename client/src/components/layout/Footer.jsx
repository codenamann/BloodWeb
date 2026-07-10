import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-primary/10 py-12 dark:bg-background-dark/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">BloodWeb</h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">The world's most advanced real-time blood donor network. Making every drop count.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors cursor-pointer">Live Network</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Alerts</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Statistics</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors cursor-pointer">About Us</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Impact</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Privacy</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors cursor-pointer">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Emergency</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-primary/5 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} BloodWeb Technologies. All rights reserved. Built with passion for saving lives.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
