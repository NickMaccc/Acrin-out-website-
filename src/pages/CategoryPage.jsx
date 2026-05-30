import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { getProductsByCategory } from '../data/products'

const META = {
  tshirts: {
    label: 'T-Shirts',
    eyebrow: 'Category / Tops',
    desc: 'Every shirt is a statement someone was afraid to make out loud. Oversized, cropped, and fitted cuts. Built for the emotionally transparent.',
    accent: 'var(--purple-pale)',
  },
  hoodies: {
    label: 'Hoodies',
    eyebrow: 'Category / Outerwear',
    desc: 'Pull it over your head. Disappear into something that weighs as much as you feel. Heavyweight constructions for the emotionally loaded.',
    accent: 'var(--purple)',
  },
  accessories: {
    label: 'Accessories',
    eyebrow: 'Category / Accessories',
    desc: 'The small things that mean everything. Hats, bags, chains, and beanies — each one a relic of something you can\'t quite name.',
    accent: 'var(--pink)',
  },
}

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

export default function CategoryPage({ category }) {
  const products = getProductsByCategory(category)
  const meta = META[category]

  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        {/* Breadcrumb */}
        <div style={{ padding: '24px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            <Link to="/" style={{ transition: 'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >Home</Link>
            {' / '}
            <Link to="/apparel" style={{ transition: 'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >Apparel</Link>
            {' / '}
            <span style={{ color: meta.accent }}>{meta.label}</span>
          </p>
        </div>

        {/* Header */}
        <section style={{ padding: '40px 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <RevealBlock>
            <p className="section-eyebrow">{meta.eyebrow}</p>
            <h1 className="section-title" style={{ marginBottom: 20 }}>{meta.label}</h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', maxWidth: 520, lineHeight: 1.8,
            }}>
              {meta.desc}
            </p>
          </RevealBlock>
        </section>

        {/* Sort bar */}
        <div style={{ padding: '0 40px 32px', maxWidth: 1440, margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              {products.length} Products
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['All', 'New', 'Heartbreak Series', 'Love Notes Series'].map((f) => (
                <button key={f} className="btn btn-ghost" style={{ fontSize: '0.6rem', padding: '6px 14px' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <section style={{ padding: '0 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em' }}>
                NOTHING HERE YET
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.2em', marginTop: 16 }}>
                Check back soon.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 40,
            }}>
              {products.map((p, i) => (
                <RevealBlock key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </RevealBlock>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </PageTransition>
  )
}
