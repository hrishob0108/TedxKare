import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const MeetTeam = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ted-red selection:text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-ted-red/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/3 left-10 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Main Content container */}
      <main className="flex-grow pt-32 pb-16 px-6 relative z-10 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="p-8 md:p-12 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-2xl shadow-2xl relative overflow-hidden text-center group hover:border-ted-red/30 transition-all duration-300"
          >
            {/* Curation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ted-red/10 border border-ted-red/30 text-ted-red text-[10px] font-bold uppercase tracking-widest mb-6 shadow-md shadow-ted-red/5">
              <span className="w-1.5 h-1.5 rounded-full bg-ted-red animate-pulse"></span>
              Curation in Progress
            </div>

            {/* Glowing Headline */}
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Meet Our <span className="text-ted-red">Team</span>
            </h2>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-200 mb-6">
              The Minds Behind <span className="text-ted-red">TEDx</span>KARE
            </h3>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-light">
              Our founding organizing crew, executive curators, and production teams are currently being finalized. The official roster of innovators shaping the stage will be revealed here soon!
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span className="transition-transform group-hover:-translate-x-1 duration-200">←</span> Back to Home
              </button>
              <button
                onClick={() => navigate('/team-recruitment')}
                className="w-full sm:w-auto px-6 py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-ted-red/15 active:scale-[0.98]"
              >
                Join the Team
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MeetTeam;
