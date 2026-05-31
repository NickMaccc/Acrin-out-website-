import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'

// ── Placeholder sections — owner replaces the bracketed text ─────
const SECTIONS = [
  {
    title: 'Shipping Policy',
    body: '[ Add your shipping policy here — which carriers you use, countries you ship to, shipping rates, and any free-shipping thresholds. ]',
  },
  {
    title: 'Processing Times',
    body: '[ Add your order processing / fulfilment timeline here — e.g. "Orders are processed within 3–5 business days. You will receive a shipping confirmation email once your order has been dispatched." ]',
  },
  {
    title: 'Delivery Estimates',
    body: '[ Add estimated delivery windows for domestic and international orders. Include any caveats around peak periods, customs delays, etc. ]',
  },
  {
    title: 'Returns & Exchanges',
    body: '[ Add your returns policy here — the return window (e.g. 14 or 30 days), condition requirements (unworn, tags attached), how to initiate a return, and whether you offer exchanges or store credit. ]',
  },
  {
    title: 'Damaged or Incorrect Items',
    body: '[ Add your policy for orders that arrive damaged or contain the wrong item — what the customer should do (e.g. email with photos), and how you will resolve it. ]',
  },
  {
    title: 'Non-Returnable Items',
    body: '[ List any items excluded from returns — e.g. sale items, accessories, customised pieces. ]',
  },
]

export default function ShippingReturns() {
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
          <span style={{ color: 'var(--purple-pale)' }}>Shipping &amp; Returns</span>
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
            color: 'var(--white)', marginBottom: 40,
          }}>
            Shipping<br />&amp; Returns
          </h1>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />
        </motion.div>

        {/* Sections */}
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            style={{ marginBottom: 40 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--purple-pale)', marginBottom: 12,
            }}>
              {s.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.95rem',
              color: 'var(--muted)', lineHeight: 1.8,
              padding: '16px 20px',
              border: '1px dashed rgba(123,0,255,0.2)',
              background: 'rgba(123,0,255,0.03)',
            }}>
              {s.body}
            </p>
          </motion.div>
        ))}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', marginTop: 40 }}>
          Questions? <Link to="/contact" style={{ color: 'var(--purple-pale)', textDecoration: 'underline' }}>Contact us</Link> and we&apos;ll sort it out.
        </p>
      </div>
      <Footer />
    </PageTransition>
  )
}
