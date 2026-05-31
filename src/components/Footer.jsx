import { useState } from 'react'
import { Link } from 'react-router-dom'
import SizeGuideOverlay from './SizeGuideModal'

const linkStyle = {
  display: 'block', marginBottom: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
  color: 'var(--muted)', transition: 'color 0.2s',
}

export default function Footer() {
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  return (
    <>
      <footer style={{
        borderTop: '1px solid rgba(123,0,255,0.12)',
        padding: '60px 40px 40px',
        marginTop: 120,
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 60, marginBottom: 60,
        }}>
          {/* Brand col */}
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem', letterSpacing: '0.1em',
              display: 'block', marginBottom: 12,
              background: 'linear-gradient(90deg,#fff 20%,#b066ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              ACTIN OUT
            </span>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.1em', color: 'var(--muted)',
              textTransform: 'uppercase', lineHeight: 1.8,
            }}>
              Wear your emotions<br />on your sleeve.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--purple-pale)', textTransform: 'uppercase', marginBottom: 16 }}>Shop</p>
            {[
              { label: 'All Apparel', to: '/apparel' },
              { label: 'T-Shirts', to: '/apparel/tshirts' },
              { label: 'Hoodies', to: '/apparel/hoodies' },
              { label: 'Accessories', to: '/apparel/accessories' },
            ].map((l) => (
              <Link key={l.to} to={l.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{l.label}</Link>
            ))}
          </div>

          {/* Collections */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--purple-pale)', textTransform: 'uppercase', marginBottom: 16 }}>Collections</p>
            {[
              { label: 'Heartbreak Series', to: '/apparel?collection=heartbreak-series' },
              { label: 'Love Notes Series', to: '/apparel?collection=love-notes-series' },
            ].map((l) => (
              <Link key={l.to} to={l.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{l.label}</Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--purple-pale)', textTransform: 'uppercase', marginBottom: 16 }}>Info</p>

            {/* Sizing Guide — opens modal, not a page */}
            <button
              onClick={() => setShowSizeGuide(true)}
              style={{ ...linkStyle, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              Sizing Guide
            </button>

            <Link to="/shipping-returns" style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >Shipping &amp; Returns</Link>

            <Link to="/faq" style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >FAQ</Link>

            <Link to="/contact" style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >Contact</Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
            © 2026 ACTIN OUT. All emotional damage reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {/* TODO: replace # with real social URLs */}
            {[
              { label: 'IG', href: '#' },
              { label: 'TT', href: '#' },
              { label: 'X',  href: '#' },
            ].map((s) => (
              <a key={s.label} href={s.href}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--purple-pale)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Size guide modal triggered from footer Sizing Guide link */}
      <SizeGuideOverlay open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  )
}
