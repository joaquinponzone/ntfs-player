"use client"

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Song {
  title: string
  url: string
}

const songs: Song[] = [
  { title: "Fire 1", url: process.env.NEXT_PUBLIC_FIRE_1_URL! },
  { title: "Fire 2", url: process.env.NEXT_PUBLIC_FIRE_2_URL! },
]

export default function FireMultipleAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

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

    const handleEnded = () => {
      nextSong()
    }

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e)
      setError('Failed to load audio. Please try another song.')
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', setInitialTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', setInitialTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => {
          console.error('Playback failed:', e)
          setError('Playback failed. Please try again.')
          setIsAudioPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isAudioPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      setError(null)
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => {
          console.error('Playback failed:', e)
          setError('Playback failed. Please try again.')
          setIsAudioPlaying(false)
        })
      }
    }
  }, [currentSongIndex, isAudioPlaying])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => {
          console.error('Playback failed:', e)
          setError('Playback failed. Please try again.')
        })
      }
      setIsAudioPlaying(!isAudioPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length)
    setIsAudioPlaying(true)
  }

  const previousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length)
    setIsAudioPlaying(true)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fire_1-OaZwtQCIKUcw4Iyd3dwUEvHZ7GwL79.jpeg')",
          filter: "brightness(0.7)"
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <audio ref={audioRef}>
          <source src={songs[currentSongIndex].url} type="audio/mpeg" />
          <source src={songs[currentSongIndex].url} type="audio/aac" />
          <source src={songs[currentSongIndex].url} type="audio/ogg" />
          <source src={songs[currentSongIndex].url} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
        <div className="fixed bottom-20 left-0 right-0 flex flex-col items-center justify-center space-y-4 px-1">
          <div className="flex items-center justify-center space-x-4 w-full max-w-sm">
            <Button
              onClick={previousSong}
              variant="outline"
              size="lg"
              className="bg-orange-700/50 text-orange-100 border-orange-500 hover:bg-orange-600/50 transition-colors duration-200"
              aria-label="Previous song"
            >
              <SkipBack className="size-10" />
            </Button>
            <Button
              onClick={toggleAudio}
              variant="outline"
              size="lg"
              className="bg-orange-700/50 text-orange-100 border-orange-500 hover:bg-orange-600/50 transition-colors duration-200"
              aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
            >
              {isAudioPlaying ? <Pause className="size-10" /> : <Play className="size-10" />}
            </Button>
            <Button
              onClick={nextSong}
              variant="outline"
              size="lg"
              className="bg-orange-700/50 text-orange-100 border-orange-500 hover:bg-orange-600/50 transition-colors duration-200"
              aria-label="Next song"
            >
              <SkipForward className="size-10" />
            </Button>
          </div>
          <div className="text-orange-100 text-xs text-center w-full flex justify-between max-w-xs py-2" style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 0 5px rgba(249, 115, 22, 0.5)' }}>
            <p className="mb-1">{songs[currentSongIndex].title}</p>
            <p>{formatTime(remainingTime)}</p>
          </div>
        </div>
      </div>
      <div 
        className="fixed bottom-0 left-0 w-full h-20 bg-orange-800 border-t-2 border-orange-500 z-10 cursor-pointer"
        onClick={(e) => {
          if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickedPosition = (x / rect.width) * audioRef.current.duration;
            audioRef.current.currentTime = clickedPosition;
          }
        }}
      >
        <div
          className="h-full bg-orange-400"
          style={{ 
            width: `${audioProgress}%`,
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.5), 0 0 5px rgba(249, 115, 22, 0.5) inset',
          }}
          role="progressbar"
          aria-valuenow={audioProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 fixed bottom-8 left-0 right-0 text-center">{error}</p>
      )}
    </div>
  )
}