import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowLeft,
  HeartPulse,
  Chrome,
  Github,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/ui/passwordInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    console.log('Logging in with:', email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden hero-gradient">
      {/* Background Pulse line similar to Landing Page */}
      <div className="pulse-line top-1/2 -translate-y-1/2 opacity-10" />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors group z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Login Card */}
        <motion.div variants={itemVariants} className="relative group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 blur-xl bg-linear-to-r from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-white/70 dark:bg-background-dark/70 backdrop-blur-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center justify-center md:justify-between mb-2">
                {/* Brand/Logo (Inside Card) */}
                <div className="flex items-center gap-2 ">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                      Blood<span className="text-primary">Web</span>
                    </h1>
                  </div>
                </div>
                <h2 className="hidden md:block text-xl font-bold text-slate-900 dark:text-white">
                  Welcome Back
                </h2>
              </div>

              {/* <p className="text-sm text-slate-500">Sign in to manage your donor profile or request aid.</p> */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field pl-12 bg-white/50 dark:bg-slate-900/50 text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Password
                  </label>
                  <Link
                    to="/forgot"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput password={password} setPassword={setPassword} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all mt-4"
              >
                Sign In
              </motion.button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center gap-4 text-xs text-slate-400 uppercase tracking-widest font-bold mb-8">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span>Or connect with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="flex justify-center gap-4">
                <button className="flex h-12 px-8 items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <Chrome className="w-5 h-5" /> Google
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Link */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-center text-sm text-slate-500"
        >
          New to BloodWeb?{' '}
          <Link
            to="/register"
            className="font-bold text-primary hover:underline"
          >
            Create an Account
          </Link>
        </motion.p>
      </motion.div>

      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] z-0" />
    </div>
  );
};

export default LoginPage;
