import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import PlaceholderImage from '../components/PlaceholderImage'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { getProductBySlug, products } from '../data/products'

const COLLECTION_LABELS = {
  'heartbreak-series': 'Heartbreak Series',
  'love-notes-series': 'Love Notes Series',
}

// ── Size guide data (tops: tees & hoodies) ───────────────────────
// Measurements reflect oversized / dropped-shoulder streetwear construction.
// All garment measurements taken flat; double chest for full circumference.
// TODO: replace with final brand-confirmed measurements before launch.
const SIZE_ROWS = [
  { size: 'XS',  uk: '6–8',   eu: '32–34', chest: ['20"', '51 cm'], length: ['26"', '66 cm'], sleeve: ['31"', '79 cm'] },
  { size: 'S',   uk: '8–10',  eu: '36–38', chest: ['22"', '56 cm'], length: ['27"', '69 cm'], sleeve: ['32"', '81 cm'] },
  { size: 'M',   uk: '12–14', eu: '40–42', chest: ['24"', '61 cm'], length: ['28"', '71 cm'], sleeve: ['33"', '84 cm'] },
  { size: 'L',   uk: '16–18', eu: '44–46', chest: ['26"', '66 cm'], length: ['29"', '74 cm'], sleeve: ['34"', '86 cm'] },
  { size: 'XL',  uk: '20–22', eu: '48–50', chest: ['28"', '71 cm'], length: ['30"', '76 cm'], sleeve: ['35"', '89 cm'] },
  { size: 'XXL', uk: '24',    eu: '52',    chest: ['30"', '76 cm'], length: ['31"', '79 cm'], sleeve: ['36"', '91 cm'] },
]

// ── Size Guide Modal ──────────────────────────────────────────────
function SizeGuideModal({ onClose }) {
  return (
    <motion.div
      key="sg-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        key="sg-panel"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 720,
          background: '#0a0a0a',
          border: '1px solid rgba(123,0,255,0.25)',
          boxShadow: '0 0 60px rgba(123,0,255,0.15), 0 0 120px rgba(123,0,255,0.06)',
          padding: 'clamp(24px, 5vw, 48px)',
          position: 'relative',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--purple-pale)', marginBottom: 6,
            }}>
              Actin Out
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              lineHeight: 0.9, letterSpacing: '0.03em',
              color: 'var(--white)',
            }}>
              Size Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--muted)', fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem', letterSpacing: '0.1em',
              padding: '6px 12px', transition: 'all 0.2s',
              flexShrink: 0, marginLeft: 16, marginTop: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            ✕ Close
          </button>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 28,
        }}>
          Tops — Tees &amp; Hoodies
        </p>

        {/* Fit note */}
        <div style={{
          padding: '12px 16px', marginBottom: 28,
          background: 'rgba(123,0,255,0.06)',
          border: '1px solid rgba(123,0,255,0.18)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--purple-pale)', lineHeight: 1.7,
          }}>
            ▸ Garments are oversized / dropped-shoulder fit — size down if you prefer a closer cut.<br />
            ▸ All measurements taken flat across the garment (double chest for full circumference).<br />
            ▸ Values are approximate — final measurements may vary ±0.5 in / 1 cm per style.
          </p>
        </div>

        {/* Table — horizontal scroll on narrow screens */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                {['US', 'UK', 'EU', 'Chest', 'Body Length', 'Sleeve'].map((h) => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--purple-pale)',
                    padding: '10px 12px', textAlign: 'left',
                    borderBottom: '1px solid rgba(123,0,255,0.25)',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row, i) => (
                <tr
                  key={row.size}
                  style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                >
                  {/* US size */}
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.08em' }}>
                      {row.size}
                    </span>
                  </td>
                  {/* UK */}
                  <td style={tdStyle}>
                    <span style={labelStyle}>{row.uk}</span>
                  </td>
                  {/* EU */}
                  <td style={tdStyle}>
                    <span style={labelStyle}>{row.eu}</span>
                  </td>
                  {/* Chest */}
                  <MeasureCell in={row.chest[0]} cm={row.chest[1]} />
                  {/* Body Length */}
                  <MeasureCell in={row.length[0]} cm={row.length[1]} />
                  {/* Sleeve */}
                  <MeasureCell in={row.sleeve[0]} cm={row.sleeve[1]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', lineHeight: 1.8,
        }}>
          Size conversion is approximate — fit may differ across styles and fabric weights.
          {/* TODO: update measurements per-product when production samples are confirmed */}
        </p>
      </motion.div>
    </motion.div>
  )
}

const tdStyle = {
  padding: '12px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'middle',
}

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--muted)', letterSpacing: '0.05em',
}

function MeasureCell({ in: inches, cm }) {
  return (
    <td style={tdStyle}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--white)', display: 'block', letterSpacing: '0.04em' }}>
        {inches}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
        {cm}
      </span>
    </td>
  )
}

