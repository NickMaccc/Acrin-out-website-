import { Link } from 'react-router-dom'

export default function Footer() {
  return (
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
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--purple-pale)', textTransform:'uppercase', marginBottom:16 }}>Shop</p>
          {[
            { label: 'All Apparel', to: '/apparel' },
            { label: 'T-Shirts', to: '/apparel/tshirts' },
            { label: 'Hoodies', to: '/apparel/hoodies' },
            { label: 'Accessories', to: '/apparel/accessories' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={{ display:'block', marginBottom:10, fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--muted)', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >{l.label}</Link>
          ))}
        </div>

        {/* Collections */}
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--purple-pale)', textTransform:'uppercase', marginBottom:16 }}>Collections</p>
          {[
            { label: 'Heartbreak Series', to: '/apparel?collection=heartbreak-series' },
            { label: 'Love Notes Series', to: '/apparel?collection=love-notes-series' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={{ display:'block', marginBottom:10, fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--muted)', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >{l.label}</Link>
          ))}
        </div>

        {/* Info */}
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.2em', color:'var(--purple-pale)', textTransform:'uppercase', marginBottom:16 }}>Info</p>
          {['Sizing Guide', 'Shipping & Returns', 'FAQ', 'Contact'].map((l) => (
            <a key={l} href="#" style={{ display:'block', marginBottom:10, fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--muted)', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >{l}</a>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', letterSpacing:'0.1em', color:'rgba(255,255,255,0.2)', textTransform:'uppercase' }}>
          © 2025 ACTIN OUT. All emotional damage reserved.
        </p>
        <div style={{ display:'flex', gap:24 }}>
          {['IG', 'TT', 'X'].map((s) => (
            <a key={s} href="#" style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', color:'var(--muted)', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--purple-pale)'}
              onMouseLeave={e=>e.target.style.color='var(--muted)'}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
