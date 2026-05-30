import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Drip config ───────────────────────────────────────────────────
// Three classic teardrops (rounded bulb bottom, tapered tip top) arranged
// in a descending diagonal: LEFT is highest, MIDDLE is lower, RIGHT is lowest.
// All three are similar in size. They drip left→middle→right in a staggered loop.

const DRIP_DUR = 1.8            // seconds per full drip cycle
const STAGGER = DRIP_DUR / 3   // 0.6 s between each drop

// Keyframe shape — drip forms at tip, falls, fades, resets invisibly
const Y_FALL = 16   // px the drop falls before fading out
const TIMES  = [0, 0.05, 0.16, 0.55, 0.58, 1]
const DRIP_ANIM = {
  y:       [0,  0,  0,        Y_FALL, Y_FALL, 0],
  scaleY:  [0.08, 0.08, 1.12, 0.65,  0.08,   0.08],
  opacity: [0,  0,  1,        0,      0,      0],
}

// Each drop's transformBox/Origin so scaleY grows downward from its tip
const DRIP_STYLE = { transformBox: 'fill-box', transformOrigin: '50% 0%' }

function dripTransition(delay) {
  return {
    duration: DRIP_DUR,
    repeat: Infinity,
    times: TIMES,
    ease: ['linear', 'easeOut', 'easeIn', 'linear', 'linear'],
    delay,
  }
}

// ── Cursor SVG ────────────────────────────────────────────────────
// Drop positions (tip y):  left=33, middle=36, right=39  → stair-step diagonal
// Drop height: all ~12px tall  → similar size across all three
const BrokenHeart = () => (
  <svg
    width="38" height="55"
    viewBox="0 0 38 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
  >
    <defs>
      <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
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
      stroke="#000"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />

    {/* ── Drip 1 — LEFT, highest (tip at y=33) ── */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(0)}
    >
      {/* Teardrop: tip at (12,33), bulb bottom at (12,45) */}
      <path
        d="M 12 33
           C 14.5 36.5, 14.5 43, 12 45
           C 9.5 43, 9.5 36.5, 12 33 Z"
        fill="#7B00FF"
      />
    </motion.g>

    {/* ── Drip 2 — MIDDLE, lower (tip at y=36) ── */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(STAGGER)}
    >
      {/* Teardrop: tip at (19,36), bulb bottom at (19,48) */}
      <path
        d="M 19 36
           C 21.5 39.5, 21.5 46, 19 48
           C 16.5 46, 16.5 39.5, 19 36 Z"
        fill="#8811FF"
      />
    </motion.g>

    {/* ── Drip 3 — RIGHT, lowest (tip at y=39) ── */}
    <motion.g
      style={DRIP_STYLE}
      animate={DRIP_ANIM}
      transition={dripTransition(STAGGER * 2)}
    >
      {/* Teardrop: tip at (26,39), bulb bottom at (26,51) */}
      <path
        d="M 26 39
           C 28.5 42.5, 28.5 49, 26 51
           C 23.5 49, 23.5 42.5, 26 39 Z"
        fill="#7B00FF"
      />
    </motion.g>
  </svg>
)

// ── Cursor component ──────────────────────────────────────────────
export default function Cursor() {
  const cursorRef   = useRef(null)
  const pos         = useRef({ x: -100, y: -100 })
  const current     = useRef({ x: -100, y: -100 })
  const raf         = useRef(null)
  const movingTimer = useRef(null)
  const isMovingRef = useRef(false)

  const [hovered,  setHovered]  = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      // Brighten on movement; debounce the "stopped" transition
      if (!isMovingRef.current) {
        isMovingRef.current = true
        setIsMoving(true)
      }
      clearTimeout(movingTimer.current)
      movingTimer.current = setTimeout(() => {
        isMovingRef.current = false
        setIsMoving(false)
      }, 280)
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const loop = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.14)
      current.current.y = lerp(current.current.y, pos.current.y, 0.14)
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${current.current.x - 12}px, ${current.current.y - 8}px) scale(${hovered ? 1.6 : 1})`
      }
      raf.current = requestAnimationFrame(loop)
    }

    const onEnter = (e) => {
      if (e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label'))
        setHovered(true)
    }
    const onLeave = (e) => {
      if (e.target.closest('a, button, [data-cursor-scale], input, select, textarea, label'))
        setHovered(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover',  onEnter)
    document.addEventListener('mouseout',   onLeave)
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onEnter)
      document.removeEventListener('mouseout',   onLeave)
      cancelAnimationFrame(raf.current)
      clearTimeout(movingTimer.current)
    }
  }, [hovered])

  // Glow: moving = max intensity neon, hover = medium, rest = standard glow
  const filter = isMoving
    ? 'drop-shadow(0 0 10px #9B22FF) drop-shadow(0 0 22px rgba(155,34,255,0.9)) drop-shadow(0 0 40px rgba(123,0,255,0.6))'
    : hovered
      ? 'drop-shadow(0 0 8px #7B00FF) drop-shadow(0 0 18px rgba(123,0,255,0.7))'
      : 'drop-shadow(0 0 6px #7B00FF) drop-shadow(0 0 14px rgba(123,0,255,0.45))'

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        overflow: 'visible',
        filter,
        transition: 'filter 0.35s ease',
      }}
    >
      <BrokenHeart />
    </div>
  )
}
