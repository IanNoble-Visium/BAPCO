import {
  ParticleSystem,
  GPUParticleSystem,
  Vector3,
  Color4,
  Texture,
  MeshBuilder,
  Animation
} from '@babylonjs/core';

export function createPipelineFlowParticles(scene, startPoint, endPoint, color = new Color4(0, 0.83, 1, 1)) {
  const direction = endPoint.subtract(startPoint);
  const length = direction.length();
  const normalized = direction.normalize();

  const emitter = MeshBuilder.CreateBox('emitter', { size: 0.1 }, scene);
  emitter.position = startPoint.clone();
  emitter.isVisible = false;

  let particleSystem;
  
  if (GPUParticleSystem.IsSupported) {
    particleSystem = new GPUParticleSystem('pipeFlow', { capacity: 500 }, scene);
  } else {
    particleSystem = new ParticleSystem('pipeFlow', 500, scene);
  }

  particleSystem.emitter = emitter;

  particleSystem.minEmitBox = new Vector3(-0.1, -0.1, -0.1);
  particleSystem.maxEmitBox = new Vector3(0.1, 0.1, 0.1);

  particleSystem.color1 = color;
  particleSystem.color2 = new Color4(color.r * 0.8, color.g * 0.8, color.b * 0.8, 0.8);
  particleSystem.colorDead = new Color4(0, 0.2, 0.3, 0);

  particleSystem.minSize = 0.05;
  particleSystem.maxSize = 0.15;

  particleSystem.minLifeTime = length / 5;
  particleSystem.maxLifeTime = length / 3;

  particleSystem.emitRate = 50;

  particleSystem.direction1 = normalized.scale(3);
  particleSystem.direction2 = normalized.scale(5);

  particleSystem.minEmitPower = 2;
  particleSystem.maxEmitPower = 4;
  particleSystem.updateSpeed = 0.01;

  particleSystem.gravity = new Vector3(0, 0, 0);

  particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

  particleSystem.start();

  return {
    system: particleSystem,
    emitter,
    stop: () => particleSystem.stop(),
    start: () => particleSystem.start(),
    dispose: () => {
      particleSystem.dispose();
      emitter.dispose();
    }
  };
}

export function createSmokeEffect(scene, position, intensity = 1) {
  const smokeEmitter = MeshBuilder.CreateBox('smokeEmitter', { size: 0.5 }, scene);
  smokeEmitter.position = position.clone();
  smokeEmitter.isVisible = false;

  let smoke;
  if (GPUParticleSystem.IsSupported) {
    smoke = new GPUParticleSystem('smoke', { capacity: 200 * intensity }, scene);
  } else {
    smoke = new ParticleSystem('smoke', 200 * intensity, scene);
  }

  smoke.emitter = smokeEmitter;

  smoke.minEmitBox = new Vector3(-0.5, 0, -0.5);
  smoke.maxEmitBox = new Vector3(0.5, 0, 0.5);

  smoke.color1 = new Color4(0.3, 0.3, 0.35, 0.3);
  smoke.color2 = new Color4(0.2, 0.2, 0.25, 0.2);
  smoke.colorDead = new Color4(0.1, 0.1, 0.15, 0);

  smoke.minSize = 0.5;
  smoke.maxSize = 2;

  smoke.minLifeTime = 2;
  smoke.maxLifeTime = 4;

  smoke.emitRate = 20 * intensity;

  smoke.direction1 = new Vector3(-0.5, 3, -0.5);
  smoke.direction2 = new Vector3(0.5, 5, 0.5);

  smoke.minEmitPower = 0.5;
  smoke.maxEmitPower = 1.5;
  smoke.updateSpeed = 0.005;

  smoke.gravity = new Vector3(0, 0.5, 0);

  smoke.blendMode = ParticleSystem.BLENDMODE_STANDARD;

  smoke.start();

  return {
    system: smoke,
    emitter: smokeEmitter,
    dispose: () => {
      smoke.dispose();
      smokeEmitter.dispose();
    }
  };
}

export function createFlameEffect(scene, position) {
  const flameEmitter = MeshBuilder.CreateCylinder('flameEmitter', {
    height: 0.1,
    diameter: 1
  }, scene);
  flameEmitter.position = position.clone();
  flameEmitter.isVisible = false;

  let flame;
  if (GPUParticleSystem.IsSupported) {
    flame = new GPUParticleSystem('flame', { capacity: 300 }, scene);
  } else {
    flame = new ParticleSystem('flame', 300, scene);
  }

  flame.emitter = flameEmitter;

  flame.minEmitBox = new Vector3(-0.3, 0, -0.3);
  flame.maxEmitBox = new Vector3(0.3, 0, 0.3);

  flame.color1 = new Color4(1, 0.5, 0, 1);
  flame.color2 = new Color4(1, 0.2, 0, 0.8);
  flame.colorDead = new Color4(0.5, 0.1, 0, 0);

  flame.minSize = 0.3;
  flame.maxSize = 1.5;

  flame.minLifeTime = 0.3;
  flame.maxLifeTime = 0.8;

  flame.emitRate = 100;

  flame.direction1 = new Vector3(-0.2, 2, -0.2);
  flame.direction2 = new Vector3(0.2, 4, 0.2);

  flame.minEmitPower = 1;
  flame.maxEmitPower = 3;
  flame.updateSpeed = 0.01;

  flame.gravity = new Vector3(0, 1, 0);

  flame.blendMode = ParticleSystem.BLENDMODE_ADD;

  flame.start();

  return {
    system: flame,
    emitter: flameEmitter,
    dispose: () => {
      flame.dispose();
      flameEmitter.dispose();
    }
  };
}

export function createCoolingTowerSteam(scene, position, radius = 3) {
  const steamEmitter = MeshBuilder.CreateDisc('steamEmitter', { radius }, scene);
  steamEmitter.position = position.clone();
  steamEmitter.rotation.x = Math.PI / 2;
  steamEmitter.isVisible = false;

  let steam;
  if (GPUParticleSystem.IsSupported) {
    steam = new GPUParticleSystem('steam', { capacity: 400 }, scene);
  } else {
    steam = new ParticleSystem('steam', 400, scene);
  }

  steam.emitter = steamEmitter;
  steam.particleEmitterType = steamEmitter;

  steam.color1 = new Color4(0.9, 0.95, 1, 0.4);
  steam.color2 = new Color4(0.8, 0.85, 0.9, 0.3);
  steam.colorDead = new Color4(0.7, 0.75, 0.8, 0);

  steam.minSize = 1;
  steam.maxSize = 4;

  steam.minLifeTime = 3;
  steam.maxLifeTime = 6;

  steam.emitRate = 30;

  steam.direction1 = new Vector3(-1, 5, -1);
  steam.direction2 = new Vector3(1, 8, 1);

  steam.minEmitPower = 0.5;
  steam.maxEmitPower = 2;
  steam.updateSpeed = 0.005;

  steam.gravity = new Vector3(0.2, 0.5, 0);

  steam.blendMode = ParticleSystem.BLENDMODE_STANDARD;

  steam.start();

  return {
    system: steam,
    emitter: steamEmitter,
    dispose: () => {
      steam.dispose();
      steamEmitter.dispose();
    }
  };
}

export default { 
  createPipelineFlowParticles, 
  createSmokeEffect, 
  createFlameEffect, 
  createCoolingTowerSteam 
};
