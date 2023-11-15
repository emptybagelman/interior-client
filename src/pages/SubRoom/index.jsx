import React, {useState, useEffect,useRef } from 'react'
import { Room, StylesComponent, BackButton } from '../../components'
import Heart from "react-animated-heart";
import { AiFillEye } from 'react-icons/ai'
import './explore.scss'
import { useAuth, useRoom } from '../../contexts';
import axiosInstance from '../../helpers';
import {GrClose} from 'react-icons/gr'

const SubRoom = () => {
    const { user } = useAuth();

    const { room } = useRoom();

    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const [roomArray,setRoomArray] = useState([])
    const [likedImages, setLikedImages] = useState(new Array(roomArray.length).fill(false));
    const [imagesWithStyles, setImagesWithStyles] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  
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
      // const roomId = imagesWithStyles[index].id;
      const roomId = hoveredImageIndex;
      await sendLikeData(user, roomId);
    }
  };
  
  const sendLikeData = async (user, roomId) => {
    try {
      const response = await axiosInstance.post('/likes', { user_id: user, room_id: roomId });
  
      if (!response.data) {
        throw new Error('Failed to send data');
      }
  
      console.log('Like created', response.data);
    } catch (error) {
      console.error("There was an error sending data:", error);
    }
  };
  
  async function callRoomImages(){
    const call = await axiosInstance.get("/rooms").then(data => {
      const rooms = data.data.rooms
      const tempArr = []
      let counter = 0
      for(let i=0;i<rooms.length;i++){
        if(rooms[i].category === room){
          let roomTemp = ""
  
          if(rooms[i].name.includes(" ")){
            roomTemp = rooms[i].name.split(" ").join("_")
          }else{
            roomTemp = rooms[i].name
          }
          console.log("85",roomTemp);

          rooms[i].src = `https://res.cloudinary.com/de2nposrf/image/upload/${room}/${rooms[i].user_id}/${roomTemp}/nz.png`
          rooms[i].alt = 'Image 1'
          tempArr.push(rooms[i])
          counter += 1
        }
      }
      console.log(tempArr);
      setRoomArray(tempArr)
    })
  
  
  }
  
  useEffect(() => {
    callRoomImages()
  },[])
  
  
    // useEffect(() => {
    //     const handleScroll = (e) => {
    //     const fullscreenDiv = document.querySelector('.fullscreen-div');
    //     if (fullscreenDiv) {
    //         fullscreenDiv.scrollTop += e.deltaY;
    //         e.preventDefault();
    //     }
    //     };
    
    //     if (selectedImage) {
    //     window.addEventListener('wheel', handleScroll);
    //     } else {
    //     window.removeEventListener('wheel', handleScroll);
    //     }
    
    //     // for(let img of pageRefs.current){
    //     //   console.log(img.current.src);
    //     // }
    
    //     return () => {
    //     window.removeEventListener('wheel', handleScroll);
    //     };
    // }, [selectedImage]);
  
  
  
    return (
        <div className='overflow-hiding'>
            <div className='title-section'>
            <h1 className='room-title'>{room} Inspiration</h1>
            <BackButton backTo="/explore" label="Back to Explore" />
            </div>
        
        <div className={`page${selectedImage ? ' dimmed' : ''}`}>
            {roomArray.map((image, index) => (
        <div className="item-container" 
            key={index} 
            onClick={() => handleImageClick(image, index)}
            onMouseEnter={() => setHoveredImageIndex(image.id)}
            onMouseLeave={() => setHoveredImageIndex(null)}
        >
        <img className='item' src={image.src} alt={image.alt} />
        <div className="item-caption">
        <h3>{image.name.split("_").join(" ")}</h3>
        <p>Dimensions: {image.dimensions}</p>
        <p>Description: {image.description}</p>
        <p>Theme: {image.theme}</p>
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
            <Room mapSet={room.toLowerCase()} initialMapIndex={selectedImageIndex} roomType={room} room_name={selectedImage.name} user_id={selectedImage.user_id}/>
            <button className="close-button" onClick={handleCloseClick}><GrClose /></button>
          </div>
      </div>
        )}
      </div>
      </div>
    );
}

export default SubRoom