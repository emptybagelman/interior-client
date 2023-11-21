import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 
import Heart from "react-animated-heart";
import axiosInstance from '../../helpers'
import { Canvas } from '@react-three/fiber';
import { AiOutlineComment } from 'react-icons/ai'

import { useAuth } from '../../contexts/index.jsx';
import Room from '../Room';
import EmailButton from '../Email';
import Comments from '../Comments';


const EnvironmentMap = ({ mapUrls, roomId }) => {

  const containerRef = useRef(null);
  const [isClick, setClick] = useState(false);
  const [showComments, setShowComments] = useState(false); 

  const handleCommentsToggle = () => {
    setShowComments(prevShowComments => !prevShowComments);
  };

  const { user, width } = useAuth();

  const handleLike = async () => {
    
    setClick(prev => !prev);
   
    const likeData = {
        user_id: user,
        room_id: roomId
    };
    
    try {
        const response = await axiosInstance.post('/likes', likeData);
        console.log('Like created', response.data);
    } catch (error) {
        console.error('Error creating like:', error);

       
        setClick(prev => !prev);  
    }
}

  

  useEffect(() => {
    const container = containerRef.current;
    

    const global = {};

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);


    const scene = new THREE.Scene();
    const sizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(4, 5, 4);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.target.y = 3.5;
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}

 scene.backgroundBlurriness = 0 
scene.backgroundIntensity = 1 


    const environmentMap = new THREE.CubeTextureLoader().load(mapUrls);
    scene.environment = environmentMap;
    scene.background = environmentMap;

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      controls.update();
      renderer.render(scene,camera)
      requestAnimationFrame(tick);
    };

    tick();

    
    const onResize = () => {
      sizes.width = container.clientWidth;
      sizes.height = container.clientHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', onResize);

    return () => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  cancelAnimationFrame(tick);
  window.removeEventListener('resize', onResize);
  controls.dispose();
  renderer.dispose();
};
  }, [mapUrls]);

  

  return (
    
    <>
      <div ref={containerRef} className="environment-map" />
      {/* style={ showComments ? {"top":"50vh","margin":"0"} : {} } */}
      <div className={showComments ? "like-bar open" : 'like-bar close'} >
        <div className="top" style={!user ? {"justifyContent":"center"} : {}}>
          {
            user 
            ? 
            <div className='like-header'>
              {width > 350 ? <p className='favourites'>Add to favourites</p> : "" }
              <Heart isClick={isClick} onClick={handleLike} />
            </div>
            : ""
          }
          <button className='comments-button' onClick={handleCommentsToggle}>
            {width > 700 ? "Comments" : ""} <AiOutlineComment />
          </button>
        </div>
        {
          showComments ?
          <div className="bottom">
            <Comments room_id={roomId}/>
          </div>
          : ""
        }
      </div>
    </>
  );
};

export default EnvironmentMap;
