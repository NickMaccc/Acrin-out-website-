import { motion, AnimatePresence } from 'framer-motion'

// Garment measurements for tops (tees & hoodies), oversized / dropped-shoulder fit.
// TODO: replace with brand-confirmed measurements before launch.
const SIZE_ROWS = [
  { size: 'XS',  uk: '6–8',   eu: '32–34', chest: ['20"', '51 cm'], length: ['26"', '66 cm'], sleeve: ['31"', '79 cm'] },
  { size: 'S',   uk: '8–10',  eu: '36–38', chest: ['22"', '56 cm'], length: ['27"', '69 cm'], sleeve: ['32"', '81 cm'] },
  { size: 'M',   uk: '12–14', eu: '40–42', chest: ['24"', '61 cm'], length: ['28"', '71 cm'], sleeve: ['33"', '84 cm'] },
  { size: 'L',   uk: '16–18', eu: '44–46', chest: ['26"', '66 cm'], length: ['29"', '74 cm'], sleeve: ['34"', '86 cm'] },
  { size: 'XL',  uk: '20–22', eu: '48–50', chest: ['28"', '71 cm'], length: ['30"', '76 cm'], sleeve: ['35"', '89 cm'] },
  { size: 'XXL', uk: '24',    eu: '52',    chest: ['30"', '76 cm'], length: ['31"', '79 cm'], sleeve: ['36"', '91 cm'] },
]

const tdStyle = {
  padding: '12px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'middle',
}

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
  color: 'var(--muted)', letterSpacing: '0.05em',
}

function MeasureCell({ inches, cm }) {
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

export function SizeGuideModal({ onClose }) {
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
              cursor: 'pointer',
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
                <tr key={row.size} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.08em' }}>
                      {row.size}
                    </span>
                  </td>
                  <td style={tdStyle}><span style={labelStyle}>{row.uk}</span></td>
                  <td style={tdStyle}><span style={labelStyle}>{row.eu}</span></td>
                  <MeasureCell inches={row.chest[0]} cm={row.chest[1]} />
                  <MeasureCell inches={row.length[0]} cm={row.length[1]} />
                  <MeasureCell inches={row.sleeve[0]} cm={row.sleeve[1]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

// Convenience wrapper that includes AnimatePresence so callers only need to
// toggle a boolean and render <SizeGuideOverlay open={...} onClose={...} />
export default function SizeGuideOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && <SizeGuideModal onClose={onClose} />}
    </AnimatePresence>
  )
}
