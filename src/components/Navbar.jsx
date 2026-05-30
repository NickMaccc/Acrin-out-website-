import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Apparel', to: '/apparel' },
  { label: 'Collections', sub: [
    { label: 'Heartbreak Series', to: '/apparel?collection=heartbreak-series' },
    { label: 'Love Notes Series', to: '/apparel?collection=love-notes-series' },
  ]},
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { totalItems } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 40px',
          height: '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(123,0,255,0.12)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            letterSpacing: '0.12em',
            lineHeight: 1,
            background: 'linear-gradient(90deg, #fff 30%, #b066ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ACTIN OUT
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.35em',
            color: 'var(--purple-pale)',
            textTransform: 'uppercase',
          }}>
            wear your emotions
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {NAV_LINKS.map((link) =>
            link.sub ? (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
              >
                <button style={{
                  background: 'none', border: 'none', color: 'var(--off-white)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                  <span style={{ fontSize: '0.6rem', opacity: 0.6, transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute', top: '100%', left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '16px',
                        background: 'rgba(10,10,10,0.95)',
                        border: '1px solid rgba(123,0,255,0.2)',
                        backdropFilter: 'blur(12px)',
                        padding: '8px 0',
                        minWidth: '200px',
                        display: 'flex', flexDirection: 'column',
                      }}
                    >
                      {link.sub.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          style={{
                            padding: '12px 20px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            transition: 'color 0.2s, background 0.2s',
                            display: 'block',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = 'var(--purple-pale)'
                            e.target.style.background = 'rgba(123,0,255,0.08)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = 'var(--muted)'
                            e.target.style.background = 'transparent'
                          }}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--purple-pale)' : 'var(--off-white)',
                  transition: 'color 0.2s',
                  position: 'relative',
                })}
              >
                {link.label}
              </NavLink>
            )
          )}

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--off-white)', transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: -8, right: -10,
                  width: 18, height: 18,
                  background: 'var(--pink)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontWeight: 700,
                  color: '#fff',
                }}
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: 'var(--white)', flexDirection: 'column', gap: 5,
            padding: 4,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5,
              background: menuOpen && i === 1 ? 'transparent' : 'var(--white)',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translateY(6.5px)' : i === 2 ? 'rotate(-45deg) translateY(-6.5px)' : 'none'
                : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.97)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: 40,
              backdropFilter: 'blur(16px)',
            }}
          >
            {[
              { label: 'Home', to: '/' },
              { label: 'Apparel', to: '/apparel' },
              { label: 'T-Shirts', to: '/apparel/tshirts' },
              { label: 'Hoodies', to: '/apparel/hoodies' },
              { label: 'Accessories', to: '/apparel/accessories' },
              { label: `Cart (${totalItems})`, to: '/cart' },
            ].map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={link.to}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                    letterSpacing: '0.08em',
                    color: 'var(--white)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--purple)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--white)'}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
