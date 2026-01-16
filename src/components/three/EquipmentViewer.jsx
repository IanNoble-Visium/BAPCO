import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

function EquipmentViewer({ viewMode = 'exterior' }) {
  const containerRef = useRef(null);
  const frameIdRef = useRef(null);
  const groupRef = useRef(null);

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
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404080, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.4);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // ESP Pump group
    const espGroup = new THREE.Group();
    groupRef.current = espGroup;

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5a6a,
      roughness: 0.3,
      metalness: 0.8
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.2
    });

    const housingMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a3a4a,
      roughness: 0.4,
      metalness: 0.6
    });

    // Motor housing (bottom)
    const motorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const motor = new THREE.Mesh(motorGeometry, housingMaterial);
    motor.position.y = -1.5;
    espGroup.add(motor);

    // Pump stages (middle section)
    for (let i = 0; i < 5; i++) {
      const stageGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
      const stage = new THREE.Mesh(stageGeometry, metalMaterial);
      stage.position.y = i * 0.35;
      espGroup.add(stage);

      // Impeller rings
      const ringGeometry = new THREE.TorusGeometry(0.65, 0.05, 8, 32);
      const ring = new THREE.Mesh(ringGeometry, accentMaterial);
      ring.position.y = i * 0.35;
      ring.rotation.x = Math.PI / 2;
      espGroup.add(ring);
    }

    // Intake section
    const intakeGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1, 32);
    const intake = new THREE.Mesh(intakeGeometry, metalMaterial);
    intake.position.y = 2;
    espGroup.add(intake);

    // Cable connection
    const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const cable = new THREE.Mesh(cableGeometry, accentMaterial);
    cable.position.set(0.9, -1, 0);
    cable.rotation.z = Math.PI / 6;
    espGroup.add(cable);

    // Add rotating elements
    const rotorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const rotor = new THREE.Mesh(rotorGeometry, accentMaterial);
    rotor.position.y = 0.5;
    espGroup.add(rotor);

    scene.add(espGroup);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x00d4ff, 0x1a2a3a);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      espGroup.rotation.y += deltaMove.x * 0.01;
      espGroup.rotation.x += deltaMove.y * 0.01;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseUp);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Rotate rotor
      rotor.rotation.y += 0.05;
      
      // Subtle auto-rotation when not dragging
      if (!isDragging) {
        espGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Entry animation
    gsap.from(espGroup.scale, {
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
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseUp);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      id="equipmentCanvas"
      style={{ width: '100%', height: '300px' }}
    />
  );
}

export default EquipmentViewer;
