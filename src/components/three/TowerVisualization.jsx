import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

function TowerVisualization() {
  const containerRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 3, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    scene.add(mainLight);

    // Tower group
    const towerGroup = new THREE.Group();

    // Tower body - tapered cylinder
    const towerGeometry = new THREE.CylinderGeometry(1.2, 1.5, 10, 32);
    const towerMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a3a4a,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 5;
    towerGroup.add(tower);

    // Product layers (colored sections)
    const layers = [
      { color: 0x9d4edd, height: 1, y: 9, name: 'LPG' },
      { color: 0x4d96ff, height: 1.5, y: 7.5, name: 'Naphtha' },
      { color: 0x6bcb77, height: 1.5, y: 6, name: 'Kerosene' },
      { color: 0xffd93d, height: 2, y: 4, name: 'Diesel' },
      { color: 0xff6b6b, height: 2.5, y: 1.5, name: 'Residue' }
    ];

    layers.forEach((layer, index) => {
      const layerGeometry = new THREE.CylinderGeometry(
        1.15 - index * 0.02,
        1.18 - index * 0.02,
        layer.height,
        32
      );
      const layerMaterial = new THREE.MeshPhongMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.7,
        emissive: layer.color,
        emissiveIntensity: 0.2
      });
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
      layerMesh.position.y = layer.y;
      towerGroup.add(layerMesh);

      // Animate layers
      gsap.to(layerMesh.material, {
        emissiveIntensity: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2
      });
    });

    // Pipes
    const pipeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a5a6a,
      shininess: 80
    });

    // Input pipe
    const inputPipeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 4, 8);
    const inputPipe = new THREE.Mesh(inputPipeGeometry, pipeMaterial);
    inputPipe.rotation.z = Math.PI / 2;
    inputPipe.position.set(-3, 2, 0);
    towerGroup.add(inputPipe);

    // Output pipes
    const outputPositions = [9, 7, 5.5, 3.5, 1];
    outputPositions.forEach((y, i) => {
      const outputPipeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
      const outputPipe = new THREE.Mesh(outputPipeGeometry, pipeMaterial);
      outputPipe.rotation.z = Math.PI / 2;
      outputPipe.position.set(3, y, 0);
      towerGroup.add(outputPipe);
    });

    // Platform rings
    const ringMaterial = new THREE.MeshPhongMaterial({ color: 0x5a6a7a });
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.4, 0.05, 8, 32);
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 2 + i * 2;
      ring.rotation.x = Math.PI / 2;
      towerGroup.add(ring);
    }

    // Add particle system for rising vapor
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = (Math.random() - 0.5) * 2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    towerGroup.add(particles);

    scene.add(towerGroup);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 10) positions[i] = 0;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Slow rotation
      towerGroup.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // Entry animation
    gsap.from(towerGroup.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="tower-canvas"
      style={{ width: '100%', height: '300px' }}
    />
  );
}

export default TowerVisualization;
