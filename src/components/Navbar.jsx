import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Apparel', to: '/apparel' },
  { label: 'About Us', to: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  const toggleMenu = () => {
    setMenuOpen((v) => {
      document.body.style.overflow = !v ? 'hidden' : ''
      return !v
    })
  }

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 40px',
          height: '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.4s ease, border-color 0.4s ease',
          background: scrolled ? 'rgba(0,0,0,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(123,0,255,0.14)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            letterSpacing: '0.1em',
            lineHeight: 1,
            background: 'linear-gradient(90deg, #fff 30%, #b877ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ACTIN OUT
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.32em',
            color: 'var(--purple-pale)',
            textTransform: 'uppercase',
          }}>
            wear your emotions
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
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
          ))}

          {/* Account */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--purple-pale)',
              }}>
                {user.name}
              </span>
              <button
                onClick={signOut}
                style={{
                  background: 'none', border: '1px solid rgba(123,0,255,0.3)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--muted)', padding: '5px 10px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--white)'; e.target.style.borderColor = 'var(--purple)' }}
                onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'rgba(123,0,255,0.3)' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: 'none', border: '1px solid rgba(123,0,255,0.4)',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--purple-pale)', padding: '7px 14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,0,255,0.12)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(123,0,255,0.4)' }}
            >
              Log In
            </button>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              position: 'relative',
              color: 'var(--off-white)', transition: 'color 0.2s',
            }}
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          >
            <CartIcon />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: -9, right: -11,
                    width: 18, height: 18,
                    background: 'var(--pink)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.58rem', fontWeight: 700, color: '#fff',
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Mobile right side — cart + hamburger */}
        <div className="mobile-controls" style={{ display: 'none', alignItems: 'center', gap: 20 }}>
          <Link to="/cart" style={{ position: 'relative', color: 'var(--off-white)' }}>
            <CartIcon />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -10,
                width: 16, height: 16, background: 'var(--pink)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 700, color: '#fff',
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ background: 'none', border: 'none', color: 'var(--white)', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
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
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(16px)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: 44,
            }}
          >
            {[...NAV_LINKS, { label: 'Cart', to: '/cart' }].map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.to}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    letterSpacing: '0.06em',
                    color: 'var(--white)', transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--purple-pale)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--white)'}
                >
                  {link.to === '/cart' && totalItems > 0 ? `Cart (${totalItems})` : link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-controls { display: flex !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
