import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Each drip cycles: form → fall → invisible → reset. Staggered by 1/3 of cycle.
const DRIP_DUR = 1.8
const DRIP_DELAYS = [0, DRIP_DUR / 3, (DRIP_DUR * 2) / 3]

// Keyframe shape for all drips: appear at top, fall 15px, snap back invisible
const DRIP_ANIM = {
  y:       [0,   0,   0,   15,  15,  0],
  opacity: [0,   0,   1,   0,   0,   0],
  scaleY:  [0.1, 0.1, 1.1, 0.7, 0.1, 0.1],
}
const DRIP_TIMES = [0, 0.04, 0.16, 0.54, 0.58, 1]

function dripTransition(delay) {
  return {
    duration: DRIP_DUR,
    repeat: Infinity,
    times: DRIP_TIMES,
    ease: ['linear', 'easeOut', 'easeIn', 'linear', 'linear'],
    delay,
  }
}

// transformBox + transformOrigin ensure scaleY grows DOWN from the tip (top of drop)
const DRIP_STYLE = { transformBox: 'fill-box', transformOrigin: '50% 0%' }

const BrokenHeart = () => (
  <svg
    width="38" height="55"
    viewBox="0 0 38 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
  >
    <defs>
      <filter id="heartGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Left lobe */}
    <path
      d="M19 33
         C19 33, 3 22, 3 13
         C3 6.5, 7.5 2.5, 12.5 3.5
         C14.5 4, 16.5 5.5, 18 8
         L14.5 15.5 L21 19 L19 33Z"
      fill="#7B00FF"
      filter="url(#heartGlow)"
    />

    {/* Right lobe */}
    <path
      d="M19 33
         C19 33, 35 22, 35 13
         C35 6.5, 30.5 2.5, 25.5 3.5
         C23.5 4, 21.5 5.5, 20 8
         L23.5 15.5 L17 19 L19 33Z"
      fill="#9B22FF"
      filter="url(#heartGlow)"
    />

    {/* Crack */}
    <path
      d="M18 8 L14.5 15.5 L21 19 L17 28"
      stroke="#000000"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />

    {/* Drip 1 — left, smallest */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(DRIP_DELAYS[0])}
    >
      <path
        d="M 12 33 C 14.5 36, 14.5 42, 12 44.5 C 9.5 42, 9.5 36, 12 33 Z"
        fill="#7B00FF"
        opacity="0.85"
      />
    </motion.g>

    {/* Drip 2 — center, largest */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(DRIP_DELAYS[1])}
    >
      <path
        d="M 19 33 C 22.5 37, 22.5 45.5, 19 49 C 15.5 45.5, 15.5 37, 19 33 Z"
        fill="#7B00FF"
      />
    </motion.g>

    {/* Drip 3 — right, medium */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(DRIP_DELAYS[2])}
    >
      <path
        d="M 26 33 C 28 36, 28 41, 26 43.5 C 24 41, 24 36, 26 33 Z"
        fill="#7B00FF"
        opacity="0.9"
      />
    </motion.g>
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
      if (e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label')) {
        setHovered(true)
      }
    }
    const onLeave = (e) => {
      if (e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label')) {
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
        filter: hovered
          ? 'drop-shadow(0 0 8px #7B00FF)'
          : 'drop-shadow(0 0 4px rgba(123,0,255,0.5))',
        overflow: 'visible',
      }}
    >
      <BrokenHeart />
    </div>
  )
}
