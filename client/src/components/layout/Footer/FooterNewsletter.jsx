import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../../ui';

export const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-[#1c1d22]">Stay Informed</h4>
      <p className="text-[11px] sm:text-xs text-[#575965] leading-relaxed">
        Get vital blood drive notices and community impact reports in your area.
      </p>

      {subscribed ? (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Thank you for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-2">
          <Input
            type="email"
            required
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-white"
          />
          <Button
            type="submit"
            variant="crimson"
            size="sm"
            className="w-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Subscribe to Alerts</span>
            <Send className="w-3 h-3" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default FooterNewsletter;
