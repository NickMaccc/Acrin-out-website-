import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Drip config ───────────────────────────────────────────────────
// Three raindrops in descending diagonal: LEFT highest, MIDDLE lower, RIGHT lowest.
// Each drop is a true teardrop: round circle at the bottom, pointed tip at the top
// (like a falling water drop or the 💧 emoji). They drip left→middle→right, looped.

const DRIP_DUR = 1.8            // seconds per drip cycle
const STAGGER  = DRIP_DUR / 3  // 0.6 s between each drop
const Y_FALL   = 18             // px the drop falls before fading
const TIMES    = [0, 0.05, 0.16, 0.55, 0.58, 1]

// scaleY from 50% 0% (top of bounding box = the pointed tip):
// drop forms at the tip and grows downward, then falls, then resets invisibly
const DRIP_ANIM = {
  y:       [0,    0,    0,    Y_FALL, Y_FALL, 0],
  scaleY:  [0.06, 0.06, 1.1, 0.5,    0.06,   0.06],
  opacity: [0,    0,    1,   0,       0,      0],
}

// transformBox='fill-box' + transformOrigin='50% 0%' anchors scaleY at the tip
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

// ── True teardrop path ────────────────────────────────────────────
// Produces a drop with a pointed tip at the TOP and a round circle at the BOTTOM —
// exactly the shape of a falling raindrop / 💧 emoji / blood drop.
// cx, tipY: center x and y of the pointed top
// r: radius of the round bottom (drop is 2r wide at its widest)
// height: total tip-to-bottom distance
function tearPath(cx, tipY, r = 4, height = 13) {
  const cy  = tipY + height - r  // center of bottom circle
  const rx  = cx + r             // right tangent x (horizontal tangent = widest point)
  const lx  = cx - r             // left tangent x

  // Bezier control points taper from the tip outward to the circle's tangent.
  // The right arc sweeps clockwise (sweep-flag=1) through the round bottom.
  return (
    `M ${cx} ${tipY} ` +
    `C ${cx + r * 0.45} ${tipY + height * 0.32}, ${rx} ${tipY + height * 0.52}, ${rx} ${cy} ` +
    `A ${r} ${r} 0 0 1 ${lx} ${cy} ` +
    `C ${lx} ${tipY + height * 0.52}, ${cx - r * 0.45} ${tipY + height * 0.32}, ${cx} ${tipY} Z`
  )
}

// ── Cursor SVG ────────────────────────────────────────────────────
// Drop tip y positions: left=33, middle=36, right=39 → descending diagonal
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

    {/* ── Drop 1 — LEFT, highest (tip at y=33, cx=12) ── */}
    <motion.g style={DRIP_STYLE} animate={DRIP_ANIM} transition={dripTransition(0)}>
      <path d={tearPath(12, 33)} fill="#7B00FF" />
    </motion.g>

    {/* ── Drop 2 — MIDDLE, lower (tip at y=36, cx=19) ── */}
    <motion.g style={DRIP_STYLE} animate={DRIP_ANIM} transition={dripTransition(STAGGER)}>
      <path d={tearPath(19, 36)} fill="#8B11FF" />
    </motion.g>

    {/* ── Drop 3 — RIGHT, lowest (tip at y=39, cx=26) ── */}
    <motion.g style={DRIP_STYLE} animate={DRIP_ANIM} transition={dripTransition(STAGGER * 2)}>
      <path d={tearPath(26, 39)} fill="#7B00FF" />
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
