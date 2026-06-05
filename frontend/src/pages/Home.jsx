import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DomainCard from '../components/DomainCard';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ideasAPI } from '../utils/api';

const sampleDomains = [
  { domain: 'Community', description: 'Build and manage local chapters, events and outreach.' },
  { domain: 'Speakers', description: 'Speaker curation, coaching and session planning.' },
  { domain: 'Production', description: 'Stage, AV, logistics and volunteer coordination.' },
  { domain: 'Marketing', description: 'Branding, social media and audience growth.' },
];

const radialNodes = [
  { label: 'Creativity', angle: 270 }, // Top Center
  { label: 'Inspiration', angle: 315 }, // Top Right
  { label: 'Networking', angle: 0 }, // Middle Right
  { label: 'Business', angle: 45 }, // Bottom Right
  { label: 'Innovation', angle: 90 }, // Bottom Center
  { label: 'Different Ideas', angle: 135 }, // Bottom Left
  { label: 'Leadership', angle: 180 }, // Middle Left
  { label: 'Technology', angle: 225 }, // Top Left
];

const Home = () => {
  const [loadingScreen, setLoadingScreen] = useState(() => {
    // Skip full splash loading on internal router navigation
    return !window.__hasLoadedBefore;
  });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Timer to end the loader splash
  useEffect(() => {
    if (!loadingScreen) return;
    const timer = setTimeout(() => {
      setLoadingScreen(false);
      window.__hasLoadedBefore = true;
    }, 2600);
    return () => clearTimeout(timer);
  }, [loadingScreen]);


  // Block body scroll during cinematic splash loader
  useEffect(() => {
    if (loadingScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loadingScreen]);

  // Monitor user scroll to fade out the scroll-down indicator
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Framer Motion Animation Variants for cinematic Hero entry
  const heroContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: window.__hasLoadedBefore ? 0.1 : 0.25,
        delayChildren: window.__hasLoadedBefore ? 0 : 0.1,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.6, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };


  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Community Ideas Sandbox state
  const [ideas, setIdeas] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Technology");
  const [newAuthor, setNewAuthor] = useState("");

  // Load ideas from database on mount & seed defaults if empty
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await ideasAPI.getAllIdeas();
        if (res.data && res.data.success) {
          if (res.data.data.length > 0) {
            setIdeas(res.data.data);
          } else {
            // Seed defaults into database via API so that the DB contains samples
            const defaults = [
              { title: "Empathetic AI Tools", desc: "Using natural language processing to detect early signs of academic burnout and suggest customized student well-being activities.", cat: "Technology", author: "Ananya S." },
              { title: "Zero-Waste Campus Dining", desc: "A circular system converting organic kitchen scraps from campus dining halls into nutrient-rich compost and clean biogas.", cat: "Sustainability", author: "Vikram R." },
              { title: "Decolonizing Spaces", desc: "Utilizing classical stepwell architecture principles to create naturally cooled, shade-rich outdoor student study lounges.", cat: "Art & Design", author: "Siddharth M." }
            ];
            for (const item of defaults) {
              await ideasAPI.submitIdea(item);
            }
            // Fetch updated list
            const refreshed = await ideasAPI.getAllIdeas();
            if (refreshed.data?.success) {
              setIdeas(refreshed.data.data);
            }
          }
        }
      } catch (err) {
        console.error("Error loading brainstorm ideas from database:", err);
      }
    };
    fetchIdeas();
  }, []);

  // Countdown clock effect
  useEffect(() => {
    const target = new Date('June 12, 2026 16:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddIdea = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    try {
      const res = await ideasAPI.submitIdea({
        title: newTitle.trim(),
        desc: newDesc.trim(),
        cat: newCat,
        author: newAuthor.trim() || "Anonymous Student"
      });
      if (res.data && res.data.success) {
        setIdeas([res.data.data, ...ideas]);
        setNewTitle("");
        setNewDesc("");
        setNewAuthor("");
      }
    } catch (err) {
      console.error("Error submitting idea to database:", err);
      alert(err.response?.data?.message || "Failed to submit idea. Try again.");
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await ideasAPI.likeIdea(id);
      if (res.data && res.data.success) {
        setIdeas(ideas.map(idea => idea._id === id ? { ...idea, likes: res.data.data.likes } : idea));
      }
    } catch (err) {
      console.error("Error liking idea in database:", err);
    }
  };

  const faqs = [
    { q: <>What is <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>?</>, a: <><span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span> is an independently organized TED event focused on community ideas and local impact.</> },
    { q: 'How can I join the team?', a: 'Visit the Team Recruitment page, view open domains, and submit an expression of interest.' },
    { q: 'Can I attend events without volunteering?', a: 'Yes — events are open to the public; volunteering helps deepen your experience.' },
  ];

  const events = [
    { title: <><span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span> Spring Summit</>, date: 'June 12, 2026', location: 'KARE Main Auditorium' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ted-red selection:text-white relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-ted-red/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <main className="pt-20 relative z-10">
        {/* ==================== HERO SECTION (Cinematic Entry) ==================== */}
        <section className="relative min-h-[calc(100dvh-5rem)] overflow-hidden flex flex-col items-center justify-center border-b border-gray-900 bg-gradient-to-b from-gray-950/20 to-black pt-8 pb-20 sm:pt-20 sm:pb-36">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate={loadingScreen ? "hidden" : "visible"}
            className="container mx-auto px-6 text-center relative z-10"
          >
            {/* Founding Cycle Pill Badge */}
            <motion.h1
              variants={titleVariants}
              className="text-3xl xs:text-4xl sm:text-7xl md:text-8xl leading-none mb-3 tracking-tighter"
            >
              <span className="bg-gradient-to-r from-ted-red via-red-500 to-red-600 bg-clip-text text-transparent font-black">TEDx</span>
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent font-light">KARE</span>
            </motion.h1>

            {/* Independently Organized Event Sub-label */}
            <motion.p
              variants={subtitleVariants}
              className="text-xs sm:text-sm md:text-base text-white font-medium mb-6 sm:mb-8 select-none"
            >
              <span className="text-ted-red font-bold">x</span> = An independently organized TED event
            </motion.p>

            {/* Elegant Subtitle */}
            <motion.p
              variants={subtitleVariants}
              className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-4"
            >
              A premium space where student changemakers, innovators, and leaders collaborate to bring <span className="text-white font-medium">Ideas Worth Spreading</span> to life.
            </motion.p>
          </motion.div>

          {/* Bouncing Scroll Down indicator */}
          <div className="absolute bottom-6 sm:bottom-12 md:bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={
                loadingScreen
                  ? { opacity: 0, y: 25 }
                  : hasScrolled
                    ? { opacity: 0, y: -20, pointerEvents: 'none' }
                    : { opacity: 1, y: 0 }
              }
              transition={
                hasScrolled
                  ? { duration: 0.4, ease: "easeInOut" }
                  : window.__hasLoadedBefore
                    ? { duration: 0.5 }
                    : { delay: 0.9, duration: 0.8 }
              }
              className="flex flex-col items-center gap-2 cursor-pointer group pointer-events-auto"
              onClick={() => {
                document.getElementById('what-is-tedx')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold group-hover:text-ted-red transition-colors duration-300">
                Scroll Down
              </span>
              <motion.div
                animate={{
                  y: [0, 10, 2, 10, 0],
                  scaleY: [1, 0.9, 1.05, 0.92, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut"
                }}
                className="w-9 h-9 rounded-full border border-gray-800/80 flex items-center justify-center text-gray-400 group-hover:border-ted-red/60 group-hover:text-white transition-all duration-300 shadow-lg shadow-black/20 bg-black/40 backdrop-blur-sm group-hover:shadow-ted-red/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-y-0.5 duration-300">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* ==================== WHAT & HOW ==================== */}
        <motion.section
          id="what-is-tedx"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 lg:px-20 py-24 scroll-mt-20"
        >
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* What description */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <span className="text-ted-red font-bold text-xs uppercase tracking-widest block">About Us</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">What is <span className="text-ted-red">TEDx</span><span className="text-white font-light">KARE</span>?</h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                An independently organized TED event series created by local changemakers to surface ideas that matter to our region. We bring together speakers, performers, volunteers, and partners to learn, connect, and take action.
              </p>

              <div className="pt-4 border-t border-gray-900 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider text-center md:text-left">How it works</h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
                  <li className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 hover:border-ted-red/40 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-ted-red/5">
                    <span className="text-ted-red font-bold block mb-1">01. Curate</span>
                    Deep-dive speaker selection aligned with KARE community values.
                  </li>
                  <li className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 hover:border-ted-red/40 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-ted-red/5">
                    <span className="text-ted-red font-bold block mb-1">02. Design</span>
                    Premium stage visuals, sound design, and stagecraft.
                  </li>
                  <li className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 hover:border-ted-red/40 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-ted-red/5">
                    <span className="text-ted-red font-bold block mb-1">03. Share</span>
                    Broadcasting world-class student and professional talks.
                  </li>
                </ol>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="md:col-span-5 space-y-6">
              {/* Sponsor Us glass panel */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900/40 to-black/20 rounded-2xl border border-gray-800/80 shadow-2xl relative overflow-hidden group hover:border-ted-red/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ted-red/5 rounded-full blur-2xl group-hover:bg-ted-red/10 transition-colors pointer-events-none"></div>
                <span className="bg-ted-red/10 text-ted-red px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block mb-3">Partner with Us</span>
                <h4 className="font-extrabold text-xl text-white">Sponsor <span className="text-ted-red font-extrabold">TEDx</span><span className="font-light">KARE</span></h4>
                <p className="text-gray-400 text-sm mt-2 mb-5 leading-relaxed font-light">
                  Support ideas worth spreading. Align your brand with campus innovation and connect with student leaders, thinkers, and builders.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/sponsor"
                    className="w-full bg-ted-red hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors text-center shadow-lg shadow-ted-red/15 active:scale-[0.98] block"
                  >
                    Become a Sponsor
                  </Link>
                </div>
              </div>

              {/* Speaker highlight glass panel */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900/40 to-black/20 rounded-2xl border border-gray-800/80 shadow-2xl relative overflow-hidden group hover:border-ted-red/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-ted-red/5 rounded-full blur-2xl group-hover:bg-ted-red/10 transition-colors pointer-events-none"></div>
                <span className="bg-red-500/10 text-ted-red px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block mb-3">Call to Speak</span>
                <h4 className="font-extrabold text-xl text-white">Join as a Speaker</h4>
                <p className="text-gray-400 text-sm mt-2 mb-5 leading-relaxed font-light">
                  Our core team is now recruited, but we actively accept speaker ideas and applications for future cycles.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/apply/speaker"
                    className="w-full bg-ted-red hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors text-center shadow-lg shadow-ted-red/15 active:scale-[0.98] block"
                  >
                    Apply to Speak
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==================== EXPLORE DOMAINS MIND-MAP ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-black via-gray-950/20 to-black py-24 border-t border-b border-gray-950 relative overflow-hidden"
        >
          <div className="container mx-auto px-6 lg:px-20 relative z-10">
            {/* Headers matching the picture */}
            <div className="mb-12 text-center">
              <span className="text-ted-red font-bold text-xs uppercase tracking-widest block mb-2">What We Do</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                <span className="text-ted-red font-black">TEDx</span><span className="font-light">KARE</span> is<span className="text-ted-red">...</span>
              </h2>
              <p className="text-gray-400 font-light text-base md:text-lg max-w-xl mx-auto">
                A living network of ideas, people, and possibilities.
              </p>
            </div>

            {/* Mind-map circular system */}
            <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[480px] mx-auto flex items-center justify-center mb-10">

              {/* Pulsing glow background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] bg-ted-red/10 rounded-full blur-[80px] animate-pulse"></div>
              </div>

              {/* Reactive Connectors Overlay (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 500">
                {radialNodes.map((node, index) => {
                  const angleRad = (node.angle * Math.PI) / 180;
                  const radius = 175; // percentage-style logic translated to SVG viewBox coordinates
                  const x2 = 250 + radius * Math.cos(angleRad);
                  const y2 = 250 + radius * Math.sin(angleRad);
                  const isHighlighted = activeNode === index;
                  return (
                    <line
                      key={index}
                      x1="250"
                      y1="250"
                      x2={x2}
                      y2={y2}
                      stroke={isHighlighted ? "#E62B1E" : "rgba(230, 43, 30, 0.15)"}
                      strokeWidth={isHighlighted ? "2.5" : "1"}
                      className="transition-all duration-300 ease-out"
                    />
                  );
                })}
              </svg>

              {/* Center Core sphere */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center z-20 border transition-all duration-500 shadow-2xl relative select-none bg-black/90 ${activeNode !== null
                  ? 'border-ted-red shadow-ted-red/30'
                  : 'border-red-950 shadow-red-950/20'
                  }`}
              >
                {/* Glowing ring overlay */}
                <div className={`absolute inset-[-8px] rounded-full border border-ted-red/10 transition-all duration-500 animate-ping ${activeNode !== null ? 'opacity-100 scale-105 border-ted-red/35' : 'opacity-0'
                  }`}></div>

                <span className="font-black text-xs sm:text-sm uppercase tracking-wider block leading-tight">
                  <span className="text-ted-red">TED</span><span className="text-white">x</span>
                </span>
                <span className="font-semibold text-gray-400 text-[9px] sm:text-[10px] tracking-widest uppercase block mt-0.5">
                  KARE
                </span>
              </motion.div>

              {/* Circularly Distributed Outer Nodes */}
              {radialNodes.map((node, index) => {
                const angleRad = (node.angle * Math.PI) / 180;
                // Position calculations in percentage
                const radiusPercent = 35; // 35% radius allows nodes to float safely inside container bounds
                const left = 50 + radiusPercent * Math.cos(angleRad);
                const top = 50 + radiusPercent * Math.sin(angleRad);
                const isHighlighted = activeNode === index;

                return (
                  <motion.div
                    key={index}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      x: "-50%",
                      y: "-50%",
                    }}
                    onMouseEnter={() => setActiveNode(index)}
                    onMouseLeave={() => setActiveNode(null)}
                    animate={{
                      scale: isHighlighted ? 1.15 : 1,
                      borderColor: isHighlighted ? "#E62B1E" : "rgba(31, 41, 55, 1)",
                    }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border flex items-center justify-center text-center px-1 sm:px-2 shadow-lg cursor-pointer z-10 ${isHighlighted
                      ? 'bg-black text-white shadow-ted-red/35'
                      : 'bg-black/90 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                  >
                    <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider leading-tight">
                      {node.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Capsules grid matching user's photo */}
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto mt-6 z-10 relative">
              {radialNodes.map((node, index) => {
                const isHighlighted = activeNode === index;
                return (
                  <button
                    key={index}
                    onMouseEnter={() => setActiveNode(index)}
                    onMouseLeave={() => setActiveNode(null)}
                    onClick={() => setActiveNode(index)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all active:scale-95 duration-200 ${isHighlighted
                      ? 'bg-ted-red border-ted-red text-white shadow-lg shadow-ted-red/20 scale-105'
                      : 'bg-gray-950/45 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ==================== UPCOMING EVENT SECTION ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 lg:px-20 py-24 border-b border-gray-950 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-ted-red/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

          <div className="text-center mb-16">
            <span className="text-ted-red font-bold text-xs uppercase tracking-widest block mb-2">Flagship Event</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Upcoming Event
            </h2>
            <p className="text-gray-400 font-light text-base md:text-lg max-w-xl mx-auto">
              Join us for an immersive experience of talks, performances, and networking.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col gap-8 group hover:border-ted-red/20 transition-all duration-500">
            {/* Top Row: Details */}
            <div className="space-y-6">
              <div>
                <span className="bg-ted-red/10 text-ted-red px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-3">
                  Flagship Event 2026
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  <span className="text-ted-red">TEDx</span><span className="font-light">KARE</span>
                </h3>
                <p className="text-gray-400 mt-2 font-medium">
                  Theme: <span className="text-white font-semibold">THE BIGBANG: Where Ideas Start</span>
                </p>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                THE BIGBANG: Where ideas Start represents the beginning of powerful ideas that can change people, industries, and the future. Every innovation, discovery, movement, and success starts from a single thought. This theme brings together diverse voices and ideas that inspire change, creativity, and new possibilities.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Entrepreneurship", "Science", "Universe", "Innovation", "Solutions", "Thinkers"].map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-950 border border-gray-900 text-gray-400 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Middle Row: Autoplaying Video Preview (rendered big) */}
            <a
              href="https://www.instagram.com/reel/DZAGVYqT_ko/?igsh=c3oxMDFhbXJoMTFy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-4xl mx-auto flex flex-col sm:relative sm:block rounded-2xl border border-gray-800 overflow-hidden group/video shadow-2xl bg-black cursor-pointer"
            >
              {/* Video Wrapper */}
              <div className="relative w-full aspect-video overflow-hidden">
                {/* Autoplaying Local Video / Poster Fallback */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <video
                    src="/videos/theme_promo.mp4"
                    poster="/images/event_teaser_poster.png"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Live Preview Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-ted-red text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-md shadow-md shadow-ted-red/20 flex items-center gap-1 animate-pulse z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Live Preview
                </div>

                {/* Center play icon overlay (only visible on hover/focus on desktop) */}
                <div className="absolute inset-0 bg-black/25 hover:bg-black/15 transition-colors duration-300 flex items-center justify-center z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-ted-red/90 group-hover/video:bg-ted-red flex items-center justify-center shadow-lg shadow-ted-red/30 transition-all duration-300 opacity-0 group-hover/video:opacity-100 transform scale-90 group-hover/video:scale-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-5 h-5 sm:w-7 sm:h-7 ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom text banner: absolute overlay on desktop, normal flow below video on mobile */}
              <div className="w-full text-left bg-black/90 sm:bg-black/75 sm:backdrop-blur-md p-3 sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:w-[calc(100%-2rem)] sm:rounded-xl border-t sm:border border-gray-800/80 group-hover/video:border-ted-red/35 transition-colors duration-300 z-20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[8px] sm:text-[9px] text-ted-red font-bold uppercase tracking-widest">Watch Full Theme Promo</p>
                    <p className="text-[10px] sm:text-xs text-gray-200 mt-0.5 font-medium">
                      <span className="font-bold">TEDx</span><span className="font-light">KARE</span> 2026: THE BIGBANG theme video
                    </p>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold bg-gray-900 border border-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap">
                    Instagram Reel ↗
                  </span>
                </div>
              </div>
            </a>

            {/* Bottom Row: Date, Venue, Countdown & Buttons */}
            <div className="space-y-6 border-t border-gray-900 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-gray-800 flex items-center justify-center text-ted-red">
                    📅
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Date & Time</p>
                    <p className="font-semibold text-gray-200 mt-0.5">Soon · June 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-gray-800 flex items-center justify-center text-ted-red">
                    📍
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Venue</p>
                    <p className="font-semibold text-gray-200 mt-0.5">Kalasalingam University</p>
                  </div>
                </div>
              </div>

              {/* Countdown clock */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Event Commencing In</p>
                <div className="grid grid-cols-4 gap-2 max-w-sm text-center">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hrs' },
                    { value: timeLeft.minutes, label: 'Min' },
                    { value: timeLeft.seconds, label: 'Sec' }
                  ].map((t, idx) => (
                    <div key={idx} className="bg-black/60 border border-gray-800/80 rounded-2xl p-2.5 shadow-inner">
                      <div className="text-xl md:text-2xl font-black text-ted-red tabular-nums">
                        {String(t.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 items-center">
                <button
                  onClick={() => setShowEventModal(true)}
                  className="px-6 py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-ted-red/15 active:scale-[0.98]"
                >
                  View Complete Schedule
                </button>
                <Link
                  to="/events"
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold rounded-lg text-sm transition-all duration-200 flex items-center gap-2 hover:border-gray-700"
                >
                  Explore All Events →
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==================== TESTIMONIALS ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 lg:px-20 py-24"
        >
          <div className="text-center mb-16">
            <span className="text-ted-red font-bold text-xs uppercase tracking-widest block mb-2">Impact</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Voices from Our Community</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "An energizing space to connect with peers and bring ideas to life.", author: "Asha", role: "Volunteer" },
              { text: "The speaker coaching helped me refine my message and reach more people.", author: "Raj", role: "Speaker" },
              { text: "Great production and community — I met collaborators I still work with.", author: "Thrivikram", role: "Organizer" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="p-6 bg-gray-900/30 border border-gray-800/80 rounded-2xl shadow-xl flex flex-col justify-between relative group hover:border-ted-red/30 transition-all duration-300"
              >
                <span className="text-ted-red text-4xl absolute top-3 left-4 opacity-10 group-hover:opacity-30 transition-opacity">“</span>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 italic z-10">"{item.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-900 pt-4">
                  <div className="w-8 h-8 rounded-full bg-ted-red/20 text-ted-red font-bold flex items-center justify-center text-xs">
                    {item.author[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{item.author}</h5>
                    <p className="text-gray-500 text-xs">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ==================== FAQ + NEWSLETTER ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-black to-gray-950/20 py-24 border-t border-gray-950"
        >
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid md:grid-cols-12 gap-12">
              {/* FAQ Accordions */}
              <div className="md:col-span-7">
                <div className="text-center md:text-left mb-8">
                  <span className="text-ted-red font-bold text-xs uppercase tracking-widest block mb-2">F.A.Q.</span>
                  <h3 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h3>
                </div>
                <div className="space-y-4">
                  {faqs.map((f, i) => {
                    const isOpen = openFAQ === i;
                    return (
                      <div
                        key={f.q}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-gray-900/30 border-ted-red/40' : 'bg-gray-900/10 border-gray-900 hover:border-gray-800'
                          }`}
                      >
                        <button
                          className="w-full text-left px-5 py-4 flex justify-between items-center font-bold text-white text-sm md:text-base"
                          onClick={() => setOpenFAQ(isOpen ? null : i)}
                        >
                          <span>{f.q}</span>
                          <span className={`text-ted-red transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-5 pt-1 text-gray-400 text-xs md:text-sm leading-relaxed border-t border-gray-950">
                                {f.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter */}
              <div className="md:col-span-5 flex flex-col justify-center">
                <div className="p-5 sm:p-8 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-ted-red/5 rounded-full blur-2xl pointer-events-none"></div>
                  <h3 className="text-2xl font-extrabold mb-2 text-white">Stay in the Loop</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Subscribe to our newsletters for early bird ticket releases, official scheduling, and recruitments.
                  </p>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      aria-label="Email Address"
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg bg-black border border-gray-800 text-sm focus:outline-none focus:border-ted-red focus:ring-1 focus:ring-ted-red transition-colors placeholder:text-gray-600"
                    />
                    <button className="w-full py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors shadow-lg shadow-ted-red/15 active:scale-[0.98]">
                      Subscribe Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==================== COMMUNITY IDEAS SANDBOX ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-black via-gray-950/20 to-black py-24 border-t border-gray-950"
        >
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid md:grid-cols-12 gap-12">

              {/* Left Side: Header & Submission Form */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="text-ted-red font-bold text-xs uppercase tracking-widest block mb-2">Brainstorm</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The Ideas Sandbox</h2>
                  <p className="text-gray-400 mt-2 font-light leading-relaxed">
                    TEDx is driven by curiosity. Share your spark of inspiration or look through ideas proposed by student innovators.
                  </p>
                </div>

                <div className="p-5 sm:p-6 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-ted-red/5 rounded-full blur-2xl pointer-events-none"></div>
                  <h4 className="font-extrabold text-lg text-white mb-4">Cast Your Idea</h4>

                  <form onSubmit={handleAddIdea} className="space-y-4">
                    <div>
                      <label htmlFor="idea-title" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Idea Title</label>
                      <input
                        id="idea-title"
                        type="text"
                        placeholder="e.g. Eco-Acoustic Campus Zones"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-sm focus:outline-none focus:border-ted-red focus:ring-1 focus:ring-ted-red transition-colors placeholder:text-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="idea-desc" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Short Description</label>
                      <textarea
                        id="idea-desc"
                        rows="3"
                        placeholder="Explain the idea and its impact worth spreading..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-sm focus:outline-none focus:border-ted-red focus:ring-1 focus:ring-ted-red transition-colors placeholder:text-gray-600 text-white resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="idea-cat" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                        <select
                          id="idea-cat"
                          value={newCat}
                          onChange={(e) => setNewCat(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-black border border-gray-800 text-sm focus:outline-none focus:border-ted-red transition-colors text-white"
                        >
                          {["Technology", "Sustainability", "Art & Design", "Society"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="idea-author" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Your Name</label>
                        <input
                          id="idea-author"
                          type="text"
                          placeholder="Anonymous"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-sm focus:outline-none focus:border-ted-red focus:ring-1 focus:ring-ted-red transition-colors placeholder:text-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors shadow-lg shadow-ted-red/15 active:scale-[0.98]">
                      Publish to Sandbox
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side: Scrollable Dynamic Board */}
              <div className="md:col-span-7 flex flex-col justify-start">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-extrabold text-lg text-white">Live Brainstorming Board</h4>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{ideas.length} Sparks Active</span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {ideas.map((idea) => (
                      <motion.div
                        key={idea._id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="p-5 bg-gray-900/30 border border-gray-900 rounded-xl hover:border-ted-red/40 transition-all duration-300 relative group flex flex-col justify-between"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-ted-red/10 border border-ted-red/20 text-ted-red text-[10px] font-bold uppercase tracking-wider mb-2">
                              {idea.cat}
                            </span>
                            <h5 className="font-extrabold text-base text-white">{idea.title}</h5>
                            <p className="text-gray-400 text-xs md:text-sm mt-1.5 leading-relaxed font-light">{idea.desc}</p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLike(idea._id)}
                            className="bg-gray-900/80 border border-gray-800 hover:border-ted-red/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs text-gray-400 hover:text-white"
                          >
                            <span>❤️</span>
                            <span className="font-bold tabular-nums text-gray-200">{idea.likes}</span>
                          </motion.button>
                        </div>

                        <div className="flex justify-between items-center mt-4 border-t border-gray-950 pt-3 text-[11px] text-gray-500 font-medium">
                          <span>Submitted by {idea.author}</span>
                          <span className="text-ted-red opacity-0 group-hover:opacity-100 transition-opacity font-bold">Idea Worth Spreading ✨</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* ==================== EVENTS INFO MODAL ==================== */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl shadow-red-900/30"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowEventModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-6">
                <span className="bg-ted-red/20 text-ted-red px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Upcoming Event Details
                </span>
                <h3 className="text-3xl font-extrabold mt-3 text-white">
                  <span className="text-ted-red">TEDx</span><span className="text-white font-light">KARE</span> Spring Summit
                </h3>
                <p className="text-gray-400 mt-1">
                  Theme: <span className="text-white font-semibold">Igniting Minds, Creating Impact</span>
                </p>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 border-t border-b border-gray-800 py-4 text-sm">
                <div>
                  <p className="text-gray-400">📅 Date & Time</p>
                  <p className="font-semibold text-gray-200 mt-1">June 12, 2026 · 04:00 PM IST</p>
                </div>
                <div>
                  <p className="text-gray-400">📍 Venue</p>
                  <p className="font-semibold text-gray-200 mt-1">Main Auditorium, KARE Campus</p>
                </div>
              </div>

              {/* About */}
              <div className="mb-6">
                <h4 className="font-bold text-lg text-white mb-2">About the Summit</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  Join us for an extraordinary evening of ideas worth spreading. The <span className="text-ted-red font-black">TEDx</span><span className="text-white font-light">KARE</span> Spring Summit features a curated lineup of thought leaders, student innovators, and changemakers sharing powerful insights across science, culture, technology, and leadership.
                </p>
              </div>

              {/* Schedule */}
              <div className="mb-8">
                <h4 className="font-bold text-lg text-white mb-3">Event Schedule</h4>
                <div className="space-y-3 text-sm">
                  {[
                    { time: '04:00 PM', title: 'Registration & Networking', desc: 'Pick up badges, interact with fellow attendees.' },
                    { time: '04:30 PM', title: 'Opening Ceremony', desc: 'Welcome address, introductory video, and cultural performace.' },
                    { time: '05:00 PM', title: 'TEDx Talks: Session 1', desc: 'Featured talks on technology, AI ethics, and student entrepreneurship.' },
                    { time: '06:15 PM', title: 'High-Tea & Interactions', desc: 'Interact with speakers, view innovation booths.' },
                    { time: '06:45 PM', title: 'TEDx Talks: Session 2', desc: 'Inspiring talks on social impact, education, and community growth.' },
                    { time: '08:00 PM', title: 'Closing Ceremony', desc: 'Organizer vote of thanks, photo sessions.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="text-ted-red font-bold whitespace-nowrap min-w-[70px]">{item.time}</div>
                      <div>
                        <div className="font-semibold text-gray-200">{item.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5 font-light">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="btn-primary flex-1 py-3 text-base font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Cinematic Splash Loading Screen */}
      <AnimatePresence>
        {loadingScreen && (

          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background ambient red glow */}
            <div className="absolute w-[300px] h-[300px] bg-ted-red/10 rounded-full blur-[80px] animate-pulse"></div>

            <div className="relative flex flex-col items-center gap-6 z-10">
              {/* Animated Curation Badge */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold"
              >
                Ideas Worth Spreading
              </motion.span>

              {/* Pulsing Logo - Falling and Bouncing X between TED and KARE */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-7xl tracking-tighter text-center flex items-center justify-center gap-1 select-none"
              >
                <span className="text-ted-red drop-shadow-[0_0_15px_rgba(235,0,40,0.2)] font-black">TED</span>
                <motion.span
                  initial={{ y: -100, scale: 0.1, opacity: 0, rotate: -180 }}
                  animate={{
                    y: [-100, 0, -70, 0, -40, 0, -15, 0],
                    x: [0, 0, -50, -90, 25, 45, 15, 0],
                    scale: [0.1, 0.35, 0.55, 0.75, 0.88, 0.96, 1.0, 1.0],
                    rotate: [-180, 0, -45, -90, 0, 45, 20, 0],
                    opacity: 1
                  }}
                  transition={{
                    duration: 2.2,
                    ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
                    times: [0, 0.25, 0.42, 0.58, 0.72, 0.84, 0.93, 1.0]
                  }}
                  className="text-ted-red drop-shadow-[0_0_15px_rgba(235,0,40,0.4)] inline-block origin-bottom font-black"
                >
                  x
                </motion.span>



                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] font-light">KARE</span>
              </motion.h1>

              {/* Sleek Progress Track */}
              <div className="w-48 h-[2px] bg-gray-900 rounded-full overflow-hidden mt-4 relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-ted-red to-red-500 shadow-[0_0_8px_rgba(235,0,40,0.6)]"
                />
              </div>


              {/* Loading percentage text */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] text-gray-500 font-mono"
              >
                Loading Portal...
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Home;
