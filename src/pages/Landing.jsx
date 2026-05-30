import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { signIn, signUp, skipGate } = useAuth()
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('All fields required.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') await signUp(email, password)
      else await signIn(email, password)
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--black)',
    }}>
      {/* Grain */}
      <div className="grain-overlay" />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 25% 50%, rgba(123,0,255,0.12) 0%, transparent 65%), radial-gradient(ellipse 60% 60% at 75% 20%, rgba(255,0,110,0.07) 0%, transparent 70%)',
        animation: 'drift 16s ease-in-out infinite',
      }} />

      {/* ── LEFT BRAND COLUMN ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 100px)',
        borderRight: '1px solid rgba(123,0,255,0.1)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: 'var(--purple-pale)',
            marginBottom: 24,
          }}>
            Dark streetwear — Est. 2025
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 12vw, 11rem)',
            lineHeight: 0.85, letterSpacing: '-0.01em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            marginBottom: 4,
          }}>
            ACTIN
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 12vw, 11rem)',
            lineHeight: 0.85, letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #7B00FF 0%, #FF006E 55%, #b877ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'shimmer 5s linear infinite',
            marginBottom: 32,
          }}>
            OUT
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            color: 'var(--muted)', lineHeight: 1.7,
            maxWidth: 380, marginBottom: 40,
          }}>
            Wear your emotions on your sleeve.
          </p>

          {/* Reward teaser badge */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '10px 18px',
                border: '1px solid rgba(255,0,110,0.35)',
                background: 'rgba(255,0,110,0.06)',
                borderRadius: 1,
              }}
            >
              <span style={{ fontSize: '1rem' }}>🎰</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--pink)',
              }}>
                Sign up & spin for up to 25% off
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── RIGHT AUTH COLUMN ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 'clamp(40px, 6vw, 80px)',
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          {/* Mode tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 36,
          }}>
            {[['signup', 'Create Account'], ['login', 'Log In']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1, padding: '12px 0',
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: mode === m ? 'var(--white)' : 'var(--muted)',
                  borderBottom: mode === m ? '2px solid var(--purple)' : '2px solid transparent',
                  transition: 'all 0.2s', marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <FormField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
              <FormField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    letterSpacing: '0.1em', color: 'var(--pink)',
                    textTransform: 'uppercase',
                  }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: 8, padding: '16px',
                  background: loading ? 'var(--purple-dim)' : 'var(--purple)',
                  border: 'none', color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 0 30px rgba(123,0,255,0.2)',
                }}
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>↻</motion.span>
                    {mode === 'signup' ? 'Creating...' : 'Signing in...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account & Spin 🎰' : 'Log In →'
                )}
              </motion.button>

              {mode === 'signup' && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)',
                  textAlign: 'center', lineHeight: 1.6, textTransform: 'uppercase',
                }}>
                  By creating an account you agree to our terms.
                  {/* TODO: Link to /terms when Terms page exists */}
                </p>
              )}
            </motion.form>
          </AnimatePresence>

          {/* Skip option */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={skipGate}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--muted)', transition: 'color 0.2s',
                textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.1)',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
            >
              Continue browsing without an account →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="border-right"] {
            border-right: none !important;
            border-bottom: 1px solid rgba(123,0,255,0.1) !important;
            padding-bottom: 48px !important;
            min-height: auto !important;
            justify-content: flex-end !important;
            padding-top: 100px !important;
          }
        }
      `}</style>
    </div>
  )
}

function FormField({ label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 8,
      }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{
          width: '100%', padding: '13px 16px',
          background: 'var(--gray-dark)',
          border: '1px solid var(--gray)',
          color: 'var(--off-white)',
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--purple)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--gray)'}
      />
    </div>
  )
}
