'use client'

import { useRef, useState, useEffect } from 'react'

export function HeroBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  // Create a grid of dots
  const rows = 12
  const cols = 24
  const dots = []

  // Ensure grid spreads across typical hero sizes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({ id: `${i}-${j}`, x: j * 60 + 30, y: i * 60 + 30 })
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto z-0" aria-hidden="true">
      <div className="absolute inset-0 w-full h-full">
        {dots.map((dot) => {
          const dx = mousePos.x - dot.x
          const dy = mousePos.y - dot.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          // Calculate interaction effect (repel or attract)
          let offsetX = 0
          let offsetY = 0
          let scale = 1
          let opacity = 0.3

          if (distance < maxDistance) {
            const factor = (maxDistance - distance) / maxDistance
            // Repulse effect: move away from cursor
            offsetX = -(dx / distance) * factor * 25
            offsetY = -(dy / distance) * factor * 25
            scale = 1 + factor * 1.5
            opacity = 0.3 + factor * 0.7
          }

          return (
            <div
              key={dot.id}
              className="absolute rounded-full bg-primary transition-all duration-300 ease-out"
              style={{
                width: 4,
                height: 4,
                left: dot.x - 2,
                top: dot.y - 2,
                opacity,
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
