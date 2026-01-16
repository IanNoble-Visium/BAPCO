/* ============================================
   BAPCO TruContext Dashboard - Three.js Scenes
   3D Visualizations for Oil Refinery
   ============================================ */

class ThreeScenes {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationFrames = {};
        this.clock = new THREE.Clock();
    }

    // Initialize Hero 3D Scene
    initHeroScene(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x5b2d8c, 1, 50);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);

        // Create refinery model
        const refineryGroup = this.createRefineryModel();
        scene.add(refineryGroup);

        // Add particles
        const particles = this.createParticleSystem(500);
        scene.add(particles);

        // Camera position
        camera.position.set(15, 12, 15);
        camera.lookAt(0, 3, 0);

        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;

        // Animation
        const animate = () => {
            this.animationFrames.hero = requestAnimationFrame(animate);
            
            const time = this.clock.getElapsedTime();
            
            // Rotate refinery slowly
            refineryGroup.rotation.y = time * 0.1;
            
            // Animate particles
            particles.rotation.y = time * 0.05;
            
            // Pulsing lights
            pointLight.intensity = 1 + Math.sin(time * 2) * 0.3;
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize('hero', canvas));
    }

    // Create Refinery 3D Model
    createRefineryModel() {
        const group = new THREE.Group();

        // Materials
        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x8899aa,
            metalness: 0.8,
            roughness: 0.3
        });

        const tankMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.6,
            roughness: 0.4
        });

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.8
        });

        const pipeMaterial = new THREE.MeshStandardMaterial({
            color: 0x666688,
            metalness: 0.9,
            roughness: 0.2
        });

        // Main Distillation Tower
        const towerGeometry = new THREE.CylinderGeometry(1.5, 2, 12, 32);
        const tower = new THREE.Mesh(towerGeometry, metalMaterial);
        tower.position.set(0, 6, 0);
        group.add(tower);

        // Tower dome
        const domeGeometry = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, metalMaterial);
        dome.position.set(0, 12, 0);
        group.add(dome);

        // Tower rings (platforms)
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.TorusGeometry(1.8, 0.1, 8, 32);
            const ring = new THREE.Mesh(ringGeometry, glowMaterial);
            ring.position.set(0, 2 + i * 2.2, 0);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
        }

        // Storage Tanks
        const tankPositions = [
            { x: -6, z: 3 },
            { x: -6, z: -3 },
            { x: 6, z: 0 }
        ];

        tankPositions.forEach((pos, i) => {
            const tankGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
            const tank = new THREE.Mesh(tankGeometry, tankMaterial);
            tank.position.set(pos.x, 1.5, pos.z);
            group.add(tank);

            // Tank roof
            const roofGeometry = new THREE.ConeGeometry(1.6, 0.8, 32);
            const roof = new THREE.Mesh(roofGeometry, metalMaterial);
            roof.position.set(pos.x, 3.4, pos.z);
            group.add(roof);

            // Level indicator
            const levelGeometry = new THREE.CylinderGeometry(1.4, 1.4, 2 * (0.5 + Math.random() * 0.4), 32);
            const levelMaterial = new THREE.MeshBasicMaterial({
                color: i === 0 ? 0x4d96ff : (i === 1 ? 0xffd93d : 0x6bcb77),
                transparent: true,
                opacity: 0.6
            });
            const level = new THREE.Mesh(levelGeometry, levelMaterial);
            level.position.set(pos.x, 1, pos.z);
            group.add(level);
        });

        // Pipes
        const pipePositions = [
            { start: [0, 0, 2], end: [-6, 0, 3], radius: 0.15 },
            { start: [0, 0, -2], end: [-6, 0, -3], radius: 0.15 },
            { start: [2, 2, 0], end: [6, 2, 0], radius: 0.2 },
            { start: [0, 10, 1.5], end: [4, 10, 4], radius: 0.1 }
        ];

        pipePositions.forEach(pipe => {
            const pipeGroup = this.createPipe(pipe.start, pipe.end, pipe.radius, pipeMaterial);
            group.add(pipeGroup);
        });

        // Flare Stack
        const flareGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 16);
        const flare = new THREE.Mesh(flareGeometry, metalMaterial);
        flare.position.set(8, 4, -5);
        group.add(flare);

        // Flame
        const flameGeometry = new THREE.ConeGeometry(0.4, 1.5, 16);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.9
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(8, 8.5, -5);
        group.add(flame);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(30, 30);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.5,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        group.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(30, 30, 0x00d4ff, 0x1a1a3e);
        gridHelper.position.y = 0.01;
        group.add(gridHelper);

        return group;
    }

    // Create pipe between two points
    createPipe(start, end, radius, material) {
        const group = new THREE.Group();
        
        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        const direction = new THREE.Vector3().subVectors(endVec, startVec);
        const length = direction.length();
        
        const pipeGeometry = new THREE.CylinderGeometry(radius, radius, length, 16);
        const pipe = new THREE.Mesh(pipeGeometry, material);
        
        pipe.position.copy(startVec.clone().add(endVec).multiplyScalar(0.5));
        pipe.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.clone().normalize()
        );
        
        group.add(pipe);
        
        return group;
    }

    // Create particle system
    createParticleSystem(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = Math.random() * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

            // Cyan to purple gradient
            const t = Math.random();
            colors[i * 3] = 0 + t * 0.36; // R
            colors[i * 3 + 1] = 0.83 - t * 0.65; // G
            colors[i * 3 + 2] = 1 - t * 0.45; // B
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        return new THREE.Points(geometry, material);
    }

    // Initialize Facility 3D Scene
    initFacilityScene(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e17);
        
        const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Create facility layout
        const facilityGroup = this.createFacilityLayout();
        scene.add(facilityGroup);

        // Camera position (isometric view)
        camera.position.set(80, 60, 80);
        camera.lookAt(0, 0, 0);

        this.scenes.facility = scene;
        this.cameras.facility = camera;
        this.renderers.facility = renderer;
        this.facilityGroup = facilityGroup;

        // Mouse interaction
        this.setupFacilityControls(canvas, camera, facilityGroup);

        // Animation
        const animate = () => {
            this.animationFrames.facility = requestAnimationFrame(animate);
            
            const time = this.clock.getElapsedTime();
            
            // Animate data flow lines
            this.animateDataFlow(facilityGroup, time);
            
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => this.handleResize('facility', canvas));
    }

    // Create facility layout for 3D map
    createFacilityLayout() {
        const group = new THREE.Group();

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        group.add(ground);

        // Grid
        const gridHelper = new THREE.GridHelper(200, 40, 0x00d4ff, 0x1a1a3e);
        gridHelper.position.y = 0.1;
        group.add(gridHelper);

        // Create facility sections
        const sections = [
            { name: 'CDU', x: -30, z: -20, width: 40, depth: 30, height: 25, color: 0x00ff88 },
            { name: 'RHCU', x: 30, z: -20, width: 35, depth: 25, height: 20, color: 0xffd93d },
            { name: 'Tank Farm', x: -40, z: 30, width: 50, depth: 40, height: 8, color: 0x4d96ff },
            { name: 'Utilities', x: 40, z: 30, width: 30, depth: 30, height: 12, color: 0x9d4edd },
            { name: 'FCC', x: 0, z: 0, width: 25, depth: 25, height: 30, color: 0xff6b6b }
        ];

        sections.forEach(section => {
            const sectionGroup = this.createFacilitySection(section);
            group.add(sectionGroup);
        });

        // Add connecting pipes
        const pipeNetwork = this.createPipeNetwork();
        group.add(pipeNetwork);

        return group;
    }

    // Create a facility section
    createFacilitySection(config) {
        const group = new THREE.Group();
        group.userData = { name: config.name };

        // Base platform
        const baseGeometry = new THREE.BoxGeometry(config.width, 0.5, config.depth);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a4a,
            roughness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(config.x, 0.25, config.z);
        base.receiveShadow = true;
        group.add(base);

        // Glow outline
        const outlineGeometry = new THREE.EdgesGeometry(baseGeometry);
        const outlineMaterial = new THREE.LineBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.6
        });
        const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
        outline.position.copy(base.position);
        group.add(outline);

        // Add buildings/equipment based on section type
        if (config.name === 'CDU' || config.name === 'RHCU' || config.name === 'FCC') {
            // Distillation towers
            for (let i = 0; i < 3; i++) {
                const towerHeight = config.height * (0.6 + Math.random() * 0.4);
                const tower = this.createTower(towerHeight, config.color);
                tower.position.set(
                    config.x - config.width/3 + i * config.width/3,
                    towerHeight/2 + 0.5,
                    config.z
                );
                group.add(tower);
            }
        } else if (config.name === 'Tank Farm') {
            // Storage tanks
            for (let i = 0; i < 6; i++) {
                const tank = this.createStorageTank(config.color);
                tank.position.set(
                    config.x - 15 + (i % 3) * 15,
                    4,
                    config.z - 10 + Math.floor(i / 3) * 20
                );
                group.add(tank);
            }
        } else if (config.name === 'Utilities') {
            // Utility buildings
            const buildingGeometry = new THREE.BoxGeometry(20, 8, 15);
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a4a6a,
                roughness: 0.6
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(config.x, 4.5, config.z);
            building.castShadow = true;
            group.add(building);

            // Cooling towers
            for (let i = 0; i < 2; i++) {
                const coolingTower = this.createCoolingTower();
                coolingTower.position.set(config.x + 20, 0, config.z - 5 + i * 10);
                group.add(coolingTower);
            }
        }

        // Section label
        const labelSprite = this.createTextSprite(config.name, config.color);
        labelSprite.position.set(config.x, config.height + 5, config.z);
        group.add(labelSprite);

        return group;
    }

    // Create distillation tower
    createTower(height, glowColor) {
        const group = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(2, 3, height, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0x888899,
            metalness: 0.7,
            roughness: 0.3
        });
        const tower = new THREE.Mesh(geometry, material);
        tower.castShadow = true;
        group.add(tower);

        // Dome
        const domeGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, material);
        dome.position.y = height / 2;
        group.add(dome);

        // Glow rings
        for (let i = 0; i < 4; i++) {
            const ringGeometry = new THREE.TorusGeometry(2.5, 0.1, 8, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: glowColor,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.y = -height/2 + (i + 1) * height/5;
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
        }

        return group;
    }

    // Create storage tank
    createStorageTank(glowColor) {
        const group = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(5, 5, 8, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.5,
            roughness: 0.5
        });
        const tank = new THREE.Mesh(geometry, material);
        tank.castShadow = true;
        group.add(tank);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(5.2, 2, 32);
        const roof = new THREE.Mesh(roofGeometry, material);
        roof.position.y = 5;
        group.add(roof);

        // Level indicator (random fill)
        const fillLevel = 0.3 + Math.random() * 0.6;
        const fillGeometry = new THREE.CylinderGeometry(4.8, 4.8, 7.5 * fillLevel, 32);
        const fillMaterial = new THREE.MeshBasicMaterial({
            color: glowColor,
            transparent: true,
            opacity: 0.4
        });
        const fill = new THREE.Mesh(fillGeometry, fillMaterial);
        fill.position.y = -4 + (7.5 * fillLevel) / 2;
        group.add(fill);

        return group;
    }

    // Create cooling tower
    createCoolingTower() {
        const group = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(3, 5, 15, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0x666677,
            roughness: 0.8
        });
        const tower = new THREE.Mesh(geometry, material);
        tower.position.y = 7.5;
        tower.castShadow = true;
        group.add(tower);

        return group;
    }

    // Create pipe network
    createPipeNetwork() {
        const group = new THREE.Group();

        const pipeMaterial = new THREE.MeshStandardMaterial({
            color: 0x555566,
            metalness: 0.8,
            roughness: 0.3
        });

        // Main pipe routes
        const routes = [
            [[-30, 2, -5], [0, 2, -5], [0, 2, 0]],
            [[0, 2, 0], [30, 2, 0], [30, 2, -20]],
            [[-30, 2, -35], [-30, 2, 10], [-40, 2, 30]],
            [[40, 2, 30], [40, 2, 0], [30, 2, -5]]
        ];

        routes.forEach(route => {
            for (let i = 0; i < route.length - 1; i++) {
                const pipe = this.createPipe(route[i], route[i + 1], 0.3, pipeMaterial);
                group.add(pipe);
            }
        });

        return group;
    }

    // Create text sprite
    createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.font = 'Bold 32px Orbitron, monospace';
        context.textAlign = 'center';
        context.fillText(text, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(20, 5, 1);

        return sprite;
    }

    // Setup facility controls
    setupFacilityControls(canvas, camera, group) {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotationY = 0;
        let rotationX = 0;
        let zoom = 1;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotationY += deltaX * 0.005;
            rotationX = Math.max(-0.5, Math.min(0.5, rotationX + deltaY * 0.005));

            const radius = 100 * zoom;
            camera.position.x = radius * Math.sin(rotationY) * Math.cos(rotationX);
            camera.position.y = 60 + radius * Math.sin(rotationX);
            camera.position.z = radius * Math.cos(rotationY) * Math.cos(rotationX);
            camera.lookAt(0, 0, 0);

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            zoom = Math.max(0.5, Math.min(2, zoom + e.deltaY * 0.001));
            
            const radius = 100 * zoom;
            camera.position.x = radius * Math.sin(rotationY) * Math.cos(rotationX);
            camera.position.y = 60 + radius * Math.sin(rotationX);
            camera.position.z = radius * Math.cos(rotationY) * Math.cos(rotationX);
        });
    }

    // Animate data flow
    animateDataFlow(group, time) {
        // Animate glow rings on towers
        group.traverse((child) => {
            if (child.material && child.material.opacity !== undefined && child.geometry && child.geometry.type === 'TorusGeometry') {
                child.material.opacity = 0.4 + Math.sin(time * 2 + child.position.y) * 0.3;
            }
        });
    }

    // Initialize Equipment 3D Scene
    initEquipmentScene(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050810);
        
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x00d4ff, 0.5, 20);
        pointLight.position.set(-3, 3, 3);
        scene.add(pointLight);

        // Create ESP pump model
        const pumpGroup = this.createESPPump();
        scene.add(pumpGroup);

        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);

        this.scenes.equipment = scene;
        this.cameras.equipment = camera;
        this.renderers.equipment = renderer;
        this.pumpGroup = pumpGroup;

        // Auto-rotate
        let autoRotate = true;

        const animate = () => {
            this.animationFrames.equipment = requestAnimationFrame(animate);
            
            const time = this.clock.getElapsedTime();
            
            if (autoRotate) {
                pumpGroup.rotation.y = time * 0.3;
            }
            
            // Animate internal components
            this.animatePumpComponents(pumpGroup, time);
            
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => this.handleResize('equipment', canvas));
    }

    // Create ESP Pump model
    createESPPump() {
        const group = new THREE.Group();

        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x888899,
            metalness: 0.8,
            roughness: 0.2
        });

        const copperMaterial = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.9,
            roughness: 0.3
        });

        // Motor housing
        const motorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
        const motor = new THREE.Mesh(motorGeometry, metalMaterial);
        motor.position.y = -1;
        group.add(motor);

        // Pump stages
        for (let i = 0; i < 5; i++) {
            const stageGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.4, 32);
            const stage = new THREE.Mesh(stageGeometry, metalMaterial);
            stage.position.y = 0.8 + i * 0.5;
            group.add(stage);

            // Impeller (visible through cutaway)
            const impellerGeometry = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
            const impeller = new THREE.Mesh(impellerGeometry, copperMaterial);
            impeller.position.y = 0.8 + i * 0.5;
            impeller.rotation.x = Math.PI / 2;
            impeller.userData.isImpeller = true;
            group.add(impeller);
        }

        // Shaft
        const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
        const shaft = new THREE.Mesh(shaftGeometry, copperMaterial);
        shaft.position.y = 0.5;
        shaft.userData.isShaft = true;
        group.add(shaft);

        // Cable
        const cableGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
        const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const cable = new THREE.Mesh(cableGeometry, cableMaterial);
        cable.position.set(0.9, -2, 0);
        group.add(cable);

        // Intake screen
        const intakeGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32, 1, true);
        const intakeMaterial = new THREE.MeshStandardMaterial({
            color: 0x666677,
            wireframe: true
        });
        const intake = new THREE.Mesh(intakeGeometry, intakeMaterial);
        intake.position.y = -2.7;
        group.add(intake);

        return group;
    }

    // Animate pump components
    animatePumpComponents(group, time) {
        group.traverse((child) => {
            if (child.userData.isImpeller) {
                child.rotation.z = time * 10;
            }
            if (child.userData.isShaft) {
                child.rotation.y = time * 10;
            }
        });
    }

    // Initialize Hero Canvas Background
    initHeroCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#00d4ff' : '#5b2d8c'
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connect nearby particles
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Handle window resize
    handleResize(sceneKey, canvas) {
        const camera = this.cameras[sceneKey];
        const renderer = this.renderers[sceneKey];

        if (camera && renderer) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    }

    // Cleanup
    dispose(sceneKey) {
        if (this.animationFrames[sceneKey]) {
            cancelAnimationFrame(this.animationFrames[sceneKey]);
        }
        if (this.renderers[sceneKey]) {
            this.renderers[sceneKey].dispose();
        }
    }
}

// Export
window.ThreeScenes = new ThreeScenes();
