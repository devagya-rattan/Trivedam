// GlobeSimulation.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlobeSimulation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthTexture = new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/roblabs/planet-earth-threejs/master/assets/earthmap4k.jpg'
    );
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Light
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Satellite (small sphere)
    const satelliteGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    scene.add(satellite);

    // Camera position
    camera.position.z = 6;

    // Orbit logic
    let angle = 0;
    const radius = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      angle += 0.01;
      satellite.position.x = radius * Math.cos(angle);
      satellite.position.z = radius * Math.sin(angle);
      satellite.position.y = 1 * Math.sin(angle / 2);
      earth.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div style={{ width: '100%', height: '500px' }} ref={mountRef} />;
};

export default GlobeSimulation;
