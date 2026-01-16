import { useCallback, useState, useEffect } from 'react';
import {
  Vector3,
  Color3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  SpotLight,
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
  ShadowGenerator,
  ParticleSystem,
  Texture,
  GPUParticleSystem
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control, Line, Ellipse } from '@babylonjs/gui';
import BabylonScene from './BabylonScene';
import { setupPostProcessing, createIndustrialColorGrading } from './PostProcessing';
import { createFlameEffect, createSmokeEffect, createCoolingTowerSteam } from './PipelineParticles';

const REFINERY_UNITS = [
  {
    id: 'cdu-1',
    name: 'CDU - Crude Distillation Unit',
    shortName: 'CDU-1',
    type: 'distillation',
    position: { x: -15, y: 0, z: 0 },
    status: 'operational',
    capacity: '225,000 BPD',
    temperature: '365°C',
    color: '#00d4ff'
  },
  {
    id: 'rhcu-1',
    name: 'RHCU - Resid Hydrocracking',
    shortName: 'RHCU',
    type: 'hydrocracking',
    position: { x: 0, y: 0, z: -12 },
    status: 'warning',
    capacity: '65,000 BPD',
    pressure: '2,150 PSI',
    color: '#ffd93d'
  },
  {
    id: 'fcc-1',
    name: 'FCC - Fluid Catalytic Cracker',
    shortName: 'FCC',
    type: 'cracking',
    position: { x: 15, y: 0, z: 0 },
    status: 'operational',
    capacity: '45,000 BPD',
    temperature: '538°C',
    color: '#ff6b6b'
  },
  {
    id: 'hds-1',
    name: 'HDS - Hydrodesulfurization',
    shortName: 'HDS',
    type: 'treatment',
    position: { x: 8, y: 0, z: -18 },
    status: 'operational',
    capacity: '80,000 BPD',
    color: '#6bcb77'
  },
  {
    id: 'tank-farm',
    name: 'Tank Farm - Storage',
    shortName: 'Tank Farm',
    type: 'storage',
    position: { x: -20, y: 0, z: 20 },
    status: 'operational',
    capacity: '14M BBL',
    color: '#4d96ff'
  },
  {
    id: 'marine-terminal',
    name: 'Marine Terminal',
    shortName: 'Terminal',
    type: 'terminal',
    position: { x: 25, y: 0, z: 25 },
    status: 'operational',
    color: '#9d4edd'
  },
  {
    id: 'control-building',
    name: 'Main Control Building',
    shortName: 'Control',
    type: 'control',
    position: { x: -25, y: 0, z: -15 },
    status: 'operational',
    color: '#ff9f43'
  },
  {
    id: 'utilities',
    name: 'Utilities & Power Plant',
    shortName: 'Utilities',
    type: 'utilities',
    position: { x: 20, y: 0, z: -20 },
    status: 'operational',
    power: '145 MW',
    color: '#00d4ff'
  }
];

