import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'

const STANZAS = [
  {
    type: 'eyebrow',
    lines: ['about me.'],
  },
  {
    type: 'h1',
    lines: ['About... Us.'],
    size: 'clamp(4.5rem, 10vw, 9rem)',
    gap: 10,
  },
  {
    type: 'body',
    lines: [
      'Actin Out is for the people who became someone they never planned to be.',
      'Not because they were bad.',
      'Not because they were broken.',
      'Because they were hurting.',
    ],
    gap: 80,
  },
  {
    type: 'body',
    lines: [
      'Sometimes acting out looked like anger.',
      'Sometimes it looked like addiction.',
      'Sometimes it looked like toxic relationships.',
      'Sometimes it looked like running away.',
      'Sometimes it looked like pretending everything was fine.',
    ],
    gap: 60,
  },
  {
    type: 'body',
    lines: [
      'The world judged the behavior.',
      'We understand the pain behind it.',
    ],
    gap: 60,
    emphasis: true,
  },
  {
    type: 'body',
    lines: [
      'Actin Out exists for the people still finding their way back to themselves.',
      'For the people learning that survival and healing are not the same thing.',
      'For the people who spent years carrying things they were never taught how to put down.',
    ],
    gap: 60,
  },
  {
    type: 'body',
    lines: [
      'Most of all, it\'s for the people who thought they were alone.',
      'Because the truth is, there are more of us than you think.',
    ],
    gap: 60,
    emphasis: true,
  },
]

function Stanza({ stanza, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index === 0 ? 0.1 : 0, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ marginTop: stanza.gap || 48 }}
    >
      {stanza.type === 'eyebrow' && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.65rem, 1.4vw, 0.82rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {stanza.lines[0]}
        </p>
      )}

      {stanza.type === 'h1' && (
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: stanza.size,
          lineHeight: 0.88,
          letterSpacing: '0.01em',
          background: 'linear-gradient(120deg, #fff 0%, #fff 45%, #b877ff 75%, #FF006E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 100%',
        }}>
          {stanza.lines[0]}
        </h1>
      )}

      {stanza.type === 'h2' && (
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: stanza.size,
          lineHeight: 0.9,
          letterSpacing: '0.02em',
          color: stanza.color || 'var(--white)',
        }}>
          {stanza.lines[0]}
        </h2>
      )}

      {stanza.type === 'body' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: stanza.emphasis ? 18 : 10 }}>
          {stanza.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.08 + 0.1, duration: 0.5 }}
              style={{
                fontFamily: stanza.emphasis ? 'var(--font-display)' : 'var(--font-body)',
                fontSize: stanza.emphasis
                  ? 'clamp(1.2rem, 3vw, 1.8rem)'
                  : 'clamp(1rem, 2.5vw, 1.25rem)',
                color: stanza.emphasis ? 'var(--white)' : 'var(--muted)',
                lineHeight: stanza.emphasis ? 1.1 : 1.7,
                letterSpacing: stanza.emphasis ? '0.02em' : '0',
                fontWeight: stanza.emphasis ? 400 : 400,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function About() {
  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        {/* Ambient purple gradient */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 10% 20%, rgba(123,0,255,0.06) 0%, transparent 70%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 680, margin: '0 auto',
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 60px) 120px',
        }}>
          {STANZAS.map((stanza, i) => (
            <Stanza key={i} stanza={stanza} index={i} />
          ))}

          {/* Closing mark */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              marginTop: 100,
              height: 1,
              background: 'linear-gradient(90deg, var(--purple), var(--pink), transparent)',
              transformOrigin: 'left',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: 20,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--purple-pale)',
            }}
          >
            — Actin Out, est. 2026
          </motion.p>
        </div>
      </div>
      <Footer />
    </PageTransition>
  )
}
