import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUPPORT_EMAIL = 'support@actinout.com' // TODO: Replace with real support email

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "hey. i'm here. ask me anything about the brand, sizing, shipping — whatever's on your mind. 💜",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      // TODO: Replace /api/chat with your actual deployed Vercel function URL if needed
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      })
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.content }])
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: `something went sideways on my end — sorry. for direct help, reach us at ${SUPPORT_EMAIL} 💌`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating heart button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 900,
          width: 58, height: 58,
          background: 'none', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'drop-shadow(0 0 14px rgba(255,0,110,0.55)) drop-shadow(0 0 28px rgba(123,0,255,0.35))',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: '1.5rem', color: 'var(--white)', lineHeight: 1 }}
            >
              ✕
            </motion.span>
          ) : (
            <motion.svg
              key="heart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              width="52" height="52" viewBox="0 0 52 52"
            >
              <defs>
                <radialGradient id="hg" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#ff62c0" />
                  <stop offset="60%" stopColor="#FF006E" />
                  <stop offset="100%" stopColor="#7B00FF" />
                </radialGradient>
                <radialGradient id="hglow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(255,0,110,0.18)" />
                  <stop offset="100%" stopColor="rgba(123,0,255,0)" />
                </radialGradient>
              </defs>
              {/* Glow */}
              <ellipse cx="26" cy="28" rx="22" ry="20" fill="url(#hglow)" />
              {/* Heart */}
              <path
                d="M26 42 C26 42,6 28,6 17 C6 10,11 6,16 7 C19.5 7.8,22.5 10,26 15 C29.5 10,32.5 7.8,36 7 C41 6,46 10,46 17 C46 28,26 42,26 42 Z"
                fill="url(#hg)"
              />
              {/* Shine */}
              <ellipse cx="19" cy="15" rx="4" ry="2.5" fill="rgba(255,255,255,0.25)" transform="rotate(-30 19 15)" />
              {/* Pulse ring */}
              <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,0,110,0.2)" strokeWidth="1.5">
                <animate attributeName="r" values="24;28;24" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'fixed', bottom: 96, right: 28, zIndex: 900,
              width: 'min(380px, calc(100vw - 56px)',
              height: 'min(520px, calc(100vh - 140px))',
              background: 'rgba(10,10,10,0.97)',
              border: '1px solid rgba(123,0,255,0.22)',
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(123,0,255,0.15), 0 24px 48px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(123,0,255,0.12)',
              background: 'rgba(123,0,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 10,
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 52 52">
                <defs>
                  <radialGradient id="hh" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#ff62c0" />
                    <stop offset="100%" stopColor="#7B00FF" />
                  </radialGradient>
                </defs>
                <path d="M26 42 C26 42,6 28,6 17 C6 10,11 6,16 7 C19.5 7.8,22.5 10,26 15 C29.5 10,32.5 7.8,36 7 C41 6,46 10,46 17 C46 28,26 42,26 42 Z" fill="url(#hh)" />
              </svg>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
                  ACTIN OUT
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'var(--purple-pale)', marginTop: 2 }}>
                  brand support
                </p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '16px 16px 8px',
              display: 'flex', flexDirection: 'column', gap: 12,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(123,0,255,0.3) transparent',
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #7B00FF, #FF006E)'
                      : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.87rem',
                    lineHeight: 1.55,
                    color: 'var(--off-white)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '4px 14px 14px 14px',
                    display: 'flex', gap: 5, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-pale)', display: 'block' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Contact support link */}
            <div style={{
              padding: '6px 16px',
              display: 'flex', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(184,119,255,0.5)', textDecoration: 'underline',
                  textDecorationColor: 'rgba(184,119,255,0.2)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--purple-pale)'}
                onMouseLeave={e => e.target.style.color = 'rgba(184,119,255,0.5)'}
              >
                Contact human support →
              </a>
            </div>

            {/* Input */}
            <div style={{
              borderTop: '1px solid rgba(123,0,255,0.12)',
              padding: '12px 14px',
              display: 'flex', gap: 10, alignItems: 'flex-end',
              flexShrink: 0,
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="ask anything..."
                rows={1}
                style={{
                  flex: 1, resize: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                  color: 'var(--off-white)',
                  outline: 'none',
                  lineHeight: 1.4,
                  maxHeight: 100, overflowY: 'auto',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(123,0,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <motion.button
                onClick={send}
                disabled={!input.trim() || loading}
                whileTap={{ scale: 0.93 }}
                style={{
                  width: 38, height: 38, flexShrink: 0,
                  background: input.trim() && !loading ? 'var(--purple)' : 'rgba(123,0,255,0.2)',
                  border: 'none', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', transition: 'background 0.2s',
                  boxShadow: input.trim() && !loading ? '0 0 16px rgba(123,0,255,0.35)' : 'none',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
