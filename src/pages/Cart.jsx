import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import PlaceholderImage from '../components/PlaceholderImage'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart()
  const navigate = useNavigate()

  const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 8) : 0
  const total = subtotal + shipping

  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        <div style={{ padding: '40px 40px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-eyebrow">Your order</p>
            <h1 className="section-title" style={{ marginBottom: 60 }}>
              Cart {totalItems > 0 && <span style={{ color: 'var(--purple)' }}>({totalItems})</span>}
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <div style={{
                width: 80, height: 80, margin: '0 auto 24px',
                border: '1px solid var(--gray)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', marginBottom: 16 }}>
                NOTHING HERE
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 36 }}>
                You haven't added anything yet.
              </p>
              <Link to="/apparel" className="btn btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: 60, alignItems: 'start',
            }}>
              {/* Items list */}
              <div>
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr auto',
                        gap: 24, alignItems: 'center',
                        padding: '24px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* Thumbnail */}
                      <Link to={`/product/${item.slug}`} style={{ display: 'block' }}>
                        <PlaceholderImage
                          gradientStyle={item.gradientStyle}
                          label={item.name}
                          aspect="4/5"
                        />
                      </Link>

                      {/* Details */}
                      <div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--purple-pale)', marginBottom: 6 }}>
                          {item.collection === 'heartbreak-series' ? 'Heartbreak Series' : 'Love Notes Series'}
                        </p>
                        <Link to={`/product/${item.slug}`}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.03em', color: 'var(--white)', marginBottom: 8, lineHeight: 1 }}>
                            {item.name}
                          </h3>
                        </Link>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {item.size} · {item.color}
                        </p>

                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 20, width: 'fit-content', border: '1px solid var(--gray)' }}>
                          <button
                            onClick={() => updateQty(item.cartKey, item.qty - 1)}
                            style={{
                              width: 36, height: 36, background: 'none', border: 'none',
                              color: 'var(--muted)', fontSize: '1.1rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={e=>e.target.style.color='var(--white)'}
                            onMouseLeave={e=>e.target.style.color='var(--muted)'}
                          >
                            −
                          </button>
                          <span style={{
                            width: 36, textAlign: 'center',
                            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                            color: 'var(--white)',
                          }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.cartKey, item.qty + 1)}
                            style={{
                              width: 36, height: 36, background: 'none', border: 'none',
                              color: 'var(--muted)', fontSize: '1.1rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={e=>e.target.style.color='var(--white)'}
                            onMouseLeave={e=>e.target.style.color='var(--muted)'}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--white)', marginBottom: 12 }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.cartKey)}
                          style={{
                            background: 'none', border: 'none',
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: 'var(--muted)', transition: 'color 0.2s',
                            textDecoration: 'underline',
                          }}
                          onMouseEnter={e=>e.target.style.color='var(--pink)'}
                          onMouseLeave={e=>e.target.style.color='var(--muted)'}
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div style={{ marginTop: 24 }}>
                  <Link to="/apparel" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--muted)', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e=>e.target.style.color='var(--white)'}
                    onMouseLeave={e=>e.target.style.color='var(--muted)'}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order summary */}
              <div style={{
                background: 'var(--gray-dark)',
                border: '1px solid rgba(123,0,255,0.12)',
                padding: 32,
                position: 'sticky', top: 100,
              }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 32 }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  <Row
                    label="Shipping"
                    value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    valueColor={shipping === 0 ? 'var(--purple-pale)' : 'var(--white)'}
                  />
                  {subtotal > 0 && subtotal < 100 && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: -4 }}>
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <Row label="Total" value={`$${total.toFixed(2)}`} large />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                  style={{
                    width: '100%', marginTop: 28, padding: '18px',
                    background: 'var(--purple)', border: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#fff',
                    transition: 'background 0.2s',
                    boxShadow: '0 0 30px rgba(123,0,255,0.2)',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--pink)'}
                  onMouseLeave={e=>e.currentTarget.style.background='var(--purple)'}
                >
                  Proceed to Checkout
                </motion.button>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', marginTop: 16 }}>
                  Secure checkout · All sales final
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}

function Row({ label, value, valueColor = 'var(--white)', large = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: large ? '0.82rem' : '0.72rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: large ? 'var(--white)' : 'var(--muted)',
        fontWeight: large ? 700 : 400,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: large ? '1rem' : '0.82rem',
        color: valueColor, fontWeight: large ? 700 : 400,
      }}>
        {value}
      </span>
    </div>
  )
}
