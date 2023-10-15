import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; 
import { motion } from 'framer-motion'; 

const ExploreItems = () => {
  const items = [
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033543/static/bedroom.png', title: 'Bedroom', link: '/bedroom' },
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033545/static/studio.png', title: 'Studio', link: '/studio' },  
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033543/static/kitchen.png', title: 'Kitchen', link: '/kitchen' },
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033544/static/garden.png', title: 'Garden', link: '/garden' }, 
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033542/static/bathroom.png', title: 'Bathroom', link: '/bathroom' }, 
    { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033544/static/livingroom.png', title: 'Living', link: '/living' }, 
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}
    >
    <div className="explore-container">
      {items.map((item, index) => (
        <Link key={index} to={item.link} className="explore-item" >
          <img src={item.image} alt={item.title} className="explore-image" />
          <h2 className='title'>{item.title}</h2>
        </Link>
      ))}
    </div>
    </motion.div>
  );
};

export default ExploreItems;
