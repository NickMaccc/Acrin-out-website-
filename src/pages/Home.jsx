import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import PlaceholderImage from '../components/PlaceholderImage'
import { getFeaturedProducts, getProductsByCollection } from '../data/products'

const featured = getFeaturedProducts()
const heartbreakProducts = getProductsByCollection('heartbreak-series').slice(0, 3)
const loveNotesProducts = getProductsByCollection('love-notes-series').slice(0, 3)

function RevealBlock({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── HERO — content-first, not a gate ───────────────────────────
// Split layout: brand on left, featured editorial image on right.
// Not full-screen — collections are visible just below the fold.
function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section
      ref={containerRef}
      data-hero=""
      style={{
        minHeight: 'clamp(520px, 70vh, 800px)',
        paddingTop: 80,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient gradient */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'radial-gradient(ellipse 70% 80% at 25% 50%, rgba(123,0,255,0.09) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 80%, rgba(255,0,110,0.06) 0%, transparent 60%)',
        animation: 'drift 14s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Left — brand identity */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div style={{
          padding: 'clamp(40px, 5vw, 80px)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', height: '100%',
          position: 'relative', zIndex: 1,
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: 'var(--purple-pale)',
              marginBottom: 20,
            }}
          >
            Now Available — 2026 Drop
          </motion.p>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(5rem, 12vw, 11rem)',
                letterSpacing: '-0.02em', lineHeight: 0.85,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.18)',
              }}
            >
              ACTIN
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(5rem, 12vw, 11rem)',
                letterSpacing: '-0.02em', lineHeight: 0.85,
                background: 'linear-gradient(135deg, #7B00FF 0%, #FF006E 55%, #b877ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                animation: 'shimmer 5s linear infinite',
              }}
            >
              OUT
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
              color: 'var(--muted)', lineHeight: 1.6,
              marginTop: 24, marginBottom: 36,
              maxWidth: 340,
            }}
          >
            Dark streetwear for the emotionally unfiltered.
          </motion.p>

          {/* Collection links — not gated CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {[
              { label: 'Heartbreak Series', to: '/apparel?collection=heartbreak-series', accent: 'var(--purple-pale)' },
              { label: 'Love Notes Series', to: '/apparel?collection=love-notes-series', accent: 'var(--pink)' },
            ].map(({ label, to, accent }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--muted)', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = accent}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                <span style={{ width: 24, height: 1, background: 'currentColor', flexShrink: 0 }} />
                {label}
                <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>→</span>
              </Link>
            ))}
            <Link
              to="/apparel"
              className="btn btn-primary"
              style={{ marginTop: 8, alignSelf: 'flex-start', fontSize: '0.72rem', padding: '13px 28px' }}
            >
              Shop All
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Right — editorial image */}
      <motion.div
        data-hero-image=""
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <PlaceholderImage
          gradientStyle="linear-gradient(160deg, #0a0015 0%, #1a0040 30%, #300060 60%, #0f0020 100%)"
          label="[Editorial Hero Image]"
          aspect="auto"
          style={{ height: '100%', minHeight: 'clamp(400px, 65vh, 700px)' }}
        />
        {/* Collection badge */}
        <div style={{
          position: 'absolute', bottom: 32, left: 32,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(123,0,255,0.2)',
          padding: '12px 20px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 4 }}>
            Now Dropping
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--white)' }}>
            Heartbreak Series
          </p>
        </div>
      </motion.div>

    </section>
  )
}

function CollectionBlock({ title, subtitle, desc, to, products: prods, accent, side = 'left' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      data-collection=""
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      style={{
        gap: 0,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Text side */}
      <div style={{
        order: side === 'left' ? 1 : 2,
        padding: 'clamp(40px, 6vw, 100px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: side === 'right' ? 'rgba(123,0,255,0.02)' : 'transparent',
      }}>
        <motion.div
          initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, marginBottom: 16 }}>
            {subtitle}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: 24, color: 'var(--white)', whiteSpace: 'pre-line' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 380, marginBottom: 36 }}>
            {desc}
          </p>
          <Link to={to} className="btn" style={{ alignSelf: 'flex-start', borderColor: accent, color: accent, fontSize: '0.7rem' }}>
            Explore Collection
          </Link>
        </motion.div>
      </div>

      {/* Product grid side */}
      <div style={{
        order: side === 'left' ? 2 : 1,
        padding: 'clamp(24px, 4vw, 60px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12, alignContent: 'center',
      }}>
        {prods.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

    </motion.section>
  )
}

