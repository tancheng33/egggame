"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  animationDelay: number
  color: string
  size: number
  shape: "circle" | "square" | "triangle"
}

export function Confetti() {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      "oklch(0.45 0.15 264)", // Primary purple
      "oklch(0.55 0.2 320)", // Secondary magenta
      "oklch(0.65 0.25 45)", // Accent gold
      "oklch(0.6 0.2 160)", // Emerald
      "oklch(0.7 0.15 200)", // Sky blue
      "oklch(0.8 0.2 30)", // Orange
    ]

    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"]
    const pieces: ConfettiPiece[] = []

    for (let i = 0; i < 80; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      })
    }

    setConfettiPieces(pieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute confetti-animation ${
            piece.shape === "circle" ? "rounded-full" : piece.shape === "triangle" ? "triangle" : ""
          }`}
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.animationDelay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transform: piece.shape === "triangle" ? "rotate(45deg)" : undefined,
          }}
        />
      ))}
    </div>
  )
}
