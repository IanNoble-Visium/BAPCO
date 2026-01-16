import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { getRandomizedPlaylist, getVideoPath } from '../../data/videoManifest';

/**
 * Transition Types for variety
 */
const TRANSITIONS = {
  CROSSFADE: 'crossfade',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  SLIDE_LEFT: 'slideLeft',
  SLIDE_RIGHT: 'slideRight',
  SLIDE_UP: 'slideUp',
  SLIDE_DOWN: 'slideDown',
  ROTATE_FADE: 'rotateFade',
  BLUR_FADE: 'blurFade',
  SCALE_CORNER: 'scaleCorner'
};

/**
 * Random utility functions
 */
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));

/**
 * VideoBackground Component
 * 
 * A cinematic video background with GSAP-powered transitions,
 * random positioning, sizes, and Ken Burns effects for maximum variety.
 */
function VideoBackground({
  category = 'all',
  transitionDuration = 1.5,
  playbackRate = 0.8
}) {
  const containerRef = useRef(null);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const playlistRef = useRef([]);
  const currentIndexRef = useRef(0);
  const activeVideoRef = useRef('A');
  const isTransitioningRef = useRef(false);
  const animationTweenRef = useRef(null);
  const currentStyleRef = useRef(null);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate random video style (position, size, animation)
  const generateRandomStyle = useCallback(() => {
    // Random scale (70% to 130% of container)
    const scale = randomBetween(1.0, 1.5);
    
    // Random starting position based on scale
    const maxOffset = (scale - 1) * 50;
    const xOffset = randomBetween(-maxOffset, maxOffset);
    const yOffset = randomBetween(-maxOffset, maxOffset);
    
    // Random Ken Burns movement direction and intensity
    const kenBurnsIntensity = randomBetween(0.03, 0.12);
    const kenBurnsDirections = [
      { x: -1, y: -1 }, // top-left
      { x: 1, y: -1 },  // top-right
      { x: -1, y: 1 },  // bottom-left
      { x: 1, y: 1 },   // bottom-right
      { x: 0, y: -1 },  // up
      { x: 0, y: 1 },   // down
      { x: -1, y: 0 },  // left
      { x: 1, y: 0 }    // right
    ];
    const kenBurnsDir = randomChoice(kenBurnsDirections);
    
    // Random zoom direction (in or out)
    const zoomIn = Math.random() > 0.5;
    const startScale = zoomIn ? scale : scale * (1 + kenBurnsIntensity);
    const endScale = zoomIn ? scale * (1 + kenBurnsIntensity) : scale;
    
    return {
      startX: xOffset,
      startY: yOffset,
      endX: xOffset + (kenBurnsDir.x * kenBurnsIntensity * 100),
      endY: yOffset + (kenBurnsDir.y * kenBurnsIntensity * 100),
      startScale,
      endScale,
      rotation: randomBetween(-2, 2) // Subtle rotation
    };
  }, []);

  // Get random transition type
  const getRandomTransition = useCallback(() => {
    const transitions = Object.values(TRANSITIONS);
    return randomChoice(transitions);
  }, []);

  // Initialize playlist on mount
  useEffect(() => {
    playlistRef.current = getRandomizedPlaylist(category);
    currentIndexRef.current = 0;
    setIsInitialized(true);
  }, [category]);

  // Get next video index
  const getNextIndex = useCallback(() => {
    return (currentIndexRef.current + 1) % playlistRef.current.length;
  }, []);

  // Preload next video
  const preloadNextVideo = useCallback(() => {
    const nextIndex = getNextIndex();
    const nextVideo = playlistRef.current[nextIndex];
    if (!nextVideo) return;

    const inactiveVideo = activeVideoRef.current === 'A' ? videoBRef.current : videoARef.current;
    if (inactiveVideo) {
      inactiveVideo.src = getVideoPath(nextVideo.file);
      inactiveVideo.load();
    }
  }, [getNextIndex]);

  // Apply Ken Burns animation during playback
  const applyKenBurns = useCallback((videoElement, duration, style) => {
    if (!videoElement || !style) return;

    if (animationTweenRef.current) {
      animationTweenRef.current.kill();
    }

    // Set initial state
    gsap.set(videoElement, {
      scale: style.startScale,
      xPercent: style.startX,
      yPercent: style.startY,
      rotation: 0
    });

    // Animate to end state over the video duration
    animationTweenRef.current = gsap.to(videoElement, {
      scale: style.endScale,
      xPercent: style.endX,
      yPercent: style.endY,
      rotation: style.rotation,
      duration: duration * 0.9, // Leave room for transition
      ease: 'none'
    });
  }, []);

  // Execute transition to next video
  const transitionToNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const currentVideo = activeVideoRef.current === 'A' ? videoARef.current : videoBRef.current;
    const nextVideo = activeVideoRef.current === 'A' ? videoBRef.current : videoARef.current;

    if (!currentVideo || !nextVideo) {
      isTransitioningRef.current = false;
      return;
    }

    // Update index and get new style
    currentIndexRef.current = getNextIndex();
    const nextStyle = generateRandomStyle();
    const transitionType = getRandomTransition();

    // Prepare next video with new random style
    gsap.set(nextVideo, {
      scale: nextStyle.startScale,
      xPercent: nextStyle.startX,
      yPercent: nextStyle.startY,
      rotation: 0,
      opacity: 0,
      filter: 'blur(0px)'
    });

    // Start playing next video
    nextVideo.currentTime = 0;
    nextVideo.play().catch(() => {});

    // Build transition timeline
    const tl = gsap.timeline({
      onComplete: () => {
        currentVideo.pause();
        gsap.set(currentVideo, { 
          opacity: 0, 
          scale: 1, 
          xPercent: 0, 
          yPercent: 0,
          rotation: 0,
          filter: 'blur(0px)'
        });
        
        activeVideoRef.current = activeVideoRef.current === 'A' ? 'B' : 'A';
        currentStyleRef.current = nextStyle;
        isTransitioningRef.current = false;

        preloadNextVideo();

        if (nextVideo.duration) {
          applyKenBurns(nextVideo, nextVideo.duration, nextStyle);
        }
      }
    });

    // Apply different transition effects
    switch (transitionType) {
      case TRANSITIONS.ZOOM_IN:
        tl.to(currentVideo, {
          opacity: 0,
          scale: '+=0.3',
          duration: transitionDuration,
          ease: 'power2.in'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, scale: nextStyle.startScale * 0.8 },
          { opacity: 1, scale: nextStyle.startScale, duration: transitionDuration, ease: 'power2.out' },
          '<0.2'
        );
        break;

      case TRANSITIONS.ZOOM_OUT:
        tl.to(currentVideo, {
          opacity: 0,
          scale: '-=0.2',
          duration: transitionDuration,
          ease: 'power2.in'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, scale: nextStyle.startScale * 1.3 },
          { opacity: 1, scale: nextStyle.startScale, duration: transitionDuration, ease: 'power2.out' },
          '<0.2'
        );
        break;

      case TRANSITIONS.SLIDE_LEFT:
        tl.to(currentVideo, {
          opacity: 0,
          xPercent: '-=30',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, xPercent: nextStyle.startX + 30 },
          { opacity: 1, xPercent: nextStyle.startX, duration: transitionDuration, ease: 'power2.inOut' },
          '<'
        );
        break;

      case TRANSITIONS.SLIDE_RIGHT:
        tl.to(currentVideo, {
          opacity: 0,
          xPercent: '+=30',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, xPercent: nextStyle.startX - 30 },
          { opacity: 1, xPercent: nextStyle.startX, duration: transitionDuration, ease: 'power2.inOut' },
          '<'
        );
        break;

      case TRANSITIONS.SLIDE_UP:
        tl.to(currentVideo, {
          opacity: 0,
          yPercent: '-=20',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, yPercent: nextStyle.startY + 20 },
          { opacity: 1, yPercent: nextStyle.startY, duration: transitionDuration, ease: 'power2.inOut' },
          '<'
        );
        break;

      case TRANSITIONS.SLIDE_DOWN:
        tl.to(currentVideo, {
          opacity: 0,
          yPercent: '+=20',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, yPercent: nextStyle.startY - 20 },
          { opacity: 1, yPercent: nextStyle.startY, duration: transitionDuration, ease: 'power2.inOut' },
          '<'
        );
        break;

      case TRANSITIONS.ROTATE_FADE:
        tl.to(currentVideo, {
          opacity: 0,
          rotation: randomChoice([-5, 5]),
          scale: '+=0.1',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, rotation: randomChoice([-3, 3]) },
          { opacity: 1, rotation: 0, duration: transitionDuration, ease: 'power2.out' },
          '<0.3'
        );
        break;

      case TRANSITIONS.BLUR_FADE:
        tl.to(currentVideo, {
          opacity: 0,
          filter: 'blur(20px)',
          scale: '+=0.05',
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, filter: 'blur(20px)' },
          { opacity: 1, filter: 'blur(0px)', duration: transitionDuration, ease: 'power2.out' },
          '<0.2'
        );
        break;

      case TRANSITIONS.SCALE_CORNER:
        const corners = [
          { transformOrigin: 'top left' },
          { transformOrigin: 'top right' },
          { transformOrigin: 'bottom left' },
          { transformOrigin: 'bottom right' }
        ];
        const corner = randomChoice(corners);
        gsap.set(nextVideo, corner);
        tl.to(currentVideo, {
          opacity: 0,
          scale: 0.8,
          duration: transitionDuration,
          ease: 'power2.in'
        });
        tl.fromTo(nextVideo,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: nextStyle.startScale, duration: transitionDuration * 1.2, ease: 'power3.out' },
          '<0.1'
        );
        break;

      case TRANSITIONS.CROSSFADE:
      default:
        tl.to(currentVideo, {
          opacity: 0,
          duration: transitionDuration,
          ease: 'power2.inOut'
        });
        tl.to(nextVideo, {
          opacity: 1,
          duration: transitionDuration,
          ease: 'power2.inOut'
        }, '<');
        break;
    }
  }, [transitionDuration, getNextIndex, generateRandomStyle, getRandomTransition, preloadNextVideo, applyKenBurns]);

  // Handle video time update for early transition
  const handleTimeUpdate = useCallback((e) => {
    const video = e.target;
    if (!video.duration) return;

    const timeRemaining = video.duration - video.currentTime;
    if (timeRemaining <= transitionDuration + 0.5 && !isTransitioningRef.current) {
      transitionToNext();
    }
  }, [transitionDuration, transitionToNext]);

  // Handle video ended event
  const handleVideoEnded = useCallback(() => {
    transitionToNext();
  }, [transitionToNext]);

  // Initialize first video
  useEffect(() => {
    if (!isInitialized || playlistRef.current.length === 0) return;

    const firstVideo = playlistRef.current[0];
    const videoA = videoARef.current;

    if (videoA && firstVideo) {
      const initialStyle = generateRandomStyle();
      currentStyleRef.current = initialStyle;
      
      videoA.src = getVideoPath(firstVideo.file);
      videoA.load();
      
      const handleCanPlay = () => {
        gsap.set(videoA, {
          scale: initialStyle.startScale,
          xPercent: initialStyle.startX,
          yPercent: initialStyle.startY
        });
        
        videoA.play().catch(() => {});
        gsap.to(videoA, { opacity: 1, duration: 1.5, ease: 'power2.out' });
        
        if (videoA.duration) {
          applyKenBurns(videoA, videoA.duration, initialStyle);
        }
        
        preloadNextVideo();
        videoA.removeEventListener('canplay', handleCanPlay);
      };

      videoA.addEventListener('canplay', handleCanPlay);
      return () => videoA.removeEventListener('canplay', handleCanPlay);
    }
  }, [isInitialized, generateRandomStyle, applyKenBurns, preloadNextVideo]);

  // Set playback rate
  useEffect(() => {
    if (videoARef.current) videoARef.current.playbackRate = playbackRate;
    if (videoBRef.current) videoBRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationTweenRef.current) animationTweenRef.current.kill();
    };
  }, []);

  return (
    <div className="video-bg-container" ref={containerRef}>
      <video
        ref={videoARef}
        className="video-bg-player"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimeUpdate}
        style={{ opacity: 0 }}
      />
      <video
        ref={videoBRef}
        className="video-bg-player video-bg-inactive"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimeUpdate}
        style={{ opacity: 0 }}
      />
    </div>
  );
}

export default VideoBackground;