// ── Product Detail page ───────────────────────────────────────────
export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = getProductBySlug(slug)

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const relatedRef = useRef(null)
  const relatedInView = useInView(relatedRef, { once: true, margin: '-80px' })

  if (!product) {
    return (
      <PageTransition>
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'rgba(255,255,255,0.1)' }}>NOT FOUND</h1>
          <Link to="/apparel" className="btn btn-primary">Back to Shop</Link>
        </div>
      </PageTransition>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    addItem(product, selectedSize || product.sizes[0], selectedColor || product.colors[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        {/* Breadcrumb */}
        <div style={{ padding: '24px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <Link to="/" onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--muted)'} style={{transition:'color 0.2s'}}>Home</Link>
            {' / '}
            <Link to="/apparel" onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--muted)'} style={{transition:'color 0.2s'}}>Apparel</Link>
            {' / '}
            <span style={{ color: 'var(--purple-pale)' }}>{product.name}</span>
          </p>
        </div>

        {/* Main layout */}
        <section data-product-grid="" style={{
          padding: '40px 40px 80px', maxWidth: 1440, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'start',
        }}>
          {/* Image column */}
          <motion.div
            data-product-images=""
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'sticky', top: 100 }}
          >
            <PlaceholderImage
              gradientStyle={product.gradientStyle}
              label={`[${product.name} — Product Photo]`}
              aspect="4/5"
            />
            {/* Secondary placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {['Back View', 'Detail Shot'].map((l) => (
                <PlaceholderImage
                  key={l}
                  gradientStyle={product.gradientStyle}
                  label={`[${l}]`}
                  aspect="1/1"
                />
              ))}
            </div>
          </motion.div>

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--purple-pale)', marginBottom: 12,
            }}>
              {COLLECTION_LABELS[product.collection]} · {product.isNew ? 'New Arrival' : 'Available Now'}
            </p>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 0.9, letterSpacing: '0.03em',
              color: 'var(--white)', marginBottom: 16,
            }}>
              {product.name}
            </h1>

            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              letterSpacing: '0.05em', color: 'var(--muted)',
              fontStyle: 'italic', marginBottom: 24,
            }}>
              "{product.tagline}"
            </p>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem', color: 'var(--white)', marginBottom: 32,
            }}>
              ${product.price}
            </p>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 32 }} />

            {/* Color select */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                  Colorway: <span style={{ color: 'var(--white)' }}>{selectedColor || product.colors[0]}</span>
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '8px 16px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        background: 'transparent',
                        color: (selectedColor || product.colors[0]) === c ? 'var(--white)' : 'var(--muted)',
                        border: `1px solid ${(selectedColor || product.colors[0]) === c ? 'var(--purple)' : 'var(--gray)'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size select */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: sizeError ? 'var(--pink)' : 'var(--muted)' }}>
                  {sizeError ? '— Select a size' : 'Size'}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  style={{
                    background: 'none', border: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.15em', color: 'var(--purple-pale)',
                    textDecoration: 'underline', textDecorationColor: 'rgba(123,0,255,0.4)',
                    textTransform: 'uppercase', transition: 'color 0.2s',
                    cursor: 'pointer', padding: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--purple-pale)'}
                >
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setSizeError(false) }}
                    style={{
                      width: 48, height: 48,
                      fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      background: selectedSize === s ? 'var(--purple)' : 'transparent',
                      color: selectedSize === s ? '#fff' : 'var(--muted)',
                      border: `1px solid ${selectedSize === s ? 'var(--purple)' : sizeError ? 'var(--pink)' : 'var(--gray)'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              style={{
                width: '100%', padding: '18px 24px',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: added ? 'var(--pink)' : 'var(--purple)',
                color: '#fff', border: 'none',
                transition: 'background 0.3s ease',
                marginBottom: 12,
                boxShadow: added ? '0 0 30px rgba(255,0,110,0.3)' : '0 0 20px rgba(123,0,255,0.2)',
              }}
            >
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </motion.button>
            <button
              onClick={() => { handleAddToCart(); navigate('/cart') }}
              style={{
                width: '100%', padding: '16px 24px',
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--muted)', border: '1px solid var(--gray)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='var(--gray-light)'}}
              onMouseLeave={e=>{e.target.style.color='var(--muted)';e.target.style.borderColor='var(--gray)'}}
            >
              Buy Now
            </button>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '32px 0' }} />

            {/* Description */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
              {product.description}
            </p>

            {/* Details accordion style */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', padding: '16px 0 12px' }}>
                Details
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.details.map((d, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--purple)', fontSize: '0.6rem', marginTop: 4 }}>▸</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ padding: '0 40px 80px', maxWidth: 1440, margin: '0 auto' }} ref={relatedRef}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 60 }} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>You might also feel</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 40, color: 'var(--white)' }}>
                Related Pieces
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 32,
              }}>
                {related.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
      <Footer />

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          [data-product-grid] {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          /* Images must NOT be sticky on mobile — sticky in single-col causes
             the image block to overlap the info column below it */
          [data-product-images] {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}
