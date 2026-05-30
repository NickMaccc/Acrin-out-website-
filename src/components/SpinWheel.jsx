import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const SEGMENTS = [
  { label: '10%\nOFF',        reward: { type: 'percent',  amount: 10,  code: 'SPIN10',   display: '10% Off Your Order' },  color: '#3d0099' },
  { label: 'MYSTERY\n✦',     reward: { type: 'mystery',  amount: null, code: null,       display: 'Mystery Reward' },       color: '#cc0057' },
  { label: '15%\nOFF',        reward: { type: 'percent',  amount: 15,  code: 'SPIN15',   display: '15% Off Your Order' },  color: '#5500bb' },
  { label: 'FREE\nSHIPPING', reward: { type: 'shipping', amount: null, code: 'SPINSHIP', display: 'Free Shipping' },        color: '#7B00FF' },
  { label: '20%\nOFF',        reward: { type: 'percent',  amount: 20,  code: 'SPIN20',   display: '20% Off Your Order' },  color: '#9B00FF' },
  { label: '10%\nOFF',        reward: { type: 'percent',  amount: 10,  code: 'SPIN10',   display: '10% Off Your Order' },  color: '#3d0099' },
  { label: '25%\nOFF',        reward: { type: 'percent',  amount: 25,  code: 'SPIN25',   display: '25% Off Your Order' },  color: '#FF006E' },
  { label: '15%\nOFF',        reward: { type: 'percent',  amount: 15,  code: 'SPIN15',   display: '15% Off Your Order' },  color: '#5500bb' },
]
const N = SEGMENTS.length
const SEG_DEG = 360 / N

const MYSTERY_OPTIONS = [
  { type: 'percent',  amount: 25,  code: 'MYSTERY25',   display: '25% Off Your Order' },
  { type: 'shipping', amount: null, code: 'MYSTERYSHIP', display: 'Free Shipping' },
  { type: 'percent',  amount: 20,  code: 'MYSTERY20',   display: '20% Off Your Order' },
]

function resolveMystery(seg) {
  const pick = MYSTERY_OPTIONS[Math.floor(Math.random() * MYSTERY_OPTIONS.length)]
  return { ...seg, reward: { ...pick, isMystery: true } }
}

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
// Uses pure setTimeout sequencing — no useAnimation / async-await to
// avoid timing races between React state updates and animation controls.
function MendingHeart({ onDone }) {
  const [step, setStep] = useState(0) // 0=broken, 1=mending, 2=mended

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600)   // start mending
    const t2 = setTimeout(() => setStep(2), 1700)  // fully mended
    const t3 = setTimeout(onDone, 3300)             // hand off to reveal
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        userSelect: 'none',
      }}>
        {step < 2 ? 'Something is happening...' : 'Something mended.'}
      </p>

      <div style={{ position: 'relative', width: 160, height: 140 }}>
        <svg
          width="160" height="140"
          viewBox="0 0 38 36"
          style={{
            overflow: 'visible',
            filter: step === 2
              ? 'drop-shadow(0 0 16px #7B00FF) drop-shadow(0 0 32px #FF006E)'
              : 'drop-shadow(0 0 6px rgba(123,0,255,0.5))',
            transition: 'filter 0.6s ease',
          }}
        >
          <defs>
            <filter id="mendGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B00FF" />
              <stop offset="100%" stopColor="#FF006E" />
            </linearGradient>
          </defs>

          {/* Whole mended heart — fades in at step 2 */}
          <AnimatePresence>
            {step === 2 && (
              <motion.path
                d="M19 33 C19 33,1 21,1 12 C1 5,6 1,11 2 C14 3,17 6,19 10 C21 6,24 3,27 2 C32 1,37 5,37 12 C37 21,19 33,19 33 Z"
                fill="url(#heartGrad)"
                filter="url(#mendGlow)"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1.04 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Broken halves — visible until step 2 */}
          {step < 2 && (
            <>
              <motion.path
                d="M19 33 C19 33,3 22,3 13 C3 6.5,7.5 2.5,12.5 3.5 C14.5 4,16.5 5.5,18 8 L14.5 15.5 L21 19 L19 33Z"
                fill="#7B00FF" filter="url(#mendGlow)"
                initial={{ x: -26, rotate: -12 }}
                animate={step === 0 ? { x: -26, rotate: -12 } : { x: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.34, 1.1, 0.64, 1] }}
              />
              <motion.path
                d="M19 33 C19 33,35 22,35 13 C35 6.5,30.5 2.5,25.5 3.5 C23.5 4,21.5 5.5,20 8 L23.5 15.5 L17 19 L19 33Z"
                fill="#9B22FF" filter="url(#mendGlow)"
                initial={{ x: 26, rotate: 12 }}
                animate={step === 0 ? { x: 26, rotate: 12 } : { x: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.34, 1.1, 0.64, 1] }}
              />
              <motion.path
                d="M18 8 L14.5 15.5 L21 19 L17 28"
                stroke="#000" strokeWidth="1.5" fill="none" strokeLinejoin="round"
                initial={{ opacity: 1 }}
                animate={step === 0 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </>
          )}
        </svg>

        {/* Sparkle particles on mended */}
        {step === 2 && (
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

  // Keep stable refs so the auto-advance timer always sees current values
  // even if the component re-renders between scheduling and firing.
  const completeSpiRef = useRef(completeSpin)
  completeSpiRef.current = completeSpin
  const winnerRef = useRef(winner)
  winnerRef.current = winner

  // Auto-advance: once the prize is revealed, navigate into the app after 2.5s.
  // Depends only on `phase` so the timer fires exactly once and isn't
  // restarted by completeSpin reference changes.
  useEffect(() => {
    if (phase !== 'revealed') return
    const t = setTimeout(() => {
      completeSpiRef.current(winnerRef.current?.reward ?? null)
    }, 2500)
    return () => clearTimeout(t)
  }, [phase])

  const spin = () => {
    if (phase !== 'idle') return
    const winIdx = Math.floor(Math.random() * N)
    const target = rotation + 1800 + 360 - (winIdx + 0.5) * SEG_DEG
    setRotation(target)

    let seg = SEGMENTS[winIdx]
    if (seg.reward.type === 'mystery') seg = resolveMystery(seg)

    setWinner(seg)
    setPhase('spinning')
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
                <svg width="300" height="300" viewBox="0 0 300 300" style={{ display: 'block' }}>
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
                  <circle cx={cx} cy={cy} r="22" fill="#0a0a0a" stroke="rgba(123,0,255,0.4)" strokeWidth="2" />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="'Space Mono', monospace">SPIN</text>
                </svg>
              </motion.div>
            </div>

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
            {/* Mended heart icon */}
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

            {winner.reward.isMystery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--pink)', marginBottom: 6 }}
              >
                ✦ Mystery unlocked
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 12 }}
            >
              {winner.reward.isMystery ? 'Your mystery reward:' : 'You won'}
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

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 4 }}
            >
              Reward saved — applies at checkout
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase' }}
            >
              Taking you to the store…
              {/* TODO: Discount application wired to real checkout/payment */}
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
