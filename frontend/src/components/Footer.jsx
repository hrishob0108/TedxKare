import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/95 border-t border-gray-900 text-gray-400 font-sans mt-20 relative z-10">
      <div className="container mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-2xl tracking-tight text-white flex items-center">
              <span className="text-ted-red font-black">TEDx</span>
              <span className="font-light">KARE</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Bringing student innovators, changemakers, and local thinkers onto a shared platform to showcase ideas that inspire the world.
            </p>
            <div className="text-xs text-gray-500 font-medium">
              ✨ Founding Cycle 2026
            </div>
          </div>

          {/* Navigation Links Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-ted-red transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-ted-red transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/meet-team" className="hover:text-ted-red transition-colors duration-200">
                  Meet Our Team
                </Link>
              </li>
              <li>
                <Link to="/team-recruitment" className="hover:text-ted-red transition-colors duration-200">
                  Join Team
                </Link>
              </li>
              <li>
                <Link to="/apply/speaker" className="hover:text-ted-red transition-colors duration-200">
                  Join as Speaker
                </Link>
              </li>
              <li>
                <Link to="/sponsor" className="hover:text-ted-red transition-colors duration-200">
                  Become a Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://www.instagram.com/tedxkare_/" target="_blank" rel="noopener noreferrer" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/tedxkare/" target="_blank" rel="noopener noreferrer" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="mailto:tedx@klu.ac.in" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <span>✉️</span> tedx@klu.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / TEDx Disclaimer Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Disclaimer</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              This independently organized <span className="text-ted-red font-semibold">TEDx</span><span className="font-light">KARE</span> event is operated under license from TED. Any opinions expressed here or at the event are solely those of the presenters and organizers, and not of TED.
            </p>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} TEDxKARE. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-950 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-light">
          <div>
            Built with ❤️ for student innovators at Kalasalingam Academy of Research and Education.
          </div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
