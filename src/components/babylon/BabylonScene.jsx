import { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';

function BabylonScene({ 
  onSceneReady, 
  onRender, 
  antialias = true, 
  engineOptions = {},
  sceneOptions = {},
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const engine = new Engine(canvas, antialias, {
      preserveDrawingBuffer: true,
      stencil: true,
      powerPreference: 'high-performance',
      ...engineOptions
    });
    engineRef.current = engine;

    const scene = new Scene(engine, sceneOptions);
    sceneRef.current = scene;

    if (onSceneReady) {
      onSceneReady(scene, engine, canvas);
    }

    engine.runRenderLoop(() => {
      if (onRender) {
        onRender(scene);
      }
      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [antialias, onSceneReady, onRender]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        outline: 'none',
        ...style
      }}
    />
  );
}

export default BabylonScene;
