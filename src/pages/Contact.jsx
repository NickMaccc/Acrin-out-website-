import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'

// TODO: replace all placeholder values below with real contact details
const EMAIL = 'hello@actinout.com'          // replace with your actual email
const SOCIALS = [
  { label: 'Instagram', handle: '@actinout',       href: '#' },  // replace href with real IG URL
  { label: 'TikTok',   handle: '@actinout',        href: '#' },  // replace href with real TT URL
  { label: 'X',        handle: '@actinout',        href: '#' },  // replace href with real X/Twitter URL
]

export default function Contact() {
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
          <span style={{ color: 'var(--purple-pale)' }}>Contact</span>
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
            Contact
          </h1>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 56 }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 12 }}>
            Email
          </p>
          <a
            href={`mailto:${EMAIL}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
              letterSpacing: '0.02em', lineHeight: 1.1,
              color: 'var(--white)',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--purple-pale)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--white)'}
          >
            {EMAIL}
          </a>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
            {/* TODO: replace email address above with your real contact email */}
            [ Replace with your actual email address ]
          </p>
        </motion.div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 28 }}>
            Follow
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SOCIALS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
              >
                <a
                  href={s.href}
                  style={{
                    display: 'flex', alignItems: 'baseline', gap: 16,
                    textDecoration: 'none',
                    color: 'var(--muted)', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--purple-pale)', minWidth: 72 }}>
                    {s.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', letterSpacing: '0.02em' }}>
                    {s.handle}
                  </span>
                </a>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', marginTop: 4, marginLeft: 88 }}>
                  {/* TODO: replace href="#" above with the real {s.label} URL */}
                  [ Replace with real {s.label} link ]
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      <Footer />
    </PageTransition>
  )
}
