import { useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const SEGMENTS = [
  { label: '10%\nOFF',        reward: { type: 'percent', amount: 10,  code: 'SPIN10',    display: '10% Off Your Order' },    color: '#3d0099' },
  { label: 'MYSTERY\n✦',     reward: { type: 'mystery', amount: null, code: 'SPINMYSTERY', display: 'Mystery Reward' },       color: '#cc0057' },
  { label: '15%\nOFF',        reward: { type: 'percent', amount: 15,  code: 'SPIN15',    display: '15% Off Your Order' },    color: '#5500bb' },
  { label: 'FREE\nSHIPPING', reward: { type: 'shipping', amount: null, code: 'SPINSHIP', display: 'Free Shipping' },          color: '#7B00FF' },
  { label: '20%\nOFF',        reward: { type: 'percent', amount: 20,  code: 'SPIN20',    display: '20% Off Your Order' },    color: '#9B00FF' },
  { label: '10%\nOFF',        reward: { type: 'percent', amount: 10,  code: 'SPIN10',    display: '10% Off Your Order' },    color: '#3d0099' },
  { label: '25%\nOFF',        reward: { type: 'percent', amount: 25,  code: 'SPIN25',    display: '25% Off Your Order' },    color: '#FF006E' },
  { label: '15%\nOFF',        reward: { type: 'percent', amount: 15,  code: 'SPIN15',    display: '15% Off Your Order' },    color: '#5500bb' },
]
const N = SEGMENTS.length
const SEG_DEG = 360 / N

// ── SVG Wheel helpers ─────────────────────────────────────────────
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx, cy, r, startDeg, endDeg) {
  const s = polar(cx, cy, r, startDeg)
  const e = polar(cx, cy, r, endDeg)
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`
}

// ── Mending Heart ─────────────────────────────────────────────────
function MendingHeart({ onDone }) {
  const [phase, setPhase] = useState('broken') // broken → mending → mended → done
  const controls = useAnimation()

  const runMend = async () => {
    // Wait a beat
    await new Promise((r) => setTimeout(r, 600))
    setPhase('mending')
    await controls.start('mending')
    setPhase('mended')
    await controls.start('mended')
    await new Promise((r) => setTimeout(r, 800))
    setPhase('done')
    await new Promise((r) => setTimeout(r, 400))
    onDone()
  }

  // Auto-trigger on mount
  useState(() => { runMend() })

  const leftVariants = {
    broken: { x: -26, rotate: -12, opacity: 1 },
    mending: { x: 0, rotate: 0, transition: { duration: 0.9, ease: [0.34, 1.1, 0.64, 1] } },
    mended: { x: 0, rotate: 0 },
  }
  const rightVariants = {
    broken: { x: 26, rotate: 12, opacity: 1 },
    mending: { x: 0, rotate: 0, transition: { duration: 0.9, ease: [0.34, 1.1, 0.64, 1] } },
    mended: { x: 0, rotate: 0 },
  }
  const crackVariants = {
    broken: { opacity: 1 },
    mending: { opacity: 0, transition: { duration: 0.5, delay: 0.5 } },
    mended: { opacity: 0 },
  }
  const glowVariants = {
    broken: { opacity: 0, scale: 0.9 },
    mending: { opacity: 0 },
    mended: {
      opacity: [0, 1, 0.7, 1],
      scale: [0.9, 1.08, 1.0, 1.04],
      transition: { duration: 0.9, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
    >
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'var(--purple-pale)', marginBottom: 28,
      }}>
        {phase === 'broken' || phase === 'mending' ? 'Something is happening...' : 'Something mended.'}
      </p>

      <div style={{ position: 'relative', width: 160, height: 140 }}>
        <svg
          width="160" height="140"
          viewBox="0 0 38 36"
          style={{ overflow: 'visible', filter: phase === 'mended' ? 'drop-shadow(0 0 16px #7B00FF) drop-shadow(0 0 32px #FF006E)' : 'drop-shadow(0 0 6px rgba(123,0,255,0.5))' }}
        >
          <defs>
            <filter id="mendGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Whole mended heart — shows when mended */}
          <AnimatePresence>
            {phase === 'mended' && (
              <motion.path
                d="M19 33 C19 33,1 21,1 12 C1 5,6 1,11 2 C14 3,17 6,19 10 C21 6,24 3,27 2 C32 1,37 5,37 12 C37 21,19 33,19 33 Z"
                fill="url(#heartGrad)"
                filter="url(#mendGlow)"
                variants={glowVariants}
                initial="broken"
                animate={controls}
              />
            )}
          </AnimatePresence>

          {/* Broken halves — hidden when mended */}
          {phase !== 'mended' && (
            <>
              <motion.path
                d="M19 33 C19 33,3 22,3 13 C3 6.5,7.5 2.5,12.5 3.5 C14.5 4,16.5 5.5,18 8 L14.5 15.5 L21 19 L19 33Z"
                fill="#7B00FF" filter="url(#mendGlow)"
                variants={leftVariants} animate={controls} initial="broken"
              />
              <motion.path
                d="M19 33 C19 33,35 22,35 13 C35 6.5,30.5 2.5,25.5 3.5 C23.5 4,21.5 5.5,20 8 L23.5 15.5 L17 19 L19 33Z"
                fill="#9B22FF" filter="url(#mendGlow)"
                variants={rightVariants} animate={controls} initial="broken"
              />
              <motion.path
                d="M18 8 L14.5 15.5 L21 19 L17 28"
                stroke="#000" strokeWidth="1.5" fill="none" strokeLinejoin="round"
                variants={crackVariants} animate={controls} initial="broken"
              />
            </>
          )}

          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B00FF" />
              <stop offset="100%" stopColor="#FF006E" />
            </linearGradient>
          </defs>
        </svg>

        {/* Sparkle particles — appear on mended */}
        {phase === 'mended' && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 360
              const dist = 55 + Math.random() * 20
              const x = 80 + dist * Math.cos((angle * Math.PI) / 180)
              const y = 70 + dist * Math.sin((angle * Math.PI) / 180)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 80, y: 70, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], x, y, scale: [0, 1, 0] }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.7 }}
                  style={{
                    position: 'absolute', width: 6, height: 6,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--purple)' : 'var(--pink)',
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main SpinWheel component ──────────────────────────────────────
export default function SpinWheel() {
  const { completeSpin, user } = useAuth()
  const [phase, setPhase] = useState('idle') // idle → spinning → mending → revealed
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState(null)
  const wheelRef = useRef(null)

  const spin = () => {
    if (phase !== 'idle') return
    const winIdx = Math.floor(Math.random() * N)
    // Rotate so the winner lands at the top pointer (see math in planning)
    const target = rotation + 1800 + 360 - (winIdx + 0.5) * SEG_DEG
    setRotation(target)
    setPhase('spinning')
    setWinner(SEGMENTS[winIdx])
    // After spin animation (5.5s), go to mending
    setTimeout(() => setPhase('mending'), 5500)
  }

  const cx = 150, cy = 150, r = 135, textR = 93

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="grain-overlay" />

      <AnimatePresence mode="wait">

        {/* ── WHEEL PHASE ── */}
        {(phase === 'idle' || phase === 'spinning') && (
          <motion.div
            key="wheel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', marginBottom: 8 }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--purple-pale)', textTransform: 'uppercase', marginBottom: 8 }}>
                Welcome, {user?.name || 'friend'}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                letterSpacing: '0.05em', color: 'var(--white)',
              }}>
                Spin Your Reward
              </h2>
            </motion.div>

            {/* Pointer */}
            <div style={{ position: 'relative', width: 300, height: 320 }}>
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '22px solid #FFD700',
                zIndex: 10,
                filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))',
              }} />

              {/* Wheel */}
              <motion.div
                ref={wheelRef}
                animate={{ rotate: rotation }}
                transition={{
                  duration: phase === 'spinning' ? 5.2 : 0,
                  ease: phase === 'spinning' ? [0.15, 0.05, 0.05, 1.0] : 'linear',
                }}
                style={{
                  width: 300, height: 300, marginTop: 18,
                  borderRadius: '50%',
                  boxShadow: '0 0 40px rgba(123,0,255,0.3), 0 0 80px rgba(123,0,255,0.1)',
                  border: '3px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <svg
                  width="300" height="300"
                  viewBox="0 0 300 300"
                  style={{ display: 'block' }}
                >
                  {SEGMENTS.map((seg, i) => {
                    const startDeg = i * SEG_DEG
                    const endDeg = (i + 1) * SEG_DEG
                    const midDeg = startDeg + SEG_DEG / 2
                    const tp = polar(cx, cy, textR, midDeg)
                    const lines = seg.label.split('\n')

                    return (
                      <g key={i}>
                        <path
                          d={slicePath(cx, cy, r, startDeg, endDeg)}
                          fill={seg.color}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="1.5"
                        />
                        <g transform={`translate(${tp.x}, ${tp.y}) rotate(${midDeg})`}>
                          {lines.map((line, li) => (
                            <text
                              key={li}
                              x="0"
                              y={li * 13 - (lines.length - 1) * 6}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="#fff"
                              fontSize="9.5"
                              fontFamily="'Space Mono', monospace"
                              fontWeight="700"
                              letterSpacing="0.5"
                            >
                              {line}
                            </text>
                          ))}
                        </g>
                      </g>
                    )
                  })}
                  {/* Center circle */}
                  <circle cx={cx} cy={cy} r="22" fill="#0a0a0a" stroke="rgba(123,0,255,0.4)" strokeWidth="2" />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="'Space Mono', monospace">SPIN</text>
                </svg>
              </motion.div>
            </div>

            {/* Spin button */}
            <motion.button
              onClick={spin}
              disabled={phase === 'spinning'}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '16px 56px',
                background: phase === 'spinning' ? 'var(--gray-mid)' : 'var(--purple)',
                border: 'none', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                transition: 'background 0.2s',
                boxShadow: phase !== 'spinning' ? '0 0 30px rgba(123,0,255,0.35)' : 'none',
              }}
            >
              {phase === 'spinning' ? '...' : '⟳  SPIN'}
            </motion.button>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
              One spin per account
            </p>
          </motion.div>
        )}

        {/* ── MENDING HEART PHASE ── */}
        {phase === 'mending' && (
          <motion.div
            key="mending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <MendingHeart onDone={() => setPhase('revealed')} />
          </motion.div>
        )}

        {/* ── PRIZE REVEAL PHASE ── */}
        {phase === 'revealed' && winner && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textAlign: 'center', maxWidth: 480, padding: '0 20px' }}
          >
            {/* Mended heart icon (static) */}
            <div style={{ marginBottom: 28 }}>
              <svg width="72" height="68" viewBox="0 0 38 36" style={{ filter: 'drop-shadow(0 0 14px #7B00FF) drop-shadow(0 0 28px #FF006E)' }}>
                <defs>
                  <linearGradient id="revGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7B00FF" />
                    <stop offset="100%" stopColor="#FF006E" />
                  </linearGradient>
                </defs>
                <path d="M19 33 C19 33,1 21,1 12 C1 5,6 1,11 2 C14 3,17 6,19 10 C21 6,24 3,27 2 C32 1,37 5,37 12 C37 21,19 33,19 33 Z" fill="url(#revGrad)" />
              </svg>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 12 }}
            >
              You won
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #7B00FF, #FF006E)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 0.9, marginBottom: 20,
              }}
            >
              {winner.reward.display}
            </motion.h2>

            {winner.reward.code && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '12px 24px', marginBottom: 32,
                  border: '1px solid rgba(123,0,255,0.4)',
                  background: 'rgba(123,0,255,0.07)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Code:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--white)', fontWeight: 700 }}>{winner.reward.code}</span>
                {/* TODO: Copy to clipboard functionality */}
              </motion.div>
            )}

            {winner.reward.type === 'mystery' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
                Your mystery reward will be revealed at checkout.
                {/* TODO: Apply mystery discount server-side at checkout */}
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={() => completeSpin(winner.reward)}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '16px 48px',
                background: 'var(--purple)', border: 'none', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                boxShadow: '0 0 30px rgba(123,0,255,0.3)',
              }}
            >
              Start Shopping →
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginTop: 20 }}
            >
              Reward saved to your account — applies at checkout
              {/* TODO: Discount application wired to real checkout/payment */}
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
