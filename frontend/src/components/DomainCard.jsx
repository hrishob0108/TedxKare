import { motion } from 'framer-motion';

// ==================== DOMAIN CARD COMPONENT ====================
// Card for displaying domain information with hover effects
const DomainCard = ({ domain, icon, description }) => {
  const cardVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const borderVariants = {
    idle: { borderColor: '#374151' },
    hover: { borderColor: '#E62B1E' },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="idle"
      className="h-full"
    >
      <motion.div
        variants={borderVariants}
        initial="idle"
        whileHover="hover"
        className="card card-hover h-full flex flex-col border-2 transition-all duration-300"
      >
        {/* Domain Icon/Title */}
        <div className="text-4xl mb-4">
          <span className="text-ted-red font-bold">{icon}</span>
        </div>

        {/* Domain Name */}
        <h3 className="text-xl md:text-2xl font-bold mb-3">{domain}</h3>

        {/* Description */}
        <p className="text-gray-400 text-sm md:text-base flex-grow mb-4">{description}</p>

        
      </motion.div>
    </motion.div>
  );
};

export default DomainCard;
