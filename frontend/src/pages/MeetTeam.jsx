import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const teamMembers = [
  // Leadership & Core Sponsor
  {
    id: 1,
    name: 'Syed Ali Fathima',
    role: 'Faculty Sponsor',
    category: 'leadership',
    bio: 'Guiding the organising crew and facilitating institutional alignments.',
    linkedin: 'https://www.linkedin.com/in/syed-ali-fathima-b5884393/',
    image: '/images/team/extracted_p2_img30.jpeg',
    avatarSeed: 0,
    objectPosition: 'center 15%'
  },
  {
    id: 2,
    name: 'N. Thrivikram',
    role: 'Organiser & Licensee',
    category: 'leadership',
    bio: 'Fostering local campus innovation and leading the overall strategic vision.',
    linkedin: 'https://www.linkedin.com/in/thrivikram-n-3259a9324/',
    image: '/images/team/extracted_p3_img30.jpeg',
    avatarSeed: 1,
    objectPosition: 'center 22%'
  },
  {
    id: 3,
    name: 'Pulipaka Sanjana',
    role: 'Executive Producer',
    category: 'leadership',
    bio: 'Directing structural event logistics, timeline pacing, and operational pipelines.',
    linkedin: 'https://www.linkedin.com/in/pulipakasanjana/',
    image: '/images/team/extracted_p3_img31.jpeg',
    avatarSeed: 2,
    objectPosition: 'center 15%'
  },

  // Design & Tech
  {
    id: 4,
    name: 'Hrishob Pal',
    role: 'Web Developer',
    category: 'tech',
    bio: 'Architecting secure web components, managing codebase hosting, and visual flows.',
    linkedin: 'https://www.linkedin.com/in/hrishob-pal/',
    github: 'https://github.com/hrishob0108',
    image: '/images/team/extracted_p9_img31.jpeg',
    avatarSeed: 4,
    objectPosition: 'center 26%'
  },
  {
    id: 5,
    name: 'Bagi Venkat Reddy',
    role: 'Designer Lead',
    category: 'design',
    bio: 'Creating premium visual assets, layout grids, and core digital designs.',
    linkedin: 'http://www.linkedin.com/in/venkat-reddy-65511431b',
    image: '/images/team/extracted_p8_img32.jpeg',
    avatarSeed: 3,
    objectPosition: 'center 15%'
  },
  {
    id: 6,
    name: 'Kaki Kushal Kumar',
    role: 'Designing Team',
    category: 'design',
    bio: 'Developing high-fidelity graphics, event booklets, and visual identities.',
    linkedin: 'https://www.linkedin.com/in/k-kushal-kumar-5a69a7398?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p8_img34.png',
    avatarSeed: 5,
    objectPosition: 'center 18%'
  },
  {
    id: 7,
    name: 'Tati Manasa Durga',
    role: 'Designing Team',
    category: 'design',
    bio: 'Styling promotional layouts and sculpting unified visual theme styles.',
    linkedin: 'https://www.linkedin.com/in/tati-manasa-durga-naidu-472013381',
    image: '/images/team/extracted_p8_img35.png',
    avatarSeed: 6,
    objectPosition: 'center 10%'
  },
  {
    id: 8,
    name: 'Gorrolla Reddy Sekhar',
    role: 'Designing Team',
    category: 'design',
    bio: 'Illustrating immersive backdrops and graphic marketing templates.',
    linkedin: 'https://www.linkedin.com/in/gorrolla-reddy-sekhar-53a171339?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p8_img33.jpeg',
    avatarSeed: 7,
    objectPosition: 'center 18%'
  },

  // Selection & Research (Curation)
  {
    id: 9,
    name: 'Anantha Chowhitha',
    role: 'Selection Committee & Research Head',
    category: 'curation',
    bio: 'Coaching speakers, refining abstract pitches, and auditing talk content.',
    linkedin: 'https://www.linkedin.com/in/chowhitha-anantha',
    image: '/images/team/extracted_p10_img61.jpeg',
    avatarSeed: 8,
    objectPosition: 'center 9%'
  },
  {
    id: 10,
    name: 'Sabari Vasan N',
    role: 'Selection Committee & Research Team',
    category: 'curation',
    bio: 'Evaluating speaker backgrounds and researching deep impactful local ideas.',
    linkedin: 'https://www.linkedin.com/in/sabarivasan2308',
    image: '/images/team/extracted_p10_img62.jpeg',
    avatarSeed: 9,
    objectPosition: 'center 48%'
  },
  {
    id: 11,
    name: 'Kamalaa Sri M',
    role: 'Selection Committee & Research Team',
    category: 'curation',
    bio: 'Coaching speakers on pitch timing, vocal ranges, and narrative structures.',
    linkedin: 'https://www.linkedin.com/in/kamalaa-sri-m-7795a1288?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p10_img63.jpeg',
    avatarSeed: 10,
    objectPosition: 'center 30%'
  },
  {
    id: 12,
    name: 'Vangala Jaya Sai Kumar Reddy',
    role: 'Selection Committee & Research Team',
    category: 'curation',
    bio: 'Identifying subject matters and mapping innovative student proposal categories.',
    linkedin: 'https://www.linkedin.com/in/vjayasaikumarreddy/',
    image: '/images/team/extracted_p10_img64.jpeg',
    avatarSeed: 11,
    objectPosition: 'center 42%'
  },

  // Production & Events (Events, Video, Sponsorship)
  {
    id: 13,
    name: 'Charan Tej U',
    role: 'Event Manager',
    category: 'events',
    bio: 'Coordinating physically structured venue layouts, stage directions, and AV cues.',
    linkedin: 'https://www.linkedin.com/in/charanteju2007',
    image: '/images/team/extracted_p7_img31.jpeg',
    avatarSeed: 12,
    objectPosition: 'center 22%'
  },
  {
    id: 14,
    name: 'Thokala charith sai',
    role: 'Asst. Event Manager',
    category: 'events',
    bio: 'Orchestrating volunteer positions and staging schedules during event shifts.',
    linkedin: 'https://www.linkedin.com/in/thokala-charith-sai-a18261319/',
    image: '/images/team/extracted_p7_img32.jpeg',
    avatarSeed: 13,
    objectPosition: 'center 18%'
  },
  {
    id: 15,
    name: 'Nicepreet Kour',
    role: 'Event Management Team',
    category: 'events',
    bio: 'Directing audience coordinates and securing smooth physical entries.',
    linkedin: 'https://linkedin.com',
    image: '/images/team/extracted_p7_img33.jpeg',
    avatarSeed: 14,
    objectPosition: 'center 15%'
  },
  {
    id: 16,
    name: 'Megham Naga Venkata Brundha',
    role: 'Event Management Team',
    category: 'events',
    bio: 'Supporting volunteer directories and stagecraft logistics management.',
    linkedin: 'https://www.linkedin.com/in/megham-brundha-2012083ba?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    image: '/images/team/extracted_p7_img34.png',
    avatarSeed: 15,
    objectPosition: 'center 15%'
  },
  {
    id: 17,
    name: 'Jegatheesan Baskar',
    role: 'Video Production Manager',
    category: 'production',
    bio: 'Supervising camera arrays, multi-track audio recordings, and visual post-production.',
    linkedin: 'https://www.linkedin.com/in/j-baskar8055?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p6_img31.png',
    avatarSeed: 16,
    objectPosition: 'center 18%'
  },
  {
    id: 18,
    name: 'Saravana kannan A',
    role: 'Asst. Video Production Manager',
    category: 'production',
    bio: 'Facilitating sound mixing, spotlight integrations, and local AV checks.',
    linkedin: 'https://linkedin.com',
    image: '/images/team/extracted_p6_img32.png',
    avatarSeed: 17,
    objectPosition: 'center 18%'
  },
  {
    id: 19,
    name: 'Chilakala Sadiq Vali',
    role: 'Video Production Team',
    category: 'production',
    bio: 'Editing cinematic trailer reels and archiving stage documentation.',
    linkedin: 'https://www.linkedin.com/in/sadiq-vali-chilakala-a389aa346?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p6_img35.png',
    avatarSeed: 18,
    objectPosition: 'center 18%'
  },
  {
    id: 20,
    name: 'M. Manoj Kumar',
    role: 'Video Production Team',
    category: 'production',
    bio: 'Operating video captures and managing broadcast streams of talks.',
    linkedin: 'https://linkedin.com',
    image: '/images/team/extracted_p6_img34.jpeg',
    avatarSeed: 19,
    objectPosition: 'center 42%'
  },
  {
    id: 21,
    name: 'Ediga Srinath Goud',
    role: 'Video Production Team',
    category: 'production',
    bio: 'Assisting in camera stabilization and on-floor video capture coordination.',
    linkedin: 'https://www.linkedin.com/in/ediga-srinath-goud-a745642a7?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p6_img33.jpeg',
    avatarSeed: 20,
    objectPosition: 'center 24%'
  },
  {
    id: 22,
    name: 'Kowsykha Saravanakumar',
    role: 'Sponsorship & Budget Manager',
    category: 'sponsorship',
    bio: 'Handling partnership contracts, structural funds, and corporate outreach.',
    linkedin: 'https://www.linkedin.com/in/kowsykha-saravanakumar',
    image: '/images/team/extracted_p11_img31.jpeg',
    avatarSeed: 21,
    objectPosition: 'center 22%'
  },
  {
    id: 23,
    name: 'Russell S',
    role: 'Sponsorship & Budget Team',
    category: 'sponsorship',
    bio: 'Evaluating sponsor packages and auditing structural team allocations.',
    linkedin: 'https://www.linkedin.com/in/russell-s-313a813a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    image: '/images/team/extracted_p11_img32.jpeg',
    avatarSeed: 22,
    objectPosition: 'center 30%'
  },

  // Marketing & PR
  {
    id: 24,
    name: 'Sunkara Nagajayanth',
    role: 'Communication & Marketing Director',
    category: 'marketing',
    bio: 'Commanding brand communications, local media releases, and target metrics.',
    linkedin: 'https://www.linkedin.com/in/sunkara-nagajayanth-54608b359?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p5_img31.jpeg',
    avatarSeed: 23,
    objectPosition: 'center 42%'
  },
  {
    id: 25,
    name: 'Omika Tiwari D',
    role: 'Communication & Marketing Team',
    category: 'marketing',
    bio: 'Drafting announcement feeds and directing local campus public relations.',
    linkedin: 'https://www.linkedin.com/in/omika-tiwari',
    image: '/images/team/extracted_p5_img32.jpeg',
    avatarSeed: 24,
    objectPosition: 'center 25%'
  },
  {
    id: 26,
    name: 'Jenitta Angelin N',
    role: 'Communication & Marketing Team',
    category: 'marketing',
    bio: 'Crafting digital newsletters and running our active student outreach.',
    linkedin: 'https://linkedin.com',
    image: '/images/team/extracted_p5_img33.png',
    avatarSeed: 25,
    objectPosition: 'center 40%'
  },
  {
    id: 27,
    name: 'Sunku Reddy Ananya Sree',
    role: 'Communication & Marketing Team',
    category: 'marketing',
    bio: 'Managing community interactions and coordinating marketing cycles.',
    linkedin: 'https://www.linkedin.com/in/sunku-reddy-ananya-sree-496a3428b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    image: '/images/team/extracted_p5_img34.png',
    avatarSeed: 26,
    objectPosition: 'center 18%'
  }
];

