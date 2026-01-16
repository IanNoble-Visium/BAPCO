import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

function FacilityView({ viewMode = 'overview' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  const autoRotateRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(20, 15, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(30, 50, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x00d4ff, 1, 100);
    cyanLight.position.set(-10, 20, 10);
    scene.add(cyanLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1520,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x00d4ff, 0x1a2a3a);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Facility group
    const facilityGroup = new THREE.Group();

    // Create refinery buildings
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a3a4a,
      roughness: 0.5,
      metalness: 0.5
    });

    // CDU - Main distillation tower
    const cduGeometry = new THREE.CylinderGeometry(2, 2.5, 15, 32);
    const cdu = new THREE.Mesh(cduGeometry, buildingMaterial);
    cdu.position.set(-8, 7.5, 0);
    cdu.castShadow = true;
    facilityGroup.add(cdu);

    // RHCU
    const rhcuGeometry = new THREE.BoxGeometry(6, 8, 6);
    const rhcu = new THREE.Mesh(rhcuGeometry, buildingMaterial);
    rhcu.position.set(0, 4, -8);
    rhcu.castShadow = true;
    facilityGroup.add(rhcu);

    // FCC
    const fccGeometry = new THREE.CylinderGeometry(1.5, 2, 10, 32);
    const fcc = new THREE.Mesh(fccGeometry, buildingMaterial);
    fcc.position.set(8, 5, 0);
    fcc.castShadow = true;
    facilityGroup.add(fcc);

    // Storage tanks
    const tankMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a4a5a,
      roughness: 0.6,
      metalness: 0.4
    });

    for (let i = 0; i < 4; i++) {
      const tankGeometry = new THREE.CylinderGeometry(3, 3, 4, 32);
      const tank = new THREE.Mesh(tankGeometry, tankMaterial);
      tank.position.set(-15 + i * 7, 2, 12);
      tank.castShadow = true;
      facilityGroup.add(tank);
    }

    // Pipes connecting units
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a5a6a,
      roughness: 0.3,
      metalness: 0.7
    });

    const createPipe = (start, end) => {
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, length, 8);
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      pipe.position.copy(start.clone().add(end).multiplyScalar(0.5));
      pipe.lookAt(end);
      pipe.rotateX(Math.PI / 2);
      return pipe;
    };

    const pipes = [
      createPipe(new THREE.Vector3(-8, 3, 0), new THREE.Vector3(0, 3, -8)),
      createPipe(new THREE.Vector3(0, 3, -8), new THREE.Vector3(8, 3, 0)),
      createPipe(new THREE.Vector3(-8, 3, 0), new THREE.Vector3(-8, 3, 12))
    ];
    pipes.forEach(pipe => facilityGroup.add(pipe));

    // Add glowing elements based on view mode
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: viewMode === 'thermal' ? 0xff6b6b : 0x00d4ff,
      transparent: true,
      opacity: 0.6
    });

    const glowRings = [];
    const addGlowRing = (position, radius) => {
      const ringGeometry = new THREE.TorusGeometry(radius, 0.1, 8, 32);
      const ring = new THREE.Mesh(ringGeometry, glowMaterial);
      ring.position.copy(position);
      ring.rotation.x = Math.PI / 2;
      glowRings.push(ring);
      facilityGroup.add(ring);
    };

    addGlowRing(new THREE.Vector3(-8, 2, 0), 2.8);
    addGlowRing(new THREE.Vector3(-8, 10, 0), 2.3);
    addGlowRing(new THREE.Vector3(8, 8, 0), 1.8);

    scene.add(facilityGroup);

    // Animate glow rings
    glowRings.forEach((ring, index) => {
      gsap.to(ring.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.2
      });
    });

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      autoRotateRef.current = false;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      facilityGroup.rotation.y += deltaMove.x * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseUp);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (autoRotateRef.current) {
        facilityGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Entry animation
    gsap.from(camera.position, {
      z: 50,
      y: 30,
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
      id="facility3DCanvas"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
}

export default FacilityView;
