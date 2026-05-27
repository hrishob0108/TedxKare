import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/95 border-t border-gray-900 text-gray-400 font-sans mt-20 relative z-10">
      <div className="container mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight text-white flex items-center">
              <span className="text-ted-red">TEDx</span>
              <span>KARE</span>
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
                <Link to="/team-recruitment" className="hover:text-ted-red transition-colors duration-200">
                  Join Team
                </Link>
              </li>
              <li>
                <Link to="/apply/speaker" className="hover:text-ted-red transition-colors duration-200">
                  Join as Speaker
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <span>📸</span> Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <span>💼</span> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <span>💻</span> GitHub
                </a>
              </li>
              <li>
                <a href="mailto:tedxkare@gmail.com" className="hover:text-ted-red transition-colors duration-200 flex items-center gap-2">
                  <span>✉️</span> Contact Email
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / TEDx Disclaimer Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Disclaimer</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              This independently organized <span className="text-ted-red font-semibold">TEDx</span>KARE event is operated under license from TED. Any opinions expressed here or at the event are solely those of the presenters and organizers, and not of TED.
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