const TeamAvatar = ({ category, seed }) => {
  // Unique geometric premium gradients based on category
  const gradientId = `avatar-grad-${seed}`;
  
  // Custom abstract path shapes for different categories
  const getShapes = () => {
    switch (category) {
      case 'leadership':
        return (
          <>
            <circle cx="50" cy="50" r="30" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" className="animate-pulse" />
            <circle cx="50" cy="50" r="20" fill={`url(#${gradientId})`} opacity="0.3" />
            <line x1="50" y1="10" x2="50" y2="90" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="3 3" />
            <line x1="10" y1="50" x2="90" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="3 3" />
          </>
        );
      case 'curation':
        return (
          <>
            <polygon points="50,15 85,75 15,75" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="10" fill={`url(#${gradientId})`} />
            <circle cx="50" cy="50" r="25" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="4 2" />
          </>
        );
      case 'tech':
        return (
          <>
            <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="15" fill={`url(#${gradientId})`} opacity="0.4" />
            <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke={`url(#${gradientId})`} strokeWidth="0.8" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
          </>
        );
      case 'design':
        return (
          <>
            <path d="M 30,50 A 20,20 0 1,0 70,50 A 20,20 0 1,0 30,50" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
            <path d="M 50,30 A 20,20 0 1,0 50,70 A 20,20 0 1,0 50,30" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="8" fill={`url(#${gradientId})`} opacity="0.4" />
          </>
        );
      case 'production':
        return (
          <>
            <polygon points="50,15 15,50 50,85 85,50" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="12" fill={`url(#${gradientId})`} opacity="0.35" />
            <circle cx="50" cy="50" r="22" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="3 3" />
          </>
        );
      case 'events':
        return (
          <>
            <polygon points="50,12 88,31 88,69 50,88 12,69 12,31" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="10" fill={`url(#${gradientId})`} opacity="0.3" />
            <circle cx="50" cy="50" r="22" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="3 3" />
          </>
        );
      case 'sponsorship':
        return (
          <>
            <circle cx="50" cy="50" r="28" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
            <rect x="36" y="36" width="28" height="28" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="8" fill={`url(#${gradientId})`} />
          </>
        );
      case 'marketing':
      default:
        return (
          <>
            <path d="M 50 15 A 35 35 0 1 1 49.9 15" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" strokeDasharray="5 3" />
            <polygon points="50,25 70,65 30,65" fill={`url(#${gradientId})`} opacity="0.35" />
            <circle cx="50" cy="50" r="8" fill={`url(#${gradientId})`} />
          </>
        );
    }
  };

  const getGradients = () => {
    switch (category) {
      case 'leadership':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#FFA07A" />
          </linearGradient>
        );
      case 'curation':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF4500" />
          </linearGradient>
        );
      case 'tech':
        return (
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#990000" />
          </linearGradient>
        );
      case 'design':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
        );
      case 'production':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#DC143C" />
          </linearGradient>
        );
      case 'events':
        return (
          <linearGradient id={gradientId} x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#FF6347" />
          </linearGradient>
        );
      case 'sponsorship':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        );
      case 'marketing':
      default:
        return (
          <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E62B1E" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
        );
    }
  };

  return (
    <svg className="w-full h-full p-4 text-ted-red transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {getGradients()}
      </defs>
      <circle cx="50" cy="50" r="45" fill="rgba(230, 43, 30, 0.02)" stroke="rgba(230, 43, 30, 0.08)" strokeWidth="1" />
      {getShapes()}
    </svg>
  );
};

