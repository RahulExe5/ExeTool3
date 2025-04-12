"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Particle component
const Particle = ({ delay = 0 }: { delay?: number }) => {
  const size = Math.random() * 3 + 1
  const duration = Math.random() * 10 + 10
  const initialX = Math.random() * 100
  const initialY = Math.random() * 100

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        opacity: Math.random() * 0.5 + 0.3,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: duration,
        repeat: Number.POSITIVE_INFINITY,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  )
}

// Shooting star component
const ShootingStar = () => {
  const [position, setPosition] = useState({
    startX: Math.random() * 100,
    startY: Math.random() * 50,
    endX: Math.random() * 100,
    endY: Math.random() * 100 + 50,
  })

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPosition({
          startX: Math.random() * 100,
          startY: Math.random() * 50,
          endX: Math.random() * 100,
          endY: Math.random() * 100 + 50,
        })
      },
      Math.random() * 5000 + 5000,
    ) // Random interval between 5-10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
      style={{
        width: Math.random() * 100 + 50,
        left: `${position.startX}%`,
        top: `${position.startY}%`,
        rotate: Math.random() * 60 - 30,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        x: position.endX - position.startX,
        y: position.endY - position.startY,
      }}
      transition={{
        duration: Math.random() * 1 + 0.5, // Duration between 0.5-1.5 seconds
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 5 + 5, // Delay between 5-10 seconds
        ease: "easeOut",
      }}
    />
  )
}

export function AnimatedBackground() {
  // Generate an array of particles
  const particles = Array.from({ length: 30 }, (_, i) => <Particle key={`particle-${i}`} delay={i * 0.2} />)

  // Generate shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => <ShootingStar key={`star-${i}`} />)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 15,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      {/* Sparkling particles */}
      {particles}

      {/* Shooting stars */}
      {shootingStars}
    </div>
  )
}
