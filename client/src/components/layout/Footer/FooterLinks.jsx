import React from 'react';
import { Link } from 'react-router-dom';

const GithubFilled = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const LinkedinFilled = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XFilled = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const FooterLinks = () => {
  const handleScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
      {/* Col 1: Platform */}
      <div className="space-y-2.5 sm:space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c1d22]">
          Platform
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#575965] font-semibold">
          <li>
            <a
              href="#how-it-works"
              onClick={(e) => handleScroll(e, '#how-it-works')}
              className="hover:text-[#d93829] transition-colors"
            >
              How it Works
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, '#about')}
              className="hover:text-[#d93829] transition-colors"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="hover:text-[#d93829] transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Col 2: Account */}
      <div className="space-y-2.5 sm:space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c1d22]">
          Account
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#575965] font-semibold">
          <li>
            <Link
              to="/login"
              className="hover:text-[#d93829] transition-colors"
            >
              Log In
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="hover:text-[#d93829] transition-colors"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>

      {/* Col 3: Follow Us */}
      <div className="space-y-2.5 sm:space-y-3 col-span-2 sm:col-span-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1c1d22]">
          Follow Us
        </h4>
        <div className="flex items-center gap-2.5 pt-1">
          <a
            href="https://github.com/codenamann/BloodWeb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 rounded-xl clay-card-flat bg-[#f5ede3] hover:bg-stone-300/80 flex items-center justify-center text-[#1c1d22] hover:text-[#d93829] hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <GithubFilled className="w-5 h-5 text-[#1c1d22] group-hover:text-[#d93829]" />
          </a>
          <a
            href="https://www.linkedin.com/in/codenaman/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 rounded-xl clay-card-flat bg-[#f5ede3] hover:bg-stone-300/80 flex items-center justify-center text-[#1c1d22] hover:text-[#d93829] hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <LinkedinFilled className="w-4 h-4 text-[#1c1d22] group-hover:text-[#d93829]" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="w-9 h-9 rounded-xl clay-card-flat bg-[#f5ede3] hover:bg-stone-300/80 flex items-center justify-center text-[#1c1d22] hover:text-[#d93829] hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <XFilled className="w-4 h-4 text-[#1c1d22] group-hover:text-[#d93829]" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterLinks;
