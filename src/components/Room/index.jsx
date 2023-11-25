import React, { useState, useEffect, useRef, useMemo } from 'react';
import EnvironmentMap from '../EnvironmentMaps';
import { AuthProvider } from '../../contexts';
import { BlobToImage } from "../../components"
import "./style.scss"

const Room = ( {mapSet, initialMapIndex = 0, user_id, room_name, roomType} ) => {

  const pageRefs = useRef([React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),])

  const imageURLs = [
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/px.png`,
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/nx.png`,
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/py.png`,
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/ny.png`,
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/pz.png`,
    `https://res.cloudinary.com/de2nposrf/image/upload/v1697033232/${roomType}/${user_id}/${room_name}/nz.png`,
]

  const [mapset,setMapSet] = useState([])

  const [loadedVar,setLoadedVar] = useState(false)


  const loading = useMemo(() => ([
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
    "https://res.cloudinary.com/de2nposrf/image/upload/v1697042090/static/loading/loading.png",
  ]),[])


  useEffect(() => {
    setMapSet([])
    const sortedArray = []

    const posPositions = ["px","nx","py","ny","pz","nz"]
    const imgs = pageRefs.current
    const arr = []
    try {
      if(!loadedVar){
        console.log("LOADING...");
      }else{
        console.log("LOADED")

        posPositions.forEach(order => {
          let matchingImg;
          for(let img of imgs){
            if(img.current.alt.split("/")[1] === order){
              matchingImg = img              
            }
            
          }
          if(matchingImg && !arr.includes(matchingImg.current.alt)){
            sortedArray.push(matchingImg.current.src)
            arr.push(matchingImg.current.alt)
          }
        })
        setMapSet(sortedArray)
      }
    } catch (error) {
      console.log("Damn it",error);
    }
  },[loadedVar])

  return (
    <div className="environment-map-grid">
      {/* <BlobToImage image_id={initialMapIndex} refs={pageRefs} loadedFunc={setLoadedVar} room_name={room_name} roomType={roomType}/> */}
      <EnvironmentMap roomId={initialMapIndex} user_id={user_id} mapUrls={mapset ? imageURLs : loading} />
    </div>
  );
};

export default Room;



 








