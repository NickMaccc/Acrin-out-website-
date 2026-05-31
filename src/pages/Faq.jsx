import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'

// ── Placeholder Q&As — owner replaces bracketed text ─────────────
const FAQS = [
  {
    q: '[ Question: e.g. "What sizes do you carry?" ]',
    a: '[ Answer: e.g. "We carry XS through XXL in all styles. See our Size Guide for detailed measurements." ]',
  },
  {
    q: '[ Question: e.g. "How long does shipping take?" ]',
    a: '[ Answer: refer to your Shipping & Returns page for processing and delivery timelines. ]',
  },
  {
    q: '[ Question: e.g. "Can I return or exchange an item?" ]',
    a: '[ Answer: refer to your Shipping & Returns page for your returns policy. ]',
  },
  {
    q: '[ Question: e.g. "How do I care for my garment?" ]',
    a: '[ Answer: e.g. "Machine wash cold, inside out, on a gentle cycle. Tumble dry low or hang to dry. Do not bleach." ]',
  },
  {
    q: '[ Question: e.g. "Do you ship internationally?" ]',
    a: '[ Answer: add your international shipping policy here. ]',
  },
  {
    q: '[ Question: e.g. "How do I track my order?" ]',
    a: '[ Answer: e.g. "A tracking link will be sent to your email once your order has shipped." ]',
  },
]

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.06 * index }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'none', border: 'none',
          padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16, cursor: 'pointer',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          color: open ? 'var(--white)' : 'var(--muted)',
          lineHeight: 1.5, transition: 'color 0.2s',
        }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '1.1rem',
            color: 'var(--purple)', flexShrink: 0, lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', lineHeight: 1.8,
              paddingBottom: 20,
              paddingLeft: 16,
              borderLeft: '2px solid rgba(123,0,255,0.3)',
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Faq() {
  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Breadcrumb */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 40 }}>
          <Link to="/" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >Home</Link>
          {' / '}
          <span style={{ color: 'var(--purple-pale)' }}>FAQ</span>
        </p>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 12 }}>
            Actin Out
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            lineHeight: 0.9, letterSpacing: '0.02em',
            color: 'var(--white)', marginBottom: 16,
          }}>
            FAQ
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 40 }}>
            Frequently asked questions
          </p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
        </motion.div>

        {/* Accordion */}
        {FAQS.map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a} index={i} />
        ))}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', marginTop: 48 }}>
          Still have questions? <Link to="/contact" style={{ color: 'var(--purple-pale)', textDecoration: 'underline' }}>Get in touch</Link>.
        </p>
      </div>
      <Footer />
    </PageTransition>
  )
}
