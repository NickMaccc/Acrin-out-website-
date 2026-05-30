import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import PlaceholderImage from '../components/PlaceholderImage'
import { products, getProductsByCollection } from '../data/products'

const CATEGORIES = [
  {
    slug: 'tshirts',
    label: 'T-Shirts',
    desc: 'Cropped. Oversized. Emotion-forward.',
    count: products.filter((p) => p.category === 'tshirts').length,
    gradient: 'linear-gradient(135deg, #0d0020 0%, #1a0040 60%, #0a0010 100%)',
  },
  {
    slug: 'hoodies',
    label: 'Hoodies',
    desc: 'Heavy fabric for the heaviest feelings.',
    count: products.filter((p) => p.category === 'hoodies').length,
    gradient: 'linear-gradient(135deg, #060614 0%, #0d0028 60%, #060614 100%)',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    desc: 'The details that complete the damage.',
    count: products.filter((p) => p.category === 'accessories').length,
    gradient: 'linear-gradient(135deg, #0a0010 0%, #150020 60%, #080010 100%)',
  },
]

const COLLECTIONS = [
  {
    id: 'heartbreak-series',
    label: 'Heartbreak Series',
    subtitle: '— Collection 001',
    accent: '#7B00FF',
  },
  {
    id: 'love-notes-series',
    label: 'Love Notes Series',
    subtitle: '— Collection 002',
    accent: '#FF006E',
  },
]

function RevealBlock({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Apparel() {
  const [searchParams] = useSearchParams()
  const activeCollection = searchParams.get('collection')

  const filteredProducts = activeCollection
    ? getProductsByCollection(activeCollection)
    : products

  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        {/* Header */}
        <section style={{ padding: '60px 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <RevealBlock>
            <p className="section-eyebrow">Everything</p>
            <h1 className="section-title" style={{ marginBottom: 20 }}>
              {activeCollection
                ? COLLECTIONS.find((c) => c.id === activeCollection)?.label || 'Apparel'
                : 'All Apparel'}
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7,
            }}>
              {activeCollection
                ? 'Curated pieces from this collection. Limited runs. Once gone, gone.'
                : 'All of it. T-shirts, hoodies, accessories. Pick your armor.'}
            </p>
          </RevealBlock>
        </section>

        {/* Category tiles — shown when no collection filter */}
        {!activeCollection && (
          <section style={{ padding: '0 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
            <RevealBlock>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
              }}>
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link
                      to={`/apparel/${cat.slug}`}
                      style={{ display: 'block', position: 'relative', overflow: 'hidden' }}
                    >
                      <PlaceholderImage
                        gradientStyle={cat.gradient}
                        label={`${cat.label} — ${cat.count} items`}
                        aspect="3/2"
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 24,
                        transition: 'background 0.3s',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                      >
                        <p style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                          letterSpacing: '0.25em', textTransform: 'uppercase',
                          color: 'var(--purple-pale)', marginBottom: 6,
                        }}>
                          {cat.count} Styles
                        </p>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                          letterSpacing: '0.04em', color: 'var(--white)',
                          lineHeight: 1,
                        }}>
                          {cat.label}
                        </h3>
                        <p style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.5)', marginTop: 6,
                        }}>
                          {cat.desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </RevealBlock>
          </section>
        )}

        {/* Collection filter pills */}
        <section style={{ padding: '0 40px 40px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/apparel"
              className="btn"
              style={{
                fontSize: '0.65rem', padding: '8px 20px',
                borderColor: !activeCollection ? 'var(--purple)' : 'var(--gray-light)',
                color: !activeCollection ? 'var(--purple-pale)' : 'var(--muted)',
              }}
            >
              All
            </Link>
            {COLLECTIONS.map((c) => (
              <Link
                key={c.id}
                to={`/apparel?collection=${c.id}`}
                className="btn"
                style={{
                  fontSize: '0.65rem', padding: '8px 20px',
                  borderColor: activeCollection === c.id ? c.accent : 'var(--gray-light)',
                  color: activeCollection === c.id ? c.accent : 'var(--muted)',
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Product grid */}
        <section style={{ padding: '0 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 40,
          }}>
            {filteredProducts.map((p, i) => (
              <RevealBlock key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </RevealBlock>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </PageTransition>
  )
}
