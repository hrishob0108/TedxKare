import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ==================== THANK YOU PAGE ====================
const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Auto-redirect after 8 seconds
  const FIVE_MINUTES = 5 * 60 * 1000;

const timer = setTimeout(() => {
  navigate('/');
}, FIVE_MINUTES);

    return () => clearTimeout(timer);
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ted-red/5 via-transparent to-ted-red/5 opacity-50"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center z-10 max-w-2xl mx-auto"
      >
        {/* Checkmark Animation */}
        <motion.div
          variants={checkmarkVariants}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <svg
              className="w-full h-full text-ted-red"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Checkmark */}
              <motion.path
                d="M 30 50 L 45 65 L 70 35"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-ted-red">Thank You!</span>
        </motion.h1>

        {/* Subheading */}
        <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-semibold mb-6">
          Your Application Has Been Received
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-300 text-lg mb-8 leading-relaxed"
        >
         Your mindset is more important than anything else.
See you soon at the interview. All the best! TEDxKARE
        </motion.p>

        {/* What Happens Next */}
        <motion.div variants={itemVariants} className="mb-10 p-6 bg-gray-900/50 border border-ted-red/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-ted-red">What Happens Next?</h3>
          <ul className="text-gray-300 space-y-3 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-ted-red font-bold mt-1">→</span>
              <span>Check your email and phone regularly for updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ted-red font-bold mt-1">→</span>
              <span>Join our journey to spread ideas worth sharing!</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ted-red font-bold mt-1">→</span>
              <span>Join our WhatsApp group for updates: <a href="https://chat.whatsapp.com/EC6gWhv3uA1GVVTguAySZo" target="_blank" rel="noopener noreferrer" className="text-ted-red hover:underline break-all">https://chat.whatsapp.com/EC6gWhv3uA1GVVTguAySZo</a></span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-4 text-lg font-semibold"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.open('https://linkedin.com', '_blank')}
            className="btn-outline px-8 py-4 text-lg font-semibold"
          >
            Share on LinkedIn
          </button>
        </motion.div>

        {/* Redirect Message */}
        <motion.p variants={itemVariants} className="text-gray-500 text-sm mt-8">
          You will be redirected to the home page in a few seconds...
        </motion.p>

        {/* Counter */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex justify-center items-center gap-2 text-gray-400"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="w-2 h-2 bg-ted-red rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
