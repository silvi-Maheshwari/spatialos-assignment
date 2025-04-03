"use client"

import { useEffect, useRef, useState } from "react"

export default function SpatialGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [settings, setSettings] = useState({
    curve: 14,
    distance: 8,
    yHeight: 0,
    grid: true,
    ambientLight: "#FFFFFF",
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
    }

    window.addEventListener("resize", resize)
    resize()

    // Draw the grid
    function drawGrid() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw dots pattern
      drawDotPattern(ctx, canvas.width, canvas.height)

      // Draw the curved grid
      if (settings.grid) {
        drawCurvedGrid(ctx, canvas.width, canvas.height, settings.curve, settings.distance)
      }
    }

    drawGrid()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [settings])

  // Handle settings changes
  const handleSettingChange = (setting: string, value: number | boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  return (
    <div className="spatial-container">
      <canvas ref={canvasRef} className="grid-canvas"></canvas>

      <div className="controls-panel">
        <div className="control-item">
          <span>Curve</span>
          <input
            type="range"
            min="0"
            max="30"
            value={settings.curve}
            onChange={(e) => handleSettingChange("curve", Number.parseInt(e.target.value))}
          />
          <span className="value">{settings.curve}</span>
        </div>

        <div className="control-item">
          <span>Distance</span>
          <input
            type="range"
            min="1"
            max="20"
            value={settings.distance}
            onChange={(e) => handleSettingChange("distance", Number.parseInt(e.target.value))}
          />
          <span className="value">{settings.distance}</span>
        </div>

        <div className="control-item">
          <span>Y-Height</span>
          <input
            type="range"
            min="-10"
            max="10"
            value={settings.yHeight}
            onChange={(e) => handleSettingChange("yHeight", Number.parseInt(e.target.value))}
          />
          <span className="value">{settings.yHeight}</span>
        </div>

        <div className="control-item">
          <span>Grid</span>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.grid}
              onChange={(e) => handleSettingChange("grid", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="control-item">
          <span>Ambient Light</span>
          <input
            type="color"
            value={settings.ambientLight}
            onChange={(e) => handleSettingChange("ambientLight", e.target.value)}
          />
          <span className="value">{settings.ambientLight.toUpperCase()}</span>
        </div>
      </div>

      <div className="cursor"></div>
    </div>
  )
}

// Function to draw the dot pattern background
function drawDotPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)"

  // Create a gradient for the dots to fade out toward the top
  const spacing = 15
  const dotSize = 0.5

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      // Make dots fade out toward the top
      const opacity = Math.min(1, y / (height * 0.8))
      ctx.globalAlpha = opacity * 0.15

      // Draw dot
      ctx.beginPath()
      ctx.arc(x, y, dotSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.globalAlpha = 1
}

// Function to draw the curved grid
function drawCurvedGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  curveFactor: number,
  distance: number,
) {
  const centerX = width / 2
  const centerY = height / 2

  // Set grid style
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 0.5

  // Draw horizontal lines
  const horizontalLines = 9
  const verticalLines = 9
  const gridWidth = width * 0.6
  const gridHeight = height * 0.4

  // Draw horizontal curved lines
  for (let i = 0; i <= horizontalLines; i++) {
    const y = (i / horizontalLines) * gridHeight

    ctx.beginPath()

    for (let x = 0; x <= gridWidth; x += 5) {
      const normalizedX = x / gridWidth - 0.5 // -0.5 to 0.5
      const normalizedY = y / gridHeight // 0 to 1

      // Apply curve effect
      const curveY = y + normalizedX * normalizedX * curveFactor * distance * 10

      if (x === 0) {
        ctx.moveTo(centerX - gridWidth / 2 + x, centerY - gridHeight / 2 + curveY)
      } else {
        ctx.lineTo(centerX - gridWidth / 2 + x, centerY - gridHeight / 2 + curveY)
      }
    }

    ctx.stroke()
  }

  // Draw vertical lines
  for (let i = 0; i <= verticalLines; i++) {
    const x = (i / verticalLines) * gridWidth

    ctx.beginPath()

    for (let y = 0; y <= gridHeight; y += 5) {
      const normalizedX = x / gridWidth - 0.5 // -0.5 to 0.5
      const normalizedY = y / gridHeight // 0 to 1

      // Apply curve effect
      const curveY = y + normalizedX * normalizedX * curveFactor * distance * 10

      if (y === 0) {
        ctx.moveTo(centerX - gridWidth / 2 + x, centerY - gridHeight / 2 + curveY)
      } else {
        ctx.lineTo(centerX - gridWidth / 2 + x, centerY - gridHeight / 2 + curveY)
      }
    }

    ctx.stroke()
  }
}