function SitraRefinery({ onUnitSelect, onBack, selectedUnit }) {
  const [hoveredUnit, setHoveredUnit] = useState(null);

  const onSceneReady = useCallback((scene, engine, canvas) => {
    scene.clearColor = new Color4(0.039, 0.055, 0.090, 1);

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 4,
      Math.PI / 3,
      80,
      new Vector3(0, 5, 0),
      scene
    );
    
    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 150;
    camera.lowerBetaLimit = 0.2;
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.wheelPrecision = 20;
    camera.panningSensibility = 100;
    camera.inertia = 0.9;
    camera.attachControl(canvas, true);

    const hemisphericLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.3;
    hemisphericLight.groundColor = new Color3(0.05, 0.05, 0.1);

    const sunLight = new DirectionalLight('sunLight', new Vector3(-1, -2, -1), scene);
    sunLight.position = new Vector3(50, 100, 50);
    sunLight.intensity = 0.8;
    sunLight.diffuse = new Color3(1, 0.95, 0.9);

    const shadowGenerator = new ShadowGenerator(2048, sunLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    const cyanLight = new PointLight('cyanLight', new Vector3(-30, 30, 30), scene);
    cyanLight.intensity = 0.5;
    cyanLight.diffuse = new Color3(0, 0.83, 1);

    const purpleLight = new PointLight('purpleLight', new Vector3(30, 20, -30), scene);
    purpleLight.intensity = 0.3;
    purpleLight.diffuse = new Color3(0.6, 0.3, 0.9);

    const glowLayer = new GlowLayer('glow', scene, {
      mainTextureFixedSize: 512,
      blurKernelSize: 64
    });
    glowLayer.intensity = 0.6;

    const highlightLayer = new HighlightLayer('highlight', scene);

    const ground = MeshBuilder.CreateGround('ground', {
      width: 200,
      height: 200,
      subdivisions: 50
    }, scene);
    
    const groundMaterial = new PBRMaterial('groundMat', scene);
    groundMaterial.albedoColor = new Color3(0.05, 0.07, 0.1);
    groundMaterial.metallic = 0.2;
    groundMaterial.roughness = 0.9;
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    createGridOverlay(scene);

    const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);

    const unitMeshes = {};
    REFINERY_UNITS.forEach(unit => {
      const meshGroup = createRefineryUnit(scene, unit, shadowGenerator, glowLayer);
      unitMeshes[unit.id] = meshGroup;

      const label = createUnitLabel(guiTexture, meshGroup.mainMesh, unit);

      meshGroup.mainMesh.actionManager = new ActionManager(scene);
      
      meshGroup.mainMesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          if (onUnitSelect) {
            onUnitSelect(unit);
          }
          highlightLayer.removeAllMeshes();
          highlightLayer.addMesh(meshGroup.mainMesh, Color3.FromHexString(unit.color));
        })
      );

      meshGroup.mainMesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          document.body.style.cursor = 'pointer';
          setHoveredUnit(unit);
          meshGroup.allMeshes.forEach(m => {
            if (m.material && m.material.emissiveColor) {
              m.material.emissiveIntensity = 0.3;
            }
          });
          label.isVisible = true;
        })
      );

      meshGroup.mainMesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
          document.body.style.cursor = 'default';
          setHoveredUnit(null);
          meshGroup.allMeshes.forEach(m => {
            if (m.material && m.material.emissiveColor) {
              m.material.emissiveIntensity = 0.1;
            }
          });
          label.isVisible = false;
        })
      );
    });

    createPipelines(scene, glowLayer);
    createFlareStack(scene, glowLayer);

    const pipeline = setupPostProcessing(scene, camera);
    createIndustrialColorGrading(pipeline);

    const flareFlame = createFlameEffect(scene, new Vector3(35, 40, -25));
    const flareSmoke = createSmokeEffect(scene, new Vector3(35, 45, -25), 0.5);

    const coolingPositions = [
      new Vector3(8, 12, -30),
      new Vector3(16, 12, -30),
      new Vector3(24, 12, -30)
    ];
    const steamEffects = coolingPositions.map(pos => 
      createCoolingTowerSteam(scene, pos, 2)
    );

    animateCameraEntry(camera);

    scene.metadata = { 
      camera, 
      unitMeshes, 
      highlightLayer, 
      glowLayer, 
      guiTexture,
      pipeline,
      effects: { flareFlame, flareSmoke, steamEffects }
    };

  }, [onUnitSelect]);

  const onRender = useCallback((scene) => {
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BabylonScene
        onSceneReady={onSceneReady}
        onRender={onRender}
        className="refinery-canvas"
      />
      {hoveredUnit && (
        <div className="unit-hover-info">
          <span className="unit-name">{hoveredUnit.shortName}</span>
          <span className={`unit-status ${hoveredUnit.status}`}>{hoveredUnit.status}</span>
        </div>
      )}
    </div>
  );
}