export default function Home() {
  return (
    <PageTransition>
      <div className="grain-overlay" />

      <HeroSection />

      {/* Marquee */}
      <div style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '14px 0',
        background: 'rgba(123,0,255,0.03)',
      }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
          style={{ display: 'flex', gap: 56, whiteSpace: 'nowrap', width: 'max-content' }}
        >
          {Array(8).fill(['WEAR YOUR EMOTIONS', '✦', 'HEARTBREAK SERIES', '✦', 'LOVE NOTES SERIES', '✦']).flat().map((t, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: t === '✦' ? 'var(--purple)' : 'var(--muted)',
            }}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* Collections */}
      <div className="cv-auto">
        <CollectionBlock
          title={'Heartbreak\nSeries'}
          subtitle="Collection 001"
          desc="Built for the ones who feel everything. Raw cuts, heavy fabric, and the weight of what's been left behind."
          to="/apparel?collection=heartbreak-series"
          products={heartbreakProducts}
          accent="var(--purple-pale)"
          side="left"
        />
        <CollectionBlock
          title={'Love Notes\nSeries'}
          subtitle="Collection 002"
          desc="Addressed to no one. Sent to everyone. Soft constructions carrying hard feelings."
          to="/apparel?collection=love-notes-series"
          products={loveNotesProducts}
          accent="var(--pink)"
          side="right"
        />
      </div>

      {/* Editorial */}
      <RevealBlock>
        <section data-editorial="" className="cv-auto" style={{
          margin: '100px auto',
          maxWidth: 1440, padding: '0 40px',
          gap: 60, alignItems: 'center',
        }}>
          <div>
            <p className="section-eyebrow">The Philosophy</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 5rem)', lineHeight: 0.9, marginBottom: 24, color: 'var(--white)' }}>
              NOTHING<br />STAYS<br />BURIED
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 440, marginBottom: 32 }}>
              Every piece is a conversation you were too afraid to start. We make clothes for the version of yourself that stopped pretending.
            </p>
            <Link to="/about" className="btn" style={{ fontSize: '0.72rem' }}>
              Our Story
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <PlaceholderImage
              gradientStyle="linear-gradient(135deg, #0a0015 0%, #1a0040 40%, #0f0020 100%)"
              label="[Editorial Image]"
              aspect="3/4"
            />
            <div style={{
              position: 'absolute', bottom: -16, right: -16,
              background: 'var(--pink)', padding: '14px 22px',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.1em', color: '#fff' }}>
                NEW DROP
              </span>
            </div>
          </div>
        </section>
      </RevealBlock>

      {/* Featured products */}
      <section className="cv-auto" style={{ padding: '80px 40px', maxWidth: 1440, margin: '0 auto' }}>
        <RevealBlock>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <p className="section-eyebrow">Hand-picked</p>
              <h2 className="section-title">Featured</h2>
            </div>
            <Link to="/apparel" className="btn btn-ghost" style={{ fontSize: '0.68rem' }}>
              View All →
            </Link>
          </div>
        </RevealBlock>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
          {featured.map((p, i) => (
            <RevealBlock key={p.id} delay={i * 0.07}>
              <ProductCard product={p} />
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <RevealBlock>
        <section className="cv-auto" style={{
          padding: '100px 40px', textAlign: 'center',
          background: 'linear-gradient(180deg, transparent 0%, rgba(123,0,255,0.05) 50%, transparent 100%)',
          borderTop: '1px solid rgba(123,0,255,0.07)',
          borderBottom: '1px solid rgba(123,0,255,0.07)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,0,255,0.05), transparent)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 20, position: 'relative' }}>
            Limited drops. No restocks.
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '0.02em', lineHeight: 0.9, color: 'var(--white)', marginBottom: 40, position: 'relative' }}>
            ACT NOW
          </h2>
          <Link to="/apparel" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '16px 48px', position: 'relative' }}>
            Shop the Drop
          </Link>
        </section>
      </RevealBlock>

      <Footer />
    </PageTransition>
  )
}
