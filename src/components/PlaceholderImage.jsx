export default function PlaceholderImage({ gradientStyle, label, aspect = '4/5', style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: aspect,
        background: gradientStyle || 'linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(123,0,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(123,0,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Corner markers */}
      {['top left','top right','bottom left','bottom right'].map((pos) => {
        const [v, h] = pos.split(' ')
        return (
          <div key={pos} style={{
            position: 'absolute',
            [v]: 16, [h]: 16,
            width: 12, height: 12,
            borderTop: v === 'top' ? '1px solid rgba(123,0,255,0.4)' : 'none',
            borderBottom: v === 'bottom' ? '1px solid rgba(123,0,255,0.4)' : 'none',
            borderLeft: h === 'left' ? '1px solid rgba(123,0,255,0.4)' : 'none',
            borderRight: h === 'right' ? '1px solid rgba(123,0,255,0.4)' : 'none',
          }} />
        )
      })}

      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{
          width: 32, height: 1,
          background: 'rgba(123,0,255,0.3)',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(123,0,255,0.5)',
        }}>
          {label || 'Product Image'}
        </span>
        <div style={{
          width: 32, height: 1,
          background: 'rgba(123,0,255,0.3)',
        }} />
      </div>

      {/* Purple glow at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '60%', height: '40%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(123,0,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