function createGridOverlay(scene) {
  const gridMaterial = new StandardMaterial('gridMat', scene);
  gridMaterial.emissiveColor = new Color3(0, 0.3, 0.4);
  gridMaterial.alpha = 0.3;

  for (let i = -100; i <= 100; i += 10) {
    const lineX = MeshBuilder.CreateLines(`gridX_${i}`, {
      points: [new Vector3(i, 0.05, -100), new Vector3(i, 0.05, 100)]
    }, scene);
    lineX.color = new Color3(0, 0.3, 0.4);
    lineX.alpha = 0.2;

    const lineZ = MeshBuilder.CreateLines(`gridZ_${i}`, {
      points: [new Vector3(-100, 0.05, i), new Vector3(100, 0.05, i)]
    }, scene);
    lineZ.color = new Color3(0, 0.3, 0.4);
    lineZ.alpha = 0.2;
  }
}

function createRefineryUnit(scene, unit, shadowGenerator, glowLayer) {
  const color = Color3.FromHexString(unit.color);
  const allMeshes = [];
  let mainMesh;

  const baseMaterial = new PBRMaterial(`mat_${unit.id}`, scene);
  baseMaterial.albedoColor = new Color3(0.15, 0.18, 0.22);
  baseMaterial.metallic = 0.6;
  baseMaterial.roughness = 0.4;
  baseMaterial.emissiveColor = color.scale(0.1);

  const accentMaterial = new StandardMaterial(`accent_${unit.id}`, scene);
  accentMaterial.emissiveColor = color;
  accentMaterial.diffuseColor = color;
  accentMaterial.alpha = 0.8;

  switch (unit.type) {
    case 'distillation':
      mainMesh = createDistillationTower(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'hydrocracking':
      mainMesh = createHydrocracker(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'cracking':
      mainMesh = createFCC(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'treatment':
      mainMesh = createTreatmentUnit(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'storage':
      mainMesh = createTankFarm(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'terminal':
      mainMesh = createMarineTerminal(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'control':
      mainMesh = createControlBuilding(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    case 'utilities':
      mainMesh = createUtilities(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator);
      break;
    default:
      mainMesh = MeshBuilder.CreateBox(`box_${unit.id}`, { size: 5 }, scene);
      mainMesh.position = new Vector3(unit.position.x, 2.5, unit.position.z);
      mainMesh.material = baseMaterial;
      allMeshes.push(mainMesh);
  }

  allMeshes.forEach(m => {
    shadowGenerator.addShadowCaster(m);
    if (m.material && m.material.emissiveColor) {
      glowLayer.addIncludedOnlyMesh(m);
    }
  });

  return { mainMesh, allMeshes };
}

function createDistillationTower(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;
  
  const mainTower = MeshBuilder.CreateCylinder(`tower_${unit.id}`, {
    height: 25,
    diameterTop: 3,
    diameterBottom: 4,
    tessellation: 32
  }, scene);
  mainTower.position = new Vector3(x, 12.5, z);
  mainTower.material = baseMaterial;
  allMeshes.push(mainTower);

  for (let i = 0; i < 5; i++) {
    const ring = MeshBuilder.CreateTorus(`ring_${unit.id}_${i}`, {
      diameter: 4.5,
      thickness: 0.15,
      tessellation: 32
    }, scene);
    ring.position = new Vector3(x, 3 + i * 5, z);
    ring.material = accentMaterial;
    allMeshes.push(ring);
  }

  const secondTower = MeshBuilder.CreateCylinder(`tower2_${unit.id}`, {
    height: 18,
    diameterTop: 2.5,
    diameterBottom: 3,
    tessellation: 32
  }, scene);
  secondTower.position = new Vector3(x + 6, 9, z);
  secondTower.material = baseMaterial;
  allMeshes.push(secondTower);

  for (let i = 0; i < 4; i++) {
    const platform = MeshBuilder.CreateBox(`platform_${unit.id}_${i}`, {
      width: 6,
      height: 0.2,
      depth: 6
    }, scene);
    platform.position = new Vector3(x, 5 + i * 6, z);
    platform.material = baseMaterial;
    allMeshes.push(platform);
  }

  const furnace = MeshBuilder.CreateBox(`furnace_${unit.id}`, {
    width: 8,
    height: 6,
    depth: 5
  }, scene);
  furnace.position = new Vector3(x - 8, 3, z);
  furnace.material = baseMaterial;
  allMeshes.push(furnace);

  return mainTower;
}

function createHydrocracker(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const reactor1 = MeshBuilder.CreateCylinder(`reactor1_${unit.id}`, {
    height: 15,
    diameter: 5,
    tessellation: 32
  }, scene);
  reactor1.position = new Vector3(x, 7.5, z);
  reactor1.material = baseMaterial;
  allMeshes.push(reactor1);

  const reactor2 = MeshBuilder.CreateCylinder(`reactor2_${unit.id}`, {
    height: 15,
    diameter: 5,
    tessellation: 32
  }, scene);
  reactor2.position = new Vector3(x + 8, 7.5, z);
  reactor2.material = baseMaterial;
  allMeshes.push(reactor2);

  const topCap1 = MeshBuilder.CreateSphere(`cap1_${unit.id}`, {
    diameter: 5,
    slice: 0.5
  }, scene);
  topCap1.position = new Vector3(x, 15, z);
  topCap1.material = accentMaterial;
  allMeshes.push(topCap1);

  const topCap2 = MeshBuilder.CreateSphere(`cap2_${unit.id}`, {
    diameter: 5,
    slice: 0.5
  }, scene);
  topCap2.position = new Vector3(x + 8, 15, z);
  topCap2.material = accentMaterial;
  allMeshes.push(topCap2);

  const compressorHouse = MeshBuilder.CreateBox(`compressor_${unit.id}`, {
    width: 10,
    height: 5,
    depth: 6
  }, scene);
  compressorHouse.position = new Vector3(x + 4, 2.5, z - 8);
  compressorHouse.material = baseMaterial;
  allMeshes.push(compressorHouse);

  return reactor1;
}

function createFCC(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const reactor = MeshBuilder.CreateCylinder(`reactor_${unit.id}`, {
    height: 20,
    diameterTop: 6,
    diameterBottom: 4,
    tessellation: 32
  }, scene);
  reactor.position = new Vector3(x, 10, z);
  reactor.material = baseMaterial;
  allMeshes.push(reactor);

  const regenerator = MeshBuilder.CreateCylinder(`regen_${unit.id}`, {
    height: 18,
    diameter: 8,
    tessellation: 32
  }, scene);
  regenerator.position = new Vector3(x - 10, 9, z);
  regenerator.material = baseMaterial;
  allMeshes.push(regenerator);

  const riser = MeshBuilder.CreateCylinder(`riser_${unit.id}`, {
    height: 25,
    diameter: 1.5,
    tessellation: 16
  }, scene);
  riser.position = new Vector3(x - 5, 12.5, z);
  riser.material = accentMaterial;
  allMeshes.push(riser);

  const fractionator = MeshBuilder.CreateCylinder(`frac_${unit.id}`, {
    height: 22,
    diameterTop: 3,
    diameterBottom: 4,
    tessellation: 32
  }, scene);
  fractionator.position = new Vector3(x + 8, 11, z);
  fractionator.material = baseMaterial;
  allMeshes.push(fractionator);

  return reactor;
}

function createTreatmentUnit(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  for (let i = 0; i < 3; i++) {
    const vessel = MeshBuilder.CreateCylinder(`vessel_${unit.id}_${i}`, {
      height: 12,
      diameter: 3,
      tessellation: 32
    }, scene);
    vessel.position = new Vector3(x + i * 5, 6, z);
    vessel.material = baseMaterial;
    allMeshes.push(vessel);

    const cap = MeshBuilder.CreateSphere(`cap_${unit.id}_${i}`, {
      diameter: 3,
      slice: 0.5
    }, scene);
    cap.position = new Vector3(x + i * 5, 12, z);
    cap.material = accentMaterial;
    allMeshes.push(cap);
  }

  const pumpHouse = MeshBuilder.CreateBox(`pump_${unit.id}`, {
    width: 12,
    height: 3,
    depth: 4
  }, scene);
  pumpHouse.position = new Vector3(x + 5, 1.5, z - 5);
  pumpHouse.material = baseMaterial;
  allMeshes.push(pumpHouse);

  return allMeshes[0];
}

function createTankFarm(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const tankPositions = [
    { dx: 0, dz: 0, r: 8, h: 12 },
    { dx: 18, dz: 0, r: 8, h: 12 },
    { dx: 0, dz: 18, r: 8, h: 12 },
    { dx: 18, dz: 18, r: 8, h: 12 },
    { dx: -12, dz: 9, r: 5, h: 8 },
    { dx: 30, dz: 9, r: 5, h: 8 }
  ];

  let mainTank;
  tankPositions.forEach((pos, i) => {
    const tank = MeshBuilder.CreateCylinder(`tank_${unit.id}_${i}`, {
      height: pos.h,
      diameter: pos.r * 2,
      tessellation: 32
    }, scene);
    tank.position = new Vector3(x + pos.dx, pos.h / 2, z + pos.dz);
    tank.material = baseMaterial;
    allMeshes.push(tank);

    if (i === 0) mainTank = tank;

    const roof = MeshBuilder.CreateCylinder(`roof_${unit.id}_${i}`, {
      height: 0.5,
      diameterTop: pos.r * 1.8,
      diameterBottom: pos.r * 2,
      tessellation: 32
    }, scene);
    roof.position = new Vector3(x + pos.dx, pos.h + 0.25, z + pos.dz);
    roof.material = accentMaterial;
    allMeshes.push(roof);
  });

  for (let i = 0; i < 3; i++) {
    const sphere = MeshBuilder.CreateSphere(`sphere_${unit.id}_${i}`, {
      diameter: 6,
      segments: 16
    }, scene);
    sphere.position = new Vector3(x + 36 + i * 8, 5, z + 5);
    sphere.material = baseMaterial;
    allMeshes.push(sphere);

    const legs = [];
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2;
      const leg = MeshBuilder.CreateCylinder(`leg_${unit.id}_${i}_${j}`, {
        height: 5,
        diameter: 0.3,
        tessellation: 8
      }, scene);
      leg.position = new Vector3(
        x + 36 + i * 8 + Math.cos(angle) * 2.5,
        2.5,
        z + 5 + Math.sin(angle) * 2.5
      );
      leg.material = baseMaterial;
      allMeshes.push(leg);
    }
  }

  return mainTank;
}

function createMarineTerminal(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const water = MeshBuilder.CreateGround(`water_${unit.id}`, {
    width: 40,
    height: 30
  }, scene);
  water.position = new Vector3(x + 10, -0.1, z + 15);
  const waterMat = new StandardMaterial(`waterMat_${unit.id}`, scene);
  waterMat.diffuseColor = new Color3(0.1, 0.2, 0.4);
  waterMat.alpha = 0.7;
  water.material = waterMat;
  allMeshes.push(water);

  const jetty = MeshBuilder.CreateBox(`jetty_${unit.id}`, {
    width: 35,
    height: 2,
    depth: 5
  }, scene);
  jetty.position = new Vector3(x + 8, 1, z + 10);
  jetty.material = baseMaterial;
  allMeshes.push(jetty);

  for (let i = 0; i < 3; i++) {
    const arm = MeshBuilder.CreateCylinder(`arm_${unit.id}_${i}`, {
      height: 15,
      diameter: 0.5,
      tessellation: 8
    }, scene);
    arm.position = new Vector3(x + i * 12, 8.5, z + 10);
    arm.rotation.z = Math.PI / 6;
    arm.material = accentMaterial;
    allMeshes.push(arm);
  }

  const controlRoom = MeshBuilder.CreateBox(`control_${unit.id}`, {
    width: 6,
    height: 4,
    depth: 4
  }, scene);
  controlRoom.position = new Vector3(x - 5, 2, z);
  controlRoom.material = baseMaterial;
  allMeshes.push(controlRoom);

  return jetty;
}

function createControlBuilding(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const mainBuilding = MeshBuilder.CreateBox(`main_${unit.id}`, {
    width: 20,
    height: 8,
    depth: 15
  }, scene);
  mainBuilding.position = new Vector3(x, 4, z);
  mainBuilding.material = baseMaterial;
  allMeshes.push(mainBuilding);

  const roof = MeshBuilder.CreateBox(`roof_${unit.id}`, {
    width: 22,
    height: 0.5,
    depth: 17
  }, scene);
  roof.position = new Vector3(x, 8.25, z);
  roof.material = accentMaterial;
  allMeshes.push(roof);

  const antenna = MeshBuilder.CreateCylinder(`antenna_${unit.id}`, {
    height: 8,
    diameter: 0.3,
    tessellation: 8
  }, scene);
  antenna.position = new Vector3(x + 8, 12, z + 5);
  antenna.material = accentMaterial;
  allMeshes.push(antenna);

  const dish = MeshBuilder.CreateSphere(`dish_${unit.id}`, {
    diameter: 3,
    slice: 0.25
  }, scene);
  dish.position = new Vector3(x - 5, 9, z - 5);
  dish.rotation.x = Math.PI / 4;
  dish.material = baseMaterial;
  allMeshes.push(dish);

  return mainBuilding;
}

function createUtilities(scene, unit, baseMaterial, accentMaterial, allMeshes, shadowGenerator) {
  const { x, z } = unit.position;

  const powerhouse = MeshBuilder.CreateBox(`powerhouse_${unit.id}`, {
    width: 15,
    height: 10,
    depth: 12
  }, scene);
  powerhouse.position = new Vector3(x, 5, z);
  powerhouse.material = baseMaterial;
  allMeshes.push(powerhouse);

  for (let i = 0; i < 2; i++) {
    const stack = MeshBuilder.CreateCylinder(`stack_${unit.id}_${i}`, {
      height: 25,
      diameterTop: 2,
      diameterBottom: 3,
      tessellation: 16
    }, scene);
    stack.position = new Vector3(x + 10 + i * 5, 12.5, z);
    stack.material = baseMaterial;
    allMeshes.push(stack);

    const stackTop = MeshBuilder.CreateTorus(`stackTop_${unit.id}_${i}`, {
      diameter: 2.5,
      thickness: 0.2,
      tessellation: 16
    }, scene);
    stackTop.position = new Vector3(x + 10 + i * 5, 25, z);
    stackTop.material = accentMaterial;
    allMeshes.push(stackTop);
  }

  for (let i = 0; i < 3; i++) {
    const coolingTower = MeshBuilder.CreateCylinder(`cooling_${unit.id}_${i}`, {
      height: 12,
      diameterTop: 6,
      diameterBottom: 4,
      tessellation: 32
    }, scene);
    coolingTower.position = new Vector3(x - 12 + i * 8, 6, z - 10);
    coolingTower.material = baseMaterial;
    allMeshes.push(coolingTower);
  }

  return powerhouse;
}

function createPipelines(scene, glowLayer) {
  const pipeMaterial = new StandardMaterial('pipeMat', scene);
  pipeMaterial.emissiveColor = new Color3(0, 0.3, 0.4);
  pipeMaterial.diffuseColor = new Color3(0.2, 0.3, 0.4);

  const pipeRoutes = [
    { from: [-15, 2, 0], to: [0, 2, -12] },
    { from: [0, 2, -12], to: [15, 2, 0] },
    { from: [-15, 2, 0], to: [-20, 2, 20] },
    { from: [15, 2, 0], to: [25, 2, 25] },
    { from: [8, 2, -18], to: [20, 2, -20] }
  ];

  pipeRoutes.forEach((route, i) => {
    const start = new Vector3(...route.from);
    const end = new Vector3(...route.to);
    const direction = end.subtract(start);
    const length = direction.length();
    
    const pipe = MeshBuilder.CreateCylinder(`pipe_${i}`, {
      height: length,
      diameter: 0.4,
      tessellation: 8
    }, scene);
    
    pipe.position = start.add(end).scale(0.5);
    pipe.lookAt(end);
    pipe.rotation.x += Math.PI / 2;
    pipe.material = pipeMaterial;
  });
}

function createFlareStack(scene, glowLayer) {
  const { x, z } = { x: 35, z: -25 };

  const stackMaterial = new StandardMaterial('flareMat', scene);
  stackMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3);

  const stack = MeshBuilder.CreateCylinder('flareStack', {
    height: 40,
    diameterTop: 1,
    diameterBottom: 2,
    tessellation: 16
  }, scene);
  stack.position = new Vector3(x, 20, z);
  stack.material = stackMaterial;

  const flameMaterial = new StandardMaterial('flameMat', scene);
  flameMaterial.emissiveColor = new Color3(1, 0.5, 0);
  flameMaterial.diffuseColor = new Color3(1, 0.3, 0);

  const flame = MeshBuilder.CreateCylinder('flame', {
    height: 5,
    diameterTop: 0,
    diameterBottom: 2,
    tessellation: 8
  }, scene);
  flame.position = new Vector3(x, 42.5, z);
  flame.material = flameMaterial;
  glowLayer.addIncludedOnlyMesh(flame);

  const flameAnim = new Animation(
    'flameScale',
    'scaling',
    30,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  flameAnim.setKeys([
    { frame: 0, value: new Vector3(1, 1, 1) },
    { frame: 15, value: new Vector3(1.2, 1.3, 1.2) },
    { frame: 30, value: new Vector3(1, 1, 1) }
  ]);
  flame.animations.push(flameAnim);
  scene.beginAnimation(flame, 0, 30, true);
}

function createUnitLabel(guiTexture, mesh, unit) {
  const label = new Rectangle(`label_${unit.id}`);
  label.width = '160px';
  label.height = '50px';
  label.cornerRadius = 8;
  label.color = unit.color;
  label.thickness = 2;
  label.background = 'rgba(10, 14, 23, 0.95)';
  label.isVisible = false;
  guiTexture.addControl(label);
  label.linkWithMesh(mesh);
  label.linkOffsetY = -80;

  const title = new TextBlock();
  title.text = unit.shortName;
  title.color = 'white';
  title.fontSize = 14;
  title.fontWeight = 'bold';
  title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  title.paddingTop = '8px';
  label.addControl(title);

  const status = new TextBlock();
  status.text = unit.status.toUpperCase();
  status.color = unit.status === 'operational' ? '#6bcb77' : '#ffd93d';
  status.fontSize = 10;
  status.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  status.paddingBottom = '8px';
  label.addControl(status);

  return label;
}

function animateCameraEntry(camera) {
  const ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

  Animation.CreateAndStartAnimation(
    'cameraRadius',
    camera,
    'radius',
    60,
    120,
    150,
    80,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );

  Animation.CreateAndStartAnimation(
    'cameraBeta',
    camera,
    'beta',
    60,
    120,
    Math.PI / 6,
    Math.PI / 3,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
    ease
  );
}

export default SitraRefinery;