const MeetTeam = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Organizers' },
    { id: 'leadership', label: 'Core Leadership' },
    { id: 'tech', label: 'Web Developers' },
    { id: 'design', label: 'Designing Team' },
    { id: 'curation', label: 'Selection & Research' },
    { id: 'production', label: 'Production Team' },
    { id: 'events', label: 'Event Management Team' },
    { id: 'sponsorship', label: 'Sponsorship & Budget Team' },
    { id: 'marketing', label: 'Marketing & Communication Team' },
  ];

  const filteredMembers = activeTab === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.category === activeTab);

  // Staggered Container variants
  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04, // Slightly faster stagger for 27 cards
      }
    }
  };

  // Profile Card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 90, 
        damping: 15 
      } 
    },
    exit: { opacity: 0, scale: 0.94, transition: { duration: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ted-red selection:text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-ted-red/10 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* Main Content container */}
      <main className="flex-grow pt-32 pb-24 px-6 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-ted-red font-bold text-xs uppercase tracking-widest block">Organizing Crew</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Meet Our <span className="bg-gradient-to-r from-ted-red via-red-500 to-red-600 bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              The curators, designers, videographers, sponsors, and event managers shaping the stage for KARE.
            </p>
          </div>

          {/* Filtering Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all active:scale-95 duration-200 ${
                  activeTab === tab.id
                    ? 'bg-ted-red border-ted-red text-white shadow-lg shadow-ted-red/20'
                    : 'bg-gray-950/45 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Staggered Grid Presentation */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={{ y: -6 }}
                  className="p-5 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-2xl shadow-xl flex flex-col justify-between relative group hover:border-ted-red/30 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                >
                  {/* Subtle hover gradient flare */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-ted-red/5 rounded-full blur-2xl group-hover:bg-ted-red/10 transition-colors pointer-events-none"></div>

                  <div>
                    {/* Member Photo or Abstract Fallback */}
                    <div className="aspect-square w-full bg-black/60 border border-gray-800/60 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group shadow-inner">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          style={{ objectPosition: member.objectPosition || 'center' }}
                          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 grayscale rounded-lg ${
                            member.name === 'Hrishob Pal' ? 'group-hover:grayscale' : 'group-hover:grayscale-0'
                          }`}
                        />
                      ) : (
                        <TeamAvatar category={member.category} seed={member.avatarSeed} />
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-ted-red/10 border border-ted-red/20 text-ted-red text-[9px] font-bold uppercase tracking-wider">
                        {member.role}
                      </span>
                      <h4 className="font-extrabold text-lg text-white group-hover:text-ted-red transition-colors duration-300">
                        {member.name}
                      </h4>
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed font-light">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Social links row */}
                  <div className="flex items-center gap-3 border-t border-gray-900 pt-4 mt-6">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-gray-950 border border-gray-800/80 text-gray-500 hover:text-white hover:border-ted-red hover:bg-ted-red/10 flex items-center justify-center transition-all duration-200"
                      title={`${member.name}'s LinkedIn`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-gray-950 border border-gray-800/80 text-gray-500 hover:text-white hover:border-ted-red hover:bg-ted-red/10 flex items-center justify-center transition-all duration-200"
                        title={`${member.name}'s GitHub`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-gray-950 border border-gray-800/80 text-gray-500 hover:text-white hover:border-ted-red hover:bg-ted-red/10 flex items-center justify-center transition-all duration-200"
                        title={`${member.name}'s Twitter`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Join standard CTA at bottom */}
          <div className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-gray-900/40 to-black/20 border border-gray-800/80 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden group hover:border-ted-red/20 transition-all duration-300">
            <div className="absolute top-0 left-0 w-32 h-32 bg-ted-red/5 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">Want to Shape the Stage?</h3>
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed font-light">
              We are actively looking for passionate student designers, developers, videographers, and coordinators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-lg text-sm transition-all duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/team-recruitment')}
                className="w-full sm:w-auto px-6 py-3 bg-ted-red hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-ted-red/15"
              >
                Join the Team
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MeetTeam;
