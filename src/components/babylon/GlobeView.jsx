import { useCallback, useState } from 'react';
import {
  Vector3,
  Color3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  PBRMaterial,
  GlowLayer,
  HighlightLayer,
  Animation,
  CubicEase,
  EasingFunction,
  ActionManager,
  ExecuteCodeAction,
  Texture,
  DynamicTexture
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control, Line } from '@babylonjs/gui';
import BabylonScene from './BabylonScene';
import { 
  bapcoLocations, 
  BAHRAIN_CENTER, 
  GLOBE_CONFIG,
  locationTypeColors,
  latLngToVector3,
  getHeroLocation
} from '../../data/bapcoLocations';

function GlobeView({ onLocationSelect, onDrillDown, viewMode = 'globe' }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const onSceneReady = useCallback((scene, engine, canvas) => {
    scene.clearColor = new Color4(0.039, 0.055, 0.090, 1);

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      GLOBE_CONFIG.radius * GLOBE_CONFIG.initialZoom,
      Vector3.Zero(),
      scene
    );
    
    camera.lowerRadiusLimit = GLOBE_CONFIG.radius * GLOBE_CONFIG.minZoom;
    camera.upperRadiusLimit = GLOBE_CONFIG.radius * GLOBE_CONFIG.maxZoom;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI - 0.1;
    camera.wheelPrecision = 50;
    camera.panningSensibility = 0;
    camera.inertia = 0.9;
    camera.attachControl(canvas, true);

    const hemisphericLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.4;
    hemisphericLight.groundColor = new Color3(0.1, 0.1, 0.2);

    const sunLight = new PointLight('sunLight', new Vector3(50, 30, 50), scene);
    sunLight.intensity = 1.2;
    sunLight.diffuse = new Color3(1, 0.95, 0.9);

    const accentLight = new PointLight('accentLight', new Vector3(-30, 20, -30), scene);
    accentLight.intensity = 0.5;
    accentLight.diffuse = new Color3(0, 0.83, 1);

    const glowLayer = new GlowLayer('glow', scene, {
      mainTextureFixedSize: 512,
      blurKernelSize: 64
    });
    glowLayer.intensity = 0.8;

    const highlightLayer = new HighlightLayer('highlight', scene);

    const globe = MeshBuilder.CreateSphere('globe', {
      diameter: GLOBE_CONFIG.radius * 2,
      segments: GLOBE_CONFIG.segments
    }, scene);

    const globeMaterial = new PBRMaterial('globeMaterial', scene);
    globeMaterial.albedoColor = new Color3(0.05, 0.08, 0.15);
    globeMaterial.metallic = 0.3;
    globeMaterial.roughness = 0.7;
    globeMaterial.emissiveColor = new Color3(0.02, 0.04, 0.08);
    globe.material = globeMaterial;

    const gridLines = createGlobeGrid(scene, GLOBE_CONFIG.radius);

    const atmosphere = MeshBuilder.CreateSphere('atmosphere', {
      diameter: GLOBE_CONFIG.radius * 2.08,
      segments: 32
    }, scene);
    
    const atmosphereMaterial = new StandardMaterial('atmosphereMaterial', scene);
    atmosphereMaterial.emissiveColor = new Color3(0, 0.3, 0.5);
    atmosphereMaterial.alpha = 0.15;
    atmosphereMaterial.backFaceCulling = false;
    atmosphere.material = atmosphereMaterial;

    const bahrain = createBahrainHighlight(scene, GLOBE_CONFIG.radius);

    const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);

    const markers = [];
    bapcoLocations.forEach(location => {
      const marker = createLocationMarker(scene, location, GLOBE_CONFIG.radius, glowLayer, highlightLayer);
      markers.push({ mesh: marker.mesh, location, label: marker.label });

      const label = createMarkerLabel(guiTexture, marker.mesh, location, scene);

      marker.mesh.actionManager = new ActionManager(scene);
      
      marker.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          setSelectedLocation(location);
          if (onLocationSelect) {
            onLocationSelect(location);
          }
          
          highlightLayer.removeAllMeshes();
          highlightLayer.addMesh(marker.mesh, Color3.FromHexString(locationTypeColors[location.type]));
          
          if (location.drillDown && onDrillDown) {
            animateCameraToLocation(camera, location, scene, () => {
              onDrillDown(location);
            });
          }
        })
      );

      marker.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          document.body.style.cursor = 'pointer';
          marker.mesh.scaling = new Vector3(1.3, 1.3, 1.3);
          label.isVisible = true;
        })
      );

      marker.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
          document.body.style.cursor = 'default';
          marker.mesh.scaling = new Vector3(1, 1, 1);
          if (!selectedLocation || selectedLocation.id !== location.id) {
            label.isVisible = false;
          }
        })
      );
    });

    createStarfield(scene);

    const bahPos = latLngToVector3(BAHRAIN_CENTER.lat, BAHRAIN_CENTER.lng, GLOBE_CONFIG.radius);
    const targetAlpha = Math.atan2(bahPos.x, bahPos.z);
    const targetBeta = Math.acos(bahPos.y / GLOBE_CONFIG.radius);
    
    Animation.CreateAndStartAnimation(
      'cameraAlpha',
      camera,
      'alpha',
      60,
      120,
      camera.alpha,
      targetAlpha,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      new CubicEase()
    );
    
    Animation.CreateAndStartAnimation(
      'cameraBeta',
      camera,
      'beta',
      60,
      120,
      camera.beta,
      targetBeta,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      new CubicEase()
    );

    scene.metadata = { camera, markers, highlightLayer, glowLayer, guiTexture };

  }, [onLocationSelect, onDrillDown]);

  const onRender = useCallback((scene) => {
    if (scene.metadata?.markers) {
      scene.metadata.markers.forEach(({ mesh }) => {
        mesh.rotation.y += 0.01;
      });
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BabylonScene
        onSceneReady={onSceneReady}
        onRender={onRender}
        className="globe-canvas"
      />
      {selectedLocation && (
        <div className="location-info-panel">
          <h3>{selectedLocation.name}</h3>
          <p className="location-type">{selectedLocation.type}</p>
          <p>{selectedLocation.description}</p>
          {selectedLocation.capacity && (
            <p className="location-capacity">Capacity: {selectedLocation.capacity}</p>
          )}
          {selectedLocation.drillDown && (
            <button 
              className="drill-down-btn"
              onClick={() => onDrillDown && onDrillDown(selectedLocation)}
            >
              Explore Facility →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function createGlobeGrid(scene, radius) {
  const gridMaterial = new StandardMaterial('gridMaterial', scene);
  gridMaterial.emissiveColor = new Color3(0, 0.5, 0.7);
  gridMaterial.alpha = 0.3;
  gridMaterial.wireframe = true;

  const latLines = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const phi = (90 - lat) * (Math.PI / 180);
    const lineRadius = radius * Math.sin(phi);
    const y = radius * Math.cos(phi);
    
    const circle = MeshBuilder.CreateTorus(`lat_${lat}`, {
      diameter: lineRadius * 2,
      thickness: 0.02,
      tessellation: 64
    }, scene);
    circle.position.y = y;
    circle.material = gridMaterial;
    latLines.push(circle);
  }

  const lngLines = [];
  for (let lng = 0; lng < 360; lng += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const pos = latLngToVector3(lat, lng, radius);
      points.push(new Vector3(pos.x, pos.y, pos.z));
    }
    const line = MeshBuilder.CreateLines(`lng_${lng}`, { points }, scene);
    line.color = new Color3(0, 0.5, 0.7);
    line.alpha = 0.3;
    lngLines.push(line);
  }

  return { latLines, lngLines };
}

function createBahrainHighlight(scene, radius) {
  const bahrainMaterial = new StandardMaterial('bahrainMaterial', scene);
  bahrainMaterial.emissiveColor = new Color3(0, 0.83, 1);
  bahrainMaterial.alpha = 0.6;

  const pos = latLngToVector3(BAHRAIN_CENTER.lat, BAHRAIN_CENTER.lng, radius);
  
  const highlight = MeshBuilder.CreateDisc('bahrainHighlight', {
    radius: 0.8,
    tessellation: 32
  }, scene);
  
  highlight.position = new Vector3(pos.x, pos.y, pos.z);
  highlight.lookAt(Vector3.Zero());
  highlight.position = highlight.position.scale(1.01);
  highlight.material = bahrainMaterial;

  const pulseRing = MeshBuilder.CreateTorus('pulseRing', {
    diameter: 1.6,
    thickness: 0.03,
    tessellation: 32
  }, scene);
  pulseRing.position = highlight.position.clone();
  pulseRing.lookAt(Vector3.Zero());
  
  const pulseMaterial = new StandardMaterial('pulseMaterial', scene);
  pulseMaterial.emissiveColor = new Color3(0, 0.83, 1);
  pulseMaterial.alpha = 0.8;
  pulseRing.material = pulseMaterial;

  const pulseAnimation = new Animation(
    'pulse',
    'scaling',
    30,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  
  pulseAnimation.setKeys([
    { frame: 0, value: new Vector3(1, 1, 1) },
    { frame: 30, value: new Vector3(1.5, 1.5, 1.5) },
    { frame: 60, value: new Vector3(1, 1, 1) }
  ]);
  
  pulseRing.animations.push(pulseAnimation);
  scene.beginAnimation(pulseRing, 0, 60, true);

  const fadeAnimation = new Animation(
    'fade',
    'material.alpha',
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  
  fadeAnimation.setKeys([
    { frame: 0, value: 0.8 },
    { frame: 30, value: 0.2 },
    { frame: 60, value: 0.8 }
  ]);
  
  pulseRing.animations.push(fadeAnimation);

  return { highlight, pulseRing };
}

function createLocationMarker(scene, location, radius, glowLayer, highlightLayer) {
  const pos = latLngToVector3(location.lat, location.lng, radius);
  const color = Color3.FromHexString(locationTypeColors[location.type]);
  
  const markerSize = location.priority === 'hero' ? 0.35 : 0.2;
  
  const marker = MeshBuilder.CreateSphere(`marker_${location.id}`, {
    diameter: markerSize,
    segments: 16
  }, scene);
  
  marker.position = new Vector3(pos.x, pos.y, pos.z).scale(1.02);
  
  const markerMaterial = new StandardMaterial(`markerMat_${location.id}`, scene);
  markerMaterial.emissiveColor = color;
  markerMaterial.diffuseColor = color;
  marker.material = markerMaterial;
  
  glowLayer.addIncludedOnlyMesh(marker);

  if (location.priority === 'hero') {
    const ring = MeshBuilder.CreateTorus(`ring_${location.id}`, {
      diameter: markerSize * 2.5,
      thickness: 0.02,
      tessellation: 32
    }, scene);
    ring.parent = marker;
    
    const ringMaterial = new StandardMaterial(`ringMat_${location.id}`, scene);
    ringMaterial.emissiveColor = color;
    ringMaterial.alpha = 0.7;
    ring.material = ringMaterial;
    
    const rotateAnimation = new Animation(
      'rotate',
      'rotation.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    rotateAnimation.setKeys([
      { frame: 0, value: 0 },
      { frame: 120, value: Math.PI * 2 }
    ]);
    ring.animations.push(rotateAnimation);
    scene.beginAnimation(ring, 0, 120, true);
  }

  const stem = MeshBuilder.CreateCylinder(`stem_${location.id}`, {
    height: 0.5,
    diameter: 0.03
  }, scene);
  
  const direction = new Vector3(pos.x, pos.y, pos.z).normalize();
  stem.position = new Vector3(pos.x, pos.y, pos.z).scale(1.01).add(direction.scale(0.25));
  stem.lookAt(Vector3.Zero());
  stem.rotate(Vector3.Right(), Math.PI / 2);
  
  const stemMaterial = new StandardMaterial(`stemMat_${location.id}`, scene);
  stemMaterial.emissiveColor = color.scale(0.5);
  stem.material = stemMaterial;

  return { mesh: marker, stem };
}

function createMarkerLabel(guiTexture, mesh, location, scene) {
  const label = new Rectangle(`label_${location.id}`);
  label.width = '200px';
  label.height = '60px';
  label.cornerRadius = 8;
  label.color = locationTypeColors[location.type];
  label.thickness = 2;
  label.background = 'rgba(10, 14, 23, 0.9)';
  label.isVisible = false;
  guiTexture.addControl(label);
  label.linkWithMesh(mesh);
  label.linkOffsetY = -60;

  const title = new TextBlock();
  title.text = location.shortName || location.name;
  title.color = 'white';
  title.fontSize = 14;
  title.fontWeight = 'bold';
  title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  title.paddingTop = '8px';
  label.addControl(title);

  const type = new TextBlock();
  type.text = location.type.toUpperCase();
  type.color = locationTypeColors[location.type];
  type.fontSize = 10;
  type.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  type.paddingBottom = '8px';
  label.addControl(type);

  return label;
}

function createStarfield(scene) {
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 80 + Math.random() * 40;
    
    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = r * Math.cos(phi);
  }

  const starMaterial = new StandardMaterial('starMaterial', scene);
  starMaterial.emissiveColor = new Color3(1, 1, 1);
  starMaterial.disableLighting = true;

  for (let i = 0; i < starCount; i++) {
    const star = MeshBuilder.CreateSphere(`star_${i}`, {
      diameter: 0.05 + Math.random() * 0.1,
      segments: 4
    }, scene);
    star.position = new Vector3(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    star.material = starMaterial;
  }
}

function animateCameraToLocation(camera, location, scene, onComplete) {
  const pos = latLngToVector3(location.lat, location.lng, GLOBE_CONFIG.radius);
  const targetAlpha = Math.atan2(pos.x, pos.z);
  const targetBeta = Math.acos(pos.y / GLOBE_CONFIG.radius);
  const targetRadius = GLOBE_CONFIG.radius * 1.8;

  const ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

  Animation.CreateAndStartAnimation(
    'zoomAlpha',
    camera,
    'alpha',
    60,
    90,
    camera.alpha,
    targetAlpha,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );

  Animation.CreateAndStartAnimation(
    'zoomBeta',
    camera,
    'beta',
    60,
    90,
    camera.beta,
    targetBeta,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );

  Animation.CreateAndStartAnimation(
    'zoomRadius',
    camera,
    'radius',
    60,
    90,
    camera.radius,
    targetRadius,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease,
    () => {
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }
  );
}

export default GlobeView;
