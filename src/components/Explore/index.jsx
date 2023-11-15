import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css'; 
import { motion } from 'framer-motion';
import { useRoom } from '../../contexts';

const items = [
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033543/static/bedroom.png', title: 'Bedroom'},
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033545/static/studio.png', title: 'Studio'},  
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033543/static/kitchen.png', title: 'Kitchen'},
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033544/static/garden.png', title: 'Garden'}, 
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033542/static/bathroom.png', title: 'Bathroom'}, 
  { image: 'https://res.cloudinary.com/de2nposrf/image/upload/v1697033544/static/livingroom.png', title: 'Living'}, 
];

const ExploreItems = () => {

  const { setRoom } = useRoom()

  const navigate = useNavigate()

  function chooseRoom(room){
    setRoom(room)
    navigate("/category")
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}
    >
    <div className="explore-container">
      {items.map((item, index) => (
        // <Link key={index} to={item.link} className="explore-item" >
        //   <img src={item.image} alt={item.title} className="explore-image" />
        //   <h2 className='title'>{item.title}</h2>
        // </Link>
        <div className="explore-item" key={index} onClick={() => chooseRoom(item.title)}>
          <img src={item.image} alt={item.title} className="explore-image" />
          <h2 className='title'>{item.title}</h2>
        </div>
      ))}
    </div>
    </motion.div>
  );
};

export default ExploreItems;
