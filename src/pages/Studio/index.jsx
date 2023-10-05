import React, {useState, useEffect,useRef } from 'react';
import { Room, StylesComponent, BackButton } from '../../components'
import { Link } from 'react-router-dom';
import Heart from "react-animated-heart";
import { AiFillEye } from 'react-icons/ai'
import './explore.css'
import { useAuth } from '../../contexts';
import axios from 'axios';
import {GrClose} from 'react-icons/gr'

const studioImages = [
  { src: '../../src/assets/environmentMaps/studio/1.png', alt: 'Image 1' },
  { src: '../../src/assets/environmentMaps/studio/2.jpeg', alt: 'Image 1' },
  { src: '../../src/assets/environmentMaps/studio/3.jpeg', alt: 'Image 1' },
  { src: '../../src/assets/environmentMaps/studio/4.avif', alt: 'Image 1' },
  // { src: '../../src/assets/environmentMaps/studio/4.jpeg', alt: 'Image 1' },
  // { src: '../../src/assets/environmentMaps/studio/5.jpeg', alt: 'Image 1' },
//   { src: '../../src/assets/environmentMaps/studio/6.jpeg', alt: 'Image 1' },
//   { src: '../../src/assets/environmentMaps/studio/7.jpeg', alt: 'Image 1' },
//   { src: '../../src/assets/environmentMaps/studio/8.jpeg', alt: 'Image 1' },
];


function StudioPage() {
  const { user } = useAuth();
  const [imagesWithStyles, setImagesWithStyles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [roomArray,setRoomArray] = useState([])
  const [likedImages, setLikedImages] = useState(new Array(roomArray.length).fill(false));


  const handleImageClick = (image, index) => {
    document.body.style.overflow = 'hidden';
    const updatedImages = [...imagesWithStyles];
    //updatedImages[index].clickCount += 1;
    setImagesWithStyles(updatedImages);
    setSelectedImage(image);
    setSelectedImageIndex(image.id);
  };

  const handleCloseClick = () => {
    setSelectedImage(null);
    setSelectedImageIndex(null)
  };

 useEffect(() => {
    const newImagesWithStyles = roomArray.map((image, index) => ({
        ...image,
        style: <StylesComponent seed={index + 3} />,
    }));
    setImagesWithStyles(newImagesWithStyles);
}, []);


useEffect(() => {
  const newImagesWithStyles = roomArray.map((image, index) => ({
      ...image,
      clickCount: image.clickCount || 0,  
      style: <StylesComponent seed={index} />,
  }));
  setImagesWithStyles(newImagesWithStyles);
}, []);

const toggleLike = async (index) => {
  const newLikedImages = [...likedImages];
  newLikedImages[index] = !newLikedImages[index];
  setLikedImages(newLikedImages);

  if (newLikedImages[index]) {
    const roomId = imagesWithStyles[index].id;
    console.log("line74",roomId);
    await sendLikeData(user, roomId);
  }
};

useEffect(() => {
  async function callRoomImages(){
    const call = await axios.get("http://localhost:5000/rooms").then(data => {
      const rooms = data.data.rooms
      const tempArr = []
      let counter = 0
      for(let i=0;i<rooms.length;i++){
        if(rooms[i].category === "Studio"){
            // rooms[i].src = rooms[i].cover_image
          rooms[i].src = studioImages[counter].src
          rooms[i].alt = 'Image 1'
          tempArr.push(rooms[i])
          counter += 1
        }
      }
      setRoomArray(tempArr)
    })

  }
  callRoomImages()
},[])

return (
  <div className='overflow-hiding'>
      <div className='title-section'>
    <h1 className='room-title'>Bedroom Inspiration</h1>
    <BackButton backTo="/explore" label="Back to Explore" />
    </div>
  
  <div className={`studio-page${selectedImage ? ' dimmed' : ''}`}>
    {roomArray.map((image, index) => (
  <div className="studio__item-container" 
    key={index} 
    onClick={() => handleImageClick(image, index)}
    onMouseEnter={() => setHoveredImageIndex(image.id)}
    onMouseLeave={() => setHoveredImageIndex(null)}
  >
  <img className='studio__item' src={image.src} alt={image.alt} />
  <div className="studio__item-caption">{image.name}
  {hoveredImageIndex == image.id && (
    <div className="icon-container">
  
      <div className="heart-container" onClick={(e) => { e.stopPropagation(); toggleLike(image.id); }}>
        <Heart isClick={likedImages[image.id]} />
      </div>
      
      <div className="click-count">
        <AiFillEye />
        <span> {image.clickCount}</span>
      </div>
    </div>
  )}</div>
  
  
</div>
))}


    {selectedImage && (
      <div className="fullscreen-div">
      <div className="fullscreen-content">
          <Room mapSet="bedroom" initialMapIndex={selectedImageIndex} />
          <button className="close-button" onClick={handleCloseClick}><GrClose /></button>
      </div>
  </div>
    )}
  </div>
  </div>
);
}

export default StudioPage;
