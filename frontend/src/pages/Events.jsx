import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [openPastEvent, setOpenPastEvent] = useState(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  const upcomingEvent = {
    title: <><span className="text-ted-red">TEDx</span><span className="font-light">KARE</span> 2026</>,
    theme: 'THE BIGBANG: Where Ideas Start',
    date: 'Soon (June 2026)',
    time: 'TBA',
    venue: 'Kalasalingam University',
    description: 'THE BIGBANG: Where ideas Start represents the beginning of powerful ideas that can change people, industries, and the future. Every innovation, discovery, movement, and success starts from a single thought. This theme brings together diverse voices and ideas that inspire change, creativity, and new possibilities. Credits: Thrivikram',
    schedule: [
      { time: '04:00 PM', title: 'Registration & Networking', desc: 'Pick up badges, interact with fellow attendees, and explore interactive innovation exhibits.' },
      { time: '04:30 PM', title: 'Opening Ceremony', desc: 'Welcome address, introductory cinematic theme release, and a live fusion performance.' },
      { time: '05:00 PM', title: 'TEDx Talks: Session 1', desc: 'Engaging presentations on neural architecture, ethical machine learning, and clean energy innovation.' },
      { time: '06:15 PM', title: 'High-Tea & Interactive Lounge', desc: 'Exclusive speaker meet-and-greets, feedback tables, and collaborative idea spaces.' },
      { time: '06:45 PM', title: 'TEDx Talks: Session 2', desc: 'Immersive talks on sustainable urban planning, decolonizing art, and grassroots leadership.' },
      { time: '08:00 PM', title: 'Closing Ceremony & Photo Session', desc: 'Vote of thanks from the organizing crew, volunteer accolades, and group photography.' }
    ],
    speakers: [
      { name: 'Dr. Aris Thorne', role: 'Cognitive Neuroscientist', bio: 'Pioneering research in brain-computer interfaces to restore motor control and decode sensory patterns.' },
      { name: 'Meera Deshmukh', role: 'Climate Adaptation Architect', bio: 'Designing resilient local infrastructure that leverages classical water harvesting to naturally cool urban areas.' },
      { name: 'Aditya Sen', role: 'AI Ethics & Policy Advocate', bio: 'Shaping international frameworks to protect data privacy and ensure algorithms serve human rights.' },
      { name: 'Riya Kapoor', role: 'Student Innovator & Founder', bio: 'Creating circular economy food packaging from marine organic waste, scaling it across campus.' }
    ]
  };

  const pastEvents = [
    {
      id: '2025',
      title: <><span className="text-ted-red">TEDx</span><span className="font-light">KARE</span> 2025: Breaking Barriers</>,
      date: 'November 15, 2025',
      venue: 'Sleek Mini Hall, KARE Campus',
      stats: { talks: 6, attendees: '420+', views: '55k+' },
      description: 'An inspiring day dedicated to dismantling cognitive bias, societal barriers, and structural technical bottlenecks that restrict community growth. Speakers explored paths to open-access scientific publication, assistive technologies, and inclusive leadership models.',
      highlights: ['6 Inspiring local speakers', 'Full-house physical attendance', 'Immersive VR art installation in the lobby']
    },
    {
      id: '2024',
      title: <><span className="text-ted-red">TEDx</span><span className="font-light">KARE</span> 2024: The Next Frontier</>,
      date: 'April 10, 2024',
      venue: 'Main Auditorium, KARE Campus',
      stats: { talks: 8, attendees: '380+', views: '82k+' },
      description: 'Our inaugural event focusing on upcoming breakthroughs in deep-tech, commercial aerospace progress, quantum computational models, and bio-inspired materials that will redefine how we live, build, and connect.',
      highlights: ['8 High-profile guest talks', 'Industry partner roundtables', 'Live streaming to 10+ campuses']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ted-red selection:text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-ted-red/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Main Content container */}
      <main className="flex-grow pt-32 pb-24 px-6 lg:px-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-ted-red font-bold text-xs uppercase tracking-widest block">TEDx<span className="font-light">KARE</span> Events</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Ideas in <span className="bg-gradient-to-r from-ted-red via-red-500 to-red-600 bg-clip-text text-transparent">Action</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              Explore our upcoming flagship summits, interactive sessions, and the rich legacy of ideas worth spreading.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-4 mb-12 border-b border-gray-900 pb-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-6 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all relative ${activeTab === 'upcoming'
                  ? 'border-ted-red text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
            >
              Upcoming Event
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 px-6 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all relative ${activeTab === 'past'
                  ? 'border-ted-red text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
            >
              Past Events Archive
            </button>
          </div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              <motion.div
                key="upcoming-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* Upcoming Big Banner Card */}
                <div className="bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden hover:border-ted-red/20 transition-all duration-500 flex flex-col gap-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ted-red/5 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Top Row: Details */}
                  <div className="space-y-6">
                    <div>
                      <span className="bg-ted-red/10 text-ted-red px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-3">
                        Spring Summit 2026
                      </span>
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        {upcomingEvent.title}
                      </h2>
                      <p className="text-gray-400 mt-2 font-medium text-base">
                        Theme: <span className="text-white font-semibold">{upcomingEvent.theme}</span>
                      </p>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                      {upcomingEvent.description}
                    </p>
                  </div>

                  {/* Middle Row: Autoplaying Video Preview (rendered big) */}
                  <div className="w-full max-w-4xl mx-auto aspect-video rounded-2xl border border-gray-800 overflow-hidden relative group/teaser bg-black shadow-2xl">
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

                    {/* Clickable Overlay Link to Instagram Reel */}
                    <a
                      href="https://www.instagram.com/reel/DZAGVYqT_ko/?igsh=c3oxMDFhbXJoMTFy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/35 hover:bg-black/25 transition-colors duration-300 flex flex-col justify-between p-4 cursor-pointer z-10"
                    >
                      {/* Top Badge */}
                      <div className="self-end px-2.5 py-1 bg-ted-red text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-md shadow-ted-red/20 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        Live Preview
                      </div>

                      {/* Center play icon overlay */}
                      <div className="self-center w-14 h-14 rounded-full bg-ted-red/90 group-hover/teaser:bg-ted-red flex items-center justify-center shadow-lg shadow-ted-red/30 transition-all duration-300 opacity-0 group-hover/teaser:opacity-100 transform scale-90 group-hover/teaser:scale-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="w-7 h-7 ml-0.5"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      {/* Bottom text banner */}
                      <div className="w-full text-left bg-black/75 backdrop-blur-md p-3 rounded-xl border border-gray-800/80 group-hover/teaser:border-ted-red/35 transition-colors duration-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[9px] text-ted-red font-bold uppercase tracking-widest">Watch Full Theme Promo</p>
                            <p className="text-xs text-gray-200 mt-0.5 font-medium"><span className="font-bold">TEDx</span><span className="font-light">KARE</span> 2026: THE BIGBANG theme video</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-900 border border-gray-800 px-2 py-1 rounded">
                            Instagram Reel ↗
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Bottom Row: Date, Venue & Countdown */}
                  <div className="space-y-6 border-t border-gray-900 pt-6">
                    {/* Event location and time block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📅</span>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Date & Time</p>
                          <p className="font-semibold text-gray-200 mt-0.5">{upcomingEvent.date} · {upcomingEvent.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📍</span>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Venue</p>
                          <p className="font-semibold text-gray-200 mt-0.5">{upcomingEvent.venue}</p>
                        </div>
                      </div>
                    </div>

                    {/* Countdown Widget */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Tickets Releasing In</p>
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
                  </div>
                </div>

                {/* Speaker Lineup */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Featured Speaker Panels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingEvent.speakers.map((speaker, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-gray-900/30 to-black/20 border border-gray-800/80 rounded-2xl shadow-xl flex gap-4 hover:border-ted-red/30 transition-all duration-300">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-ted-red/10 border border-ted-red/20 text-ted-red font-bold flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-ted-red/10 border border-ted-red/20 text-ted-red text-[9px] font-bold uppercase tracking-wider">
                            {speaker.role}
                          </span>
                          <h4 className="font-extrabold text-lg text-white">{speaker.name}</h4>
                          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Timeline / Schedule */}
                <div className="p-6 md:p-8 bg-gray-950/40 border border-gray-900 rounded-3xl">
                  <h3 className="text-2xl font-extrabold text-white mb-6">Summit Schedule</h3>
                  <div className="relative border-l border-gray-800 ml-4 md:ml-6 space-y-8">
                    {upcomingEvent.schedule.map((item, idx) => (
                      <div key={idx} className="relative pl-6 md:pl-8">
                        {/* Timeline Bullet Node */}
                        <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border border-ted-red bg-black flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-ted-red"></span>
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <span className="text-ted-red font-extrabold text-sm whitespace-nowrap bg-ted-red/5 border border-ted-red/10 px-2 py-0.5 rounded-lg w-fit">
                            {item.time}
                          </span>
                          <h4 className="font-extrabold text-base text-gray-200">{item.title}</h4>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2 font-light leading-relaxed max-w-3xl">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="past-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map((evt) => {
                    const isOpen = openPastEvent === evt.id;
                    return (
                      <div
                        key={evt.id}
                        className={`p-6 bg-gradient-to-br from-gray-900/40 to-black/20 border rounded-2xl shadow-xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden group ${isOpen ? 'border-ted-red/40 bg-gray-900/10' : 'border-gray-800/80 hover:border-gray-700'
                          }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                              <span className="text-ted-red text-xs font-bold uppercase tracking-wider block mb-1">
                                {evt.date}
                              </span>
                              <h3 className="font-extrabold text-xl text-white group-hover:text-ted-red transition-colors duration-300">
                                {evt.title}
                              </h3>
                            </div>
                            <span className="bg-gray-950/80 border border-gray-800 text-[10px] text-gray-400 font-bold px-2 py-1 rounded-lg uppercase whitespace-nowrap">
                              {evt.id} Cycle
                            </span>
                          </div>

                          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light mb-6">
                            {evt.description}
                          </p>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 text-center bg-black/45 border border-gray-900 rounded-xl p-3 mb-6">
                            <div>
                              <div className="text-base font-extrabold text-white">{evt.stats.talks}</div>
                              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Talks</div>
                            </div>
                            <div>
                              <div className="text-base font-extrabold text-white">{evt.stats.attendees}</div>
                              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Attendees</div>
                            </div>
                            <div>
                              <div className="text-base font-extrabold text-white">{evt.stats.views}</div>
                              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Views</div>
                            </div>
                          </div>

                          {/* Collapsible details */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden border-t border-gray-800 mt-4 pt-4 space-y-3"
                              >
                                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Key Highlights</h4>
                                <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside font-light">
                                  {evt.highlights.map((h, i) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                                <p className="text-[10px] text-gray-500 mt-2 italic">
                                  Talk video recordings are uploaded to the global TEDx YouTube Channel.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={() => setOpenPastEvent(isOpen ? null : evt.id)}
                          className="w-full text-center text-xs font-bold uppercase tracking-wider py-2 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors mt-4 text-ted-red flex items-center justify-center gap-1.5"
                        >
                          {isOpen ? 'Hide Highlights ▲' : 'Show Details & Highlights ▼'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sponsorship CTA Box */}
          <div className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden group hover:border-ted-red/20 transition-all duration-300">
            <div className="absolute top-0 left-0 w-32 h-32 bg-ted-red/5 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">Partner with <span className="text-ted-red font-extrabold">TEDx</span><span className="font-light">KARE</span></h3>
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed font-light">
              Are you a local business or corporate sponsor? Join us in celebrating ideas worth spreading and connect with our massive audience of student changemakers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-lg text-sm transition-all duration-200"
              >
                Back to Home
              </button>
              <Link
                to="/sponsor"
                className="w-full sm:w-auto px-6 py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-ted-red/15 active:scale-[0.98] flex items-center justify-center"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Events;
