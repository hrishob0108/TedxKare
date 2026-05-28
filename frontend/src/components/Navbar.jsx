import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const helpRef = useRef(null);
  const helpButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isHelpOpen) return;
      if (helpRef.current && !helpRef.current.contains(e.target) && !helpButtonRef.current.contains(e.target)) {
        setIsHelpOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') setIsHelpOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isHelpOpen]);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const isTeamPage = location.pathname.startsWith('/team-recruitment');
  const isSpeakerPage = location.pathname.startsWith('/apply/speaker');
  const isMeetTeamPage = location.pathname.startsWith('/meet-team');
  const isEventsPage = location.pathname.startsWith('/events');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container-flex w-full flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} aria-label="Home" className="flex items-center">
            <h1 className="text-lg sm:text-2xl font-bold"><span className="text-ted-red">TEDx</span><span className="text-white">KARE</span></h1>
          </button>
        </div>

        {/* Desktop links */}
        <div className="nav-desktop-links items-center gap-3">
          {!isHome && (
            <NavLink to="/" className="btn-secondary text-sm px-3 py-2">Home</NavLink>
          )}
          {!isSpeakerPage && (
            <NavLink to="/apply/speaker" className="btn-secondary text-sm px-3 py-2">Join as Speaker</NavLink>
          )}
           {!isEventsPage && (
            <NavLink to="/events" className="btn-secondary text-sm px-3 py-2">Events</NavLink>
          )}
          {!isMeetTeamPage && (
            <NavLink to="/meet-team" className="btn-secondary text-sm px-3 py-2">Meet Our Team</NavLink>
          )}
          
          {!isTeamPage && (
            <NavLink to="/team-recruitment" className="btn-secondary text-sm px-3 py-2">Join Team</NavLink>
          )}
          <button ref={helpButtonRef} onClick={() => setIsHelpOpen((s) => !s)} aria-expanded={isHelpOpen} aria-controls="help-popup" className="btn-primary text-sm">Help</button>

          {isHelpOpen && (
            <div id="help-popup" ref={helpRef} role="dialog" aria-label="Contact support" className="absolute right-4 top-full mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-4 w-72 z-60">
              <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                <p className="text-white font-semibold text-sm">Contact Support</p>
                <button onClick={() => setIsHelpOpen(false)} className="text-gray-400 hover:text-white transition-colors">×</button>
              </div>
              <div className="space-y-1 text-sm">
                <a href="tel:+918978442820" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <p className="text-gray-300 font-medium">Hrishob Pal</p>
                  <p className="text-gray-400">+91 89784 42820</p>
                </a>
                <a href="tel:+919490464582" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <p className="text-gray-300 font-medium">Trivikram</p>
                  <p className="text-gray-400">+91 94904 64582</p>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="nav-mobile-toggle items-center">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 rounded-md border border-gray-700 bg-gray-950/80 hover:bg-gray-900 transition-all flex items-center justify-center text-white"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="nav-mobile-overlay absolute top-full left-0 right-0 bg-black/95 z-50 border-t border-gray-800">
          <div className="p-4 space-y-3">
            {!isHome && (
              <NavLink to="/" onClick={() => setMobileOpen(false)} className="block text-lg font-medium">Home</NavLink>
            )}
            {!isMeetTeamPage && (
              <NavLink to="/meet-team" onClick={() => setMobileOpen(false)} className="block text-lg font-medium">Meet Our Team</NavLink>
            )}
            {!isEventsPage && (
              <NavLink to="/events" onClick={() => setMobileOpen(false)} className="block text-lg font-medium">Events</NavLink>
            )}
            {!isSpeakerPage && (
              <NavLink to="/apply/speaker" onClick={() => setMobileOpen(false)} className="block text-lg font-medium">Join as Speaker</NavLink>
            )}
            {!isTeamPage && (
              <NavLink to="/team-recruitment" onClick={() => setMobileOpen(false)} className="block text-lg font-medium">Join Team</NavLink>
            )}
            <button onClick={() => { setIsHelpOpen((s) => !s); }} className="block btn-primary w-full text-left">Help</button>

            {isHelpOpen && (
              <div className="mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-inner p-3">
                <div className="space-y-1 text-sm">
                  <a href="tel:+918978442820" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <p className="text-gray-300 font-medium">Hrishob Pal</p>
                    <p className="text-gray-400">+91 89784 42820</p>
                  </a>
                  <a href="tel:+919490464582" className="block p-2 -mx-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <p className="text-gray-300 font-medium">Trivikram</p>
                    <p className="text-gray-400">+91 94904 64582</p>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
