import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

function HeroRefinery() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.02);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x00d4ff, 1);
    mainLight.position.set(10, 20, 10);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0xff6b6b, 0.5, 50);
    accentLight.position.set(-5, 10, 5);
    scene.add(accentLight);

    // Create refinery structures
    const refineryGroup = new THREE.Group();

    // Distillation towers
    const towerGeometry = new THREE.CylinderGeometry(0.8, 1, 8, 32);
    const towerMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a3a4a,
      emissive: 0x0a1020,
      shininess: 100
    });

    for (let i = 0; i < 3; i++) {
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.set(-4 + i * 4, 4, 0);
      refineryGroup.add(tower);

      // Add glow rings
      const ringGeometry = new THREE.TorusGeometry(1.1, 0.05, 8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff, 
        transparent: true, 
        opacity: 0.6 
      });
      
      for (let j = 0; j < 4; j++) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(-4 + i * 4, 1 + j * 2, 0);
        ring.rotation.x = Math.PI / 2;
        refineryGroup.add(ring);
      }
    }

    // Storage tanks
    const tankGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const tankMaterial = new THREE.MeshPhongMaterial({
      color: 0x3a4a5a,
      emissive: 0x0a1020,
      shininess: 80
    });

    for (let i = 0; i < 4; i++) {
      const tank = new THREE.Mesh(tankGeometry, tankMaterial);
      tank.position.set(-6 + i * 4, 1, -6);
      refineryGroup.add(tank);
    }

    // Pipes
    const pipeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const pipeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a5a6a,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.1
    });

    for (let i = 0; i < 6; i++) {
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      pipe.position.set(-5 + i * 2, 0.5, -3);
      pipe.rotation.z = Math.PI / 2;
      refineryGroup.add(pipe);
    }

    // Ground grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x00d4ff, 0x1a2a3a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    scene.add(refineryGroup);

    // Particle system
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = Math.random() * 15;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Rotate refinery
      refineryGroup.rotation.y += 0.002;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 15) positions[i] = 0;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Camera follow mouse
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
      camera.position.y += (5 + mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Entry animation
    gsap.from(refineryGroup.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    });

    gsap.from(refineryGroup.rotation, {
      y: Math.PI * 2,
      duration: 2,
      ease: 'power2.out'
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
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
      className="hero-3d-canvas"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
}

export default HeroRefinery;
