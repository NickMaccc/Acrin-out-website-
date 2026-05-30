import { useEffect, useRef, useState } from 'react'

const BrokenHeart = () => (
  <svg width="38" height="55" viewBox="0 0 38 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="heartGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Left lobe of broken heart */}
    <path
      d="M19 33
         C19 33, 3 22, 3 13
         C3 6.5, 7.5 2.5, 12.5 3.5
         C14.5 4, 16.5 5.5, 18 8
         L14.5 15.5 L21 19 L19 33Z"
      fill="#7B00FF"
      filter="url(#heartGlow)"
    />

    {/* Right lobe of broken heart */}
    <path
      d="M19 33
         C19 33, 35 22, 35 13
         C35 6.5, 30.5 2.5, 25.5 3.5
         C23.5 4, 21.5 5.5, 20 8
         L23.5 15.5 L17 19 L19 33Z"
      fill="#9B22FF"
      filter="url(#heartGlow)"
    />

    {/* Crack outline (dark line through break) */}
    <path
      d="M18 8 L14.5 15.5 L21 19 L17 28"
      stroke="#000000"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />

    {/* Teardrop drip 1 — left, small. Pointed top meets heart, rounded liquid bottom. */}
    <path d="M 12 33 C 15 36.5, 15 41.5, 12 44.5 C 9 41.5, 9 36.5, 12 33 Z"
      fill="#7B00FF" opacity="0.9" />

    {/* Teardrop drip 2 — center, largest */}
    <path d="M 19 33 C 23 37.5, 23 46, 19 50 C 15 46, 15 37.5, 19 33 Z"
      fill="#7B00FF" />

    {/* Teardrop drip 3 — right, medium */}
    <path d="M 26 33 C 28.5 36, 28.5 41, 26 43.5 C 23.5 41, 23.5 36, 26 33 Z"
      fill="#7B00FF" opacity="0.8" />
  </svg>
)

export default function Cursor() {
  const cursorRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const loop = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.14)
      current.current.y = lerp(current.current.y, pos.current.y, 0.14)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${current.current.x - 12}px, ${current.current.y - 8}px) scale(${hovered ? 1.6 : 1})`
      }
      raf.current = requestAnimationFrame(loop)
    }

    const onEnter = (e) => {
      if (
        e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label')
      ) {
        setHovered(true)
      }
    }
    const onLeave = (e) => {
      if (
        e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label')
      ) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [hovered])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        transition: 'transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)',
        filter: hovered ? 'drop-shadow(0 0 8px #7B00FF)' : 'drop-shadow(0 0 4px rgba(123,0,255,0.5))',
      }}
    >
      <BrokenHeart />
    </div>
  )
}
