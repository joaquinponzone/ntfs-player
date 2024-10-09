"use client"

import { useEffect, useRef, useState } from 'react'

export function CannabisSymbolAudioPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number>()
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateCanvasSize();

    // const plantSymbols = '☘️🌿🍃✳️❇️';
    const plantSymbols = 'FASITO';
    const fontSize = window.innerWidth < 768 ? 14 : 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    function draw() {
      if (!ctx) return;
      if (!canvas) return;

      ctx.fillStyle = 'rgba(0, 40, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22C55E';
      ctx.font = `${fontSize}px Arial`;

      for (let i = 0; i < drops.length; i++) {
        const text = plantSymbols[Math.floor(Math.random() * plantSymbols.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    function animate() {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      updateCanvasSize();
      drops.fill(1);
    };

    window.addEventListener('resize', handleResize);

    if (isAudioPlaying) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAudioPlaying]);

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100)
      setRemainingTime(audio.duration - audio.currentTime)
    }

    const setInitialTime = () => {
      setRemainingTime(audio.duration)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', setInitialTime)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', setInitialTime)
    }
  }, [])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsAudioPlaying(!isAudioPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-green-900 min-h-screen">
      <style jsx global>{`
        ::selection {
          background-color: #22C55E;
          color: white;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        aria-label="Plant symbol rain animation"
      />
      <audio
        ref={audioRef}
        src={process.env.NEXT_PUBLIC_AUDIO_URL}
        loop
      />
      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center justify-center space-y-2 z-10 px-4">
        <button
          onClick={toggleAudio}
          className="bg-green-700 text-green-100 px-6 py-2 text-sm uppercase tracking-wider border-2 border-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 w-full max-w-xs"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            textShadow: '0 0 5px rgba(34, 197, 94, 0.5)',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
          }}
          aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
        >
          {isAudioPlaying ? "PAUSE" : "PLAY"}
        </button>
        <div className="text-green-100 text-xs text-center w-full flex justify-between max-w-xs py-2 " style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' }}>
          <p className="mb-1">{process.env.NEXT_PUBLIC_TRACK_TITLE}</p>
          <p>{formatTime(remainingTime)}</p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-2 bg-green-800 border-t-2 border-green-500 z-10">
        <div
          className="h-full bg-green-400"
          style={{ 
            width: `${audioProgress}%`,
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5), 0 0 5px rgba(34, 197, 94, 0.5) inset',
          }}
          role="progressbar"
          aria-valuenow={audioProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  )
}