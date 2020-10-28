import * as React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <motion.div
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        color: 'red',
        border: '2px solid transparent',
        borderTop: '2px solid white',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        loop: Infinity,
      }}
    />
  );
};

export default Loading;
