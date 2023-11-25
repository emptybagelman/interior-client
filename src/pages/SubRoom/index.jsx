import React, {useState, useEffect,useRef, useCallback } from 'react'
import { Room, BackButton, LikeButton } from '../../components'
import './explore.scss'
import { useAuth, useRoom } from '../../contexts';
import axiosInstance from '../../helpers';
import {GrClose} from 'react-icons/gr'

const SubRoom = () => {

  const { room } = useRoom();

    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const [roomArray,setRoomArray] = useState([])

    // const [likedImages, setLikedImages] = useState(null);
    const [imagesWithStyles, setImagesWithStyles] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  
    const handleImageClick = (image, index) => {
      const updatedImages = [...imagesWithStyles];
      setImagesWithStyles(updatedImages);
      setSelectedImage(image);
      setSelectedImageIndex(image.id);
    };
  
    const handleCloseClick = () => {
      setSelectedImage(null);
      setSelectedImageIndex(null)
    };


  
  const callRoomImages = useCallback(async () => {
    const call = await axiosInstance.get(`/rooms/${room}`).then(data => {
      const rooms = data.data.data

      const tempArr = [];

      for(let roomC of rooms){
        roomC.src = `https://res.cloudinary.com/de2nposrf/image/upload/${room}/${roomC.user_id}/${roomC.name}/nz.png`
        roomC.alt = `Image ID: ${roomC.id}`
        tempArr.push(roomC)
      }
      if(tempArr.length > 0){
        setRoomArray(tempArr)
      }
    })
  },[])

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  
  useEffect(() => {
    callRoomImages()
  },[])
    
    return (
      <div className='overflow-hiding'>
          <div className='title-section'>
            <h1 className='room-title'>{room} Inspiration</h1>
            <BackButton backTo="/explore" label="Back to Explore" styling={roomArray.length <= 0 ? {"display":"none"} : {}}/>
          </div>
      
      <div className={`page${selectedImage ? ' dimmed' : ''}`} style={roomArray.length <= 0 ? {"display":"block"} : {}}>

          { 

            roomArray.length > 0 ? roomArray.map((image, index) => (
              <div className="item-container" 
                key={index} 
                onClick={() => handleImageClick(image, index)}
                onMouseEnter={() => setHoveredImageIndex(image.id)}
                onMouseLeave={() => setHoveredImageIndex(null)}
              >
              <img className='item' src={image.src} alt={image.alt} />
              <div className="item-caption">
                <div>
                  <h3>{image.name.split("_").join(" ")}</h3>
                  {
                    hoveredImageIndex === image.id ?                 
                    <>
                      <p>Dimensions: {image.dimensions}</p>
                      <p>Description: {image.description}</p>
                      <p>Theme: {image.theme}</p>
                    </>
                    : ""
                  }
                </div>
                <LikeButton imageId={image.id} user_id={image.user_id} />
              </div>
            </div>
            ))
            :
            <div id='room-not-found-wrapper'>
              <h3>There aren't any {room}s!</h3>
              <BackButton backTo="/explore" label="Back to Explore"/>

            </div>
      }
    
    
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