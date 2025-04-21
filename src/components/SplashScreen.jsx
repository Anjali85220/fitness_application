import { motion } from 'framer-motion';
import { useEffect } from 'react';
import logo from '../assets/logo.png'; // Adjust path to your logo

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Splash screen duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="splash-content">
        {/* Animated Logo */}
        <motion.div
          className="logo-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 10,
            duration: 0.8
          }}
        >
          <motion.img
            src={logo}
            alt="App Logo"
            className="logo-image"
            initial={{ rotate: -15 }}
            animate={{ rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: 'spring',
              stiffness: 70,
              damping: 10
            }}
          />
        </motion.div>

        {/* App Name */}
        <motion.h1
          className="app-name"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          FitVision AI
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="tagline"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Your Smart Exercise Coach
        </motion.p>

        {/* Loading Indicator */}
        <motion.div 
          className="loading-bar"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}