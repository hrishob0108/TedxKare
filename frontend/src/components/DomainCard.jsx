import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== DOMAIN CARD COMPONENT ====================
// Card for displaying domain information with click-to-expand effects
const DomainCard = ({ domain, icon, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={isOpen ? "open" : "hover"}
      initial="idle"
      className="h-full cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className={`card h-full min-h-[160px] flex flex-col border-2 transition-all duration-300 ${
          isExpanded ? 'border-ted-red' : 'border-[#374151] hover:border-gray-500'
        }`}
        style={isExpanded ? { borderColor: '#E62B1E' } : {}}
      >
        {/* Domain Name */}
        <h3 className="text-xl md:text-2xl font-bold mb-3">{domain}</h3>

        <div className="flex-grow flex flex-col mt-auto">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-gray-400 text-sm md:text-base pt-2 mb-2">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && (
            <div className="flex justify-between items-center text-ted-red text-sm font-semibold mt-auto pt-4">
              <span>Click to read details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DomainCard;
