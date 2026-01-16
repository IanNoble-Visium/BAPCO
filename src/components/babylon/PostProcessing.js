import {
  DefaultRenderingPipeline,
  SSAORenderingPipeline,
  Color3,
  Color4,
  Vector2
} from '@babylonjs/core';

export function setupPostProcessing(scene, camera) {
  const pipeline = new DefaultRenderingPipeline(
    'defaultPipeline',
    true,
    scene,
    [camera]
  );

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.3;
  pipeline.bloomWeight = 0.5;
  pipeline.bloomKernel = 64;
  pipeline.bloomScale = 0.5;

  pipeline.chromaticAberrationEnabled = true;
  pipeline.chromaticAberration.aberrationAmount = 15;
  pipeline.chromaticAberration.radialIntensity = 0.5;

  pipeline.grainEnabled = true;
  pipeline.grain.intensity = 5;
  pipeline.grain.animated = true;

  pipeline.sharpenEnabled = true;
  pipeline.sharpen.edgeAmount = 0.2;

  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.contrast = 1.1;
  pipeline.imageProcessing.exposure = 1.0;
  pipeline.imageProcessing.toneMappingEnabled = true;
  pipeline.imageProcessing.vignetteEnabled = true;
  pipeline.imageProcessing.vignetteWeight = 1.5;
  pipeline.imageProcessing.vignetteColor = new Color4(0, 0.1, 0.2, 0);
  pipeline.imageProcessing.vignetteStretch = 0.5;

  return pipeline;
}

export function setupSSAO(scene, camera) {
  const ssaoRatio = {
    ssaoRatio: 0.5,
    blurRatio: 0.5
  };

  const ssao = new SSAORenderingPipeline('ssao', scene, ssaoRatio);
  ssao.fallOff = 0.000001;
  ssao.area = 1;
  ssao.radius = 0.0001;
  ssao.totalStrength = 1.0;
  ssao.base = 0.5;

  scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('ssao', camera);

  return ssao;
}

export function createIndustrialColorGrading(pipeline) {
  if (pipeline.imageProcessing) {
    pipeline.imageProcessing.colorCurvesEnabled = true;
    const curves = pipeline.imageProcessing.colorCurves;
    
    curves.globalHue = 200;
    curves.globalSaturation = 20;
    curves.globalExposure = 0;
    
    curves.highlightsHue = 180;
    curves.highlightsSaturation = 30;
    curves.highlightsExposure = 10;
    
    curves.shadowsHue = 220;
    curves.shadowsSaturation = 40;
    curves.shadowsExposure = -10;
  }
}

export default { setupPostProcessing, setupSSAO, createIndustrialColorGrading };
