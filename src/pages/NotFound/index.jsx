import React, { Suspense } from "react";
import { useLocation, Link } from "react-router-dom";
import "./NotFound.scss";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <div id="section">
        <div id="container">
          <div id="left">
            <h1 id="h1">Whoops! Page not found. </h1>

            <p id="p">Looks like we didn't know where to send you!<br/> Let's get you home.</p>
            <Link to={"/"}>
              <button id="button_notfound">Go Home</button>
            </Link>
          </div>
          <div id="right">
            <Canvas>
              <Suspense fallback={null}>
                <OrbitControls enableZoom={false} />
                <ambientLight intensity={1} />
                <directionalLight position={[3, 2, 1]} />
                <Sphere args={[1, 100, 100]} scale={2.4}>
                  <MeshDistortMaterial
                    color="#20fae6"
                    attach="material"
                    distort={0.5}
                    speed={2}
                  />
                </Sphere>
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
