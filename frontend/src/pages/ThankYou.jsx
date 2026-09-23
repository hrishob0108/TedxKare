import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// ==================== THANK YOU PAGE ====================
const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketType = location.state?.ticketType;
  const applicantType = location.state?.applicantType;

  useEffect(() => {
    // Secure Route: Only allow if registration was completed
    if (!location.state?.registrationComplete) {
      navigate('/', { replace: true });
      return;
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Auto-redirect after 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;

    const timer = setTimeout(() => {
      navigate('/');
    }, FIVE_MINUTES);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

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
          <span className="text-white">Welcome to </span>
          <span className="text-ted-red">TEDxKARE 2026!</span>
        </motion.h1>

        {/* Subheading */}
        <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-semibold mb-6">
          Your registration is confirmed.
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          We look forward to seeing you on October 3, 2026, at TIFAC-CORE Seminar Hall, Kalasalingam University.
        </motion.p>

        {/* Stay Connected */}
        <motion.div variants={itemVariants} className="mb-8 p-6 bg-gray-900/50 border border-ted-red/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 text-ted-red">Stay Connected</h3>
          <ul className="text-gray-300 space-y-5 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📱</span>
              <div className="flex-1">
                <p><strong>Join WhatsApp Group</strong> – For event updates & communication.</p>
                <div className="mt-2">
                  {ticketType === 'External' ? (
                    <a href="https://chat.whatsapp.com/LPPtcA3ehEN93UTYDxjKwl" target="_blank" rel="noopener noreferrer" className="inline-block bg-ted-red/20 text-ted-red border border-ted-red/50 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-ted-red hover:text-white transition-colors">
                      Join External Group
                    </a>
                  ) : ticketType === 'Internal' ? (
                    <a href="https://chat.whatsapp.com/Jsj4sehTFRsDiNFfIsJoba" target="_blank" rel="noopener noreferrer" className="inline-block bg-ted-red/20 text-ted-red border border-ted-red/50 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-ted-red hover:text-white transition-colors">
                      Join Internal Group
                    </a>
                  ) : (
                    <a href="https://chat.whatsapp.com/EC6gWhv3uA1GVVTguAySZo" target="_blank" rel="noopener noreferrer" className="inline-block bg-ted-red/20 text-ted-red border border-ted-red/50 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-ted-red hover:text-white transition-colors">
                      Join Group
                    </a>
                  )}
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📧</span>
              <div className="flex-1">
                <p><strong>Check Email</strong> – Important updates will be sent to your registered email.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl mt-0.5">❓</span>
              <div className="flex-1">
                <p><strong>Help Page</strong> – For any issues or assistance, visit the Help Page on our website.</p>
              </div>
            </li>
          </ul>
        </motion.div>
        
        <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-8 text-white">
          See you at <span className="text-ted-red">TEDx</span>KARE!
        </motion.h3>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-4 text-lg font-semibold"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.open('https://www.linkedin.com/company/tedxkare/', '_blank')}
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
