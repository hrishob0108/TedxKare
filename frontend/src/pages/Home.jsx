import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DomainCard from '../components/DomainCard';

// ==================== DOMAINS DATA ====================
const domains = [
  {
    name: 'Selection Committee (Curation Team)',
    icon: '⚖️',
    description: 'The Selection Committee is responsible for finding and selecting speakers with meaningful and powerful ideas. This team reviews speaker applications, conducts interviews if needed, and ensures that the talks cover different fields such as science, education, innovation, business, culture, and social impact. They also help guide speakers in developing clear and impactful talks that follow TEDx guidelines.',
  },
  {
    name: 'Executive Producer',
    icon: '🎬',
    description: 'The Executive Producer oversees the entire planning and production of the event. This role coordinates different teams and ensures that every part of the event is organized properly. They manage the stage flow, coordinate rehearsals, and make sure the program runs smoothly on the event day. They also work closely with technical teams for lighting, audio, and stage management.',
  },
  {
    name: 'Event Manager',
    icon: '🎭',
    description: 'The Event Manager handles the operational side of the event. They coordinate with the venue management, manage event schedules, and organize attendee registration and ticketing. This role ensures that guests, speakers, and volunteers have a smooth experience during the event. They also oversee logistics such as seating, guest reception, and event day coordination.',
  },
  {
    name: 'Sponsorship & Budget Manager',
    icon: '💰',
    description: 'This role focuses on financial planning for the event. The Sponsorship & Manager approaches companies and organizations for sponsorship support and partnerships. They prepare sponsorship proposals, manage funds received from sponsors, and track event expenses. Their goal is to ensure the event has enough resources while maintaining transparency and proper financial planning.',
  },
  {
    name: 'Designer',
    icon: '🎨',
    description: 'The Designer is responsible for the visual identity of the event. They create posters, banners, social media graphics, stage visuals, and other branding materials. This role helps maintain a professional and creative look for the event. The designer works closely with the marketing and website teams to ensure consistent branding across all platforms.',
  },
  {
    name: 'Communications & Marketing Director',
    icon: '📢',
    description: 'This role manages the public communication and promotion of the event. They create marketing strategies, manage social media platforms, write promotional content, and engage with the audience online. They also help in building awareness about the event through posters, campaigns, and digital promotions to attract attendees and participants.',
  },
  {
    name: 'Website Manager',
    icon: '🌐',
    description: 'The Website Manager develops and maintains the official event website. They update important information such as event details, speaker profiles, schedules, and announcements. This role ensures that the website is easy to use, informative, and accessible to the public. They may also coordinate with designers and developers to improve the website experience.',
  },
  {
    name: 'Video Production',
    icon: '📹',
    description: 'The Video & Production Lead manages all technical aspects related to recording and producing the event. This includes camera setup, audio recording, stage lighting, and video editing. Their work ensures that the talks are recorded in high quality so they can later be shared with a global audience. They also coordinate camera operators and technical teams during the event.',
  },
  {
    name: 'Research Team',
    icon: '🔬',
    description: 'The Research Team supports the Selection Committee in identifying strong and meaningful speakers for TEDxKARE, part of the global TEDx initiative. This team researches speaker ideas and talk topics across different fields such as science, technology, education, innovation, business, culture, and social impact. They analyze the originality and relevance of each idea, verify facts, and ensure the content follows TEDx guidelines. The team also studies the speakers’ proposed talks, helps refine their ideas, and ensures the talks are clear, informative, and meaningful for the audience.',
  },
];

// ==================== HOME PAGE ====================
const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants for hero content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ==================== NAVIGATION ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container-flex flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold"><span className="text-ted-red">TED</span>x<span className="text-white">KARE</span></h1>
          <div className="relative">
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="btn-primary text-sm cursor-pointer"
            >
              Help
            </button>
            {isHelpOpen && (
              <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-4 w-64 z-50">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                  <p className="text-white font-semibold text-sm">Contact Support</p>
                  <button
                    onClick={() => setIsHelpOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <a href="tel:+918143152912" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <p className="text-gray-300 font-medium">Venkat Reddy</p>
                    <p className="text-gray-400">+91 81431 52912</p>
                  </a>
                  <a href="tel:+919346276642" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <p className="text-gray-300 font-medium">Surya</p>
                    <p className="text-gray-400">+91 93462 76642</p>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-screen pt-24 pb-16 px-4 md:px-0 flex items-center justify-center relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-ted-red/10 to-transparent opacity-40"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container-flex text-center z-10 max-w-3xl"
        >
          {/* Subtitle */}
          <motion.div variants={itemVariants} className="mb-6">
            <p className="text-ted-red font-semibold tracking-wider uppercase">
              Ideas Worth Spreading
            </p>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-ted-red">TED</span>x<span className="text-white">KARE</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-8">
            Join the Founding Team 2026
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            TEDxKARE is an independently organized TEDx event conducted at Kalasalingam Academy of Research and Education.
            It follows the ideas and format of TEDx, where speakers share powerful ideas, experiences, and innovations that can inspire students and the community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/apply')}
              className="btn-primary px-8 py-4 text-lg"
            >
              Apply Now →
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== DOMAINS SECTION ==================== */}
      <section className="section bg-gradient-to-b from-transparent to-gray-900/20">
        {/* Section Title */}
        <div className="section-title">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find the perfect domain that matches your skills and interests. Each team plays a crucial
            role in making TEDxKARE a success.
          </p>
        </div>

        {/* Domains Grid - Custom Masonry Layout */}
        <>
          {/* Mobile Layout (1 column) */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            <div className="flex flex-col gap-6">
              {domains.map((domain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DomainCard
                    domain={domain.name}
                    icon={domain.icon}
                    description={domain.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tablet Layout (2 columns) */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
            {[0, 1].map((colIndex) => (
              <div key={`tab-${colIndex}`} className="flex flex-col gap-6">
                {domains
                  .map((domain, idx) => ({ domain, idx }))
                  .filter((_, idx) => idx % 2 === colIndex)
                  .map(({ domain, idx }) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DomainCard
                        domain={domain.name}
                        icon={domain.icon}
                        description={domain.description}
                      />
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>

          {/* Desktop Layout (4 columns) */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((colIndex) => (
              <div key={`desk-${colIndex}`} className="flex flex-col gap-6">
                {domains
                  .map((domain, idx) => ({ domain, idx }))
                  .filter((_, idx) => idx % 4 === colIndex)
                  .map(({ domain, idx }) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DomainCard
                        domain={domain.name}
                        icon={domain.icon}
                        description={domain.description}
                      />
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        </>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="section py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-ted-red mb-2">8+</h3>
            <p className="text-gray-400">Exciting Domains</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-ted-red mb-2">2026</h3>
            <p className="text-gray-400">Founding Year</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-ted-red mb-2">TED</h3>
            <p className="text-gray-400">Official License</p>
          </motion.div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="section bg-gradient-to-r from-ted-red/10 to-orange-500/10 rounded-2xl border border-ted-red/20 py-16 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join TEDxKARE and help us bring inspiring ideas to our campus and beyond.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/apply')}
          className="btn-primary px-8 py-4 text-lg"
        >
          Start Your Application
        </motion.button>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-8">
        <div className="container-flex text-center text-gray-400">
          <p>&copy; 2026 TEDxKARE. All rights reserved.</p>
          <p className="text-sm mt-2">
            TEDxKARE is an independently organized TED-like event at Kalasalingam University.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
