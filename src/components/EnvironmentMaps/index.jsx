import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AiOutlineComment } from 'react-icons/ai'
import { useAuth } from '../../contexts/index.jsx';
import { Comments, LikeButton } from "../../components"


const EnvironmentMap = ({ mapUrls, roomId, user_id }) => {

  const containerRef = useRef(null);
  const [showComments, setShowComments] = useState(false);

  const handleCommentsToggle = () => {
    setShowComments(prevShowComments => !prevShowComments);
  };

  const { user, width } = useAuth();

  const sizes = useMemo(() => {
    return {
      width: containerRef.current?.clientWidth,
      height: containerRef.current?.clientHeight
    }
  },[mapUrls]);

  const setupScene = useCallback((canvas) => {
    const scene = new THREE.Scene();

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

    return {tick:tick, controls:controls, renderer:renderer, sizes:sizes, camera:camera}

  },[mapUrls])

  useEffect(() => {
    const container = containerRef.current;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const {tick,controls,renderer,sizes,camera} = setupScene(canvas)
    
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
              <LikeButton imageId={roomId} user_id={user_id} />
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
            <Comments room_id={roomId} />
          </div>
          : ""
        }
      </div>
    </>
  );
};

export default EnvironmentMap;
