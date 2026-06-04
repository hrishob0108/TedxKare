import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Sponsor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden font-sans">
      <Navbar />
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-ted-red/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10 px-4"
      >
        <button
          onClick={() => navigate('/')}
          className="inline-block text-ted-red hover:text-red-500 font-semibold mb-4 transition-colors"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Sponsor <span className="text-ted-red font-black">TEDx</span><span className="text-white font-light">KARE</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
          Support campus innovation, connect with student leaders, and bring ideas worth spreading to life. Partner with us for the 2026 cycle.
        </p>
      </motion.div>

      {/* ==================== CONTENT CONTAINER ==================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl mx-auto px-4 md:px-0 relative z-10 space-y-10"
      >
        {/* Contact CTA Card */}
        <motion.div variants={itemVariants} className="p-6 md:p-8 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800 rounded-3xl text-center shadow-xl relative overflow-hidden group hover:border-ted-red/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-24 h-24 bg-ted-red/5 rounded-full blur-2xl pointer-events-none"></div>
          <span className="bg-ted-red/10 text-ted-red px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-4">
            Get in Touch
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">Let's Collaborate</h2>
          <p className="text-gray-300 text-sm md:text-base mb-6 max-w-md mx-auto leading-relaxed font-light">
            If you are interested in partnering with us, sponsoring our event, or requesting our sponsorship details, please reach out to our team directly via email.
          </p>
          <div className="flex justify-center items-center">
            <a
              href="mailto:tedx@klu.ac.in?subject=TEDxKARE Sponsorship Inquiry"
              className="w-full sm:w-auto px-8 py-3.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-ted-red/15 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              ✉️ tedx@klu.ac.in
            </a>
          </div>
        </motion.div>

        {/* Curation note */}
        <motion.div variants={itemVariants} className="p-6 bg-gray-950/40 border border-gray-900 rounded-2xl text-center">
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            All sponsors will be featured on the official recordings posted onto the global TEDx YouTube Channel (with over 42M+ subscribers). All contributions support the local student committee and logistics of the flagship event.
          </p>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Sponsor;
