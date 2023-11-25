import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Environment from "../../components/Homepage/Environment";
import "./home.scss";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { House } from "../../components/Homepage";
import { Link } from "react-router-dom";

const box = new THREE.BoxGeometry();
const cyl = new THREE.CylinderGeometry(1, 1, 2, 20);
const tri = new THREE.CylinderGeometry(1, 1, 2, 3);

export default function Home() { 

  const [scrollY, setScrollY] = useState(0);

  // Create a function to handle scroll events
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Add a scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    return (
      <div id='home-container'>
        <div id='left-content'>
          <div className="text-section">
            <h2>Welcome to</h2>
            <h1>Inspire My Space</h1>
            <p>Inspire My Space is a revolutionary interior design application designed to elevate your decision-making process when it comes to transforming your living spaces!</p>
              <Link to={`/explore`}>
                <button>Explore now</button>
              </Link>
          </div>
          <div className="text-section">
            <h2>About us</h2>
            <p>At Inspire My Space, we are passionate about transforming the way you envision and create your living spaces. With our visually engaging platform, we provide the inspiration and tools you need to bring your design visions to life. Join us on a journey where creativity meets functionality, and let Inspire My Space elevate your interior design experience.</p>
          </div>
          <div className="text-section">
            <h2>Demo</h2>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia aspernatur eaque accusamus dicta accusantium 
              ab soluta ullam optio eius.</p>
          </div>
          
      </div>

      <div id="right-content">
        <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }}>
          <House
            scale={0.9}
            boxGeometry={box}
            triGeometry={tri}
            clyGeometry={cyl}
            scrollY={scrollY}
          />
          <Environment />
          <OrbitControls makeDefault enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
}
