import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'

const COLLECTION_LABELS = {
  'heartbreak-series': 'Heartbreak Series',
  'love-notes-series': 'Love Notes Series',
}

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
        {/* Image container */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          boxShadow: hovered ? '0 20px 60px rgba(123,0,255,0.2)' : '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s ease',
        }}>
          <div style={{
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}>
            <PlaceholderImage
              gradientStyle={product.gradientStyle}
              label={product.name}
            />
          </div>

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            backdropFilter: hovered ? 'blur(2px)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--white)',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '10px 20px',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.3s ease',
            }}>
              View Product
            </span>
          </div>

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.isNew && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'var(--purple)', color: '#fff',
                padding: '4px 8px',
              }}>New</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--purple-pale)', marginBottom: 6,
              }}>
                {COLLECTION_LABELS[product.collection]}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                letterSpacing: '0.04em',
                color: hovered ? 'var(--purple-pale)' : 'var(--white)',
                transition: 'color 0.3s',
                lineHeight: 1,
              }}>
                {product.name}
              </h3>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--white)',
              flexShrink: 0,
              marginTop: 4,
            }}>
              ${product.price}
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'var(--muted)',
            marginTop: 6,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.tagline}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
