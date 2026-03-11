import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ==================== DOMAIN CARD COMPONENT ====================
// Card for displaying domain information with click-to-expand effects
const DomainCard = ({ domain, icon, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    open: { scale: 1.05 },
  };

  const borderVariants = {
    idle: { borderColor: '#374151' },
    hover: { borderColor: '#E62B1E' },
    open: { borderColor: '#E62B1E' },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={isOpen ? "open" : "hover"}
      initial="idle"
      animate={isOpen ? "open" : "idle"}
      className="w-full h-auto"
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.div
        variants={borderVariants}
        initial="idle"
        whileHover={isOpen ? "open" : "hover"}
        animate={isOpen ? "open" : "idle"}
        className="card card-hover flex flex-col border-2 transition-all duration-300 cursor-pointer min-h-[160px]"
      >
        {/* Domain Title */}
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl md:text-2xl font-bold flex-1">{domain}</h3>
        </div>

        {/* State Indicator */}
        {!isOpen && (
          <div className="flex justify-between items-end flex-1 mt-2 group">
            <span className="text-ted-red text-sm font-medium group-hover:underline">Click to read details</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ted-red"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        )}

        {/* Description */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-2 border-t border-gray-700">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isOpen && (
          <div className="flex justify-center mt-auto pt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-white transition-colors"><path d="m18 15-6-6-6 6"/></svg>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DomainCard;
