import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import PlaceholderImage from '../components/PlaceholderImage'
import { useCart } from '../context/CartContext'

const STEPS = ['Contact', 'Shipping', 'Payment']

function Field({ label, type = 'text', placeholder, half, name, value, onChange, required }) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 8,
      }}>
        {label}{required && <span style={{ color: 'var(--pink)', marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'var(--gray-dark)',
          border: '1px solid var(--gray)',
          color: 'var(--white)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--purple)'}
        onBlur={e => e.target.style.borderColor = 'var(--gray)'}
        required={required}
      />
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', apt: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  })

  const shipping = subtotal >= 100 ? 0 : 8
  const total = subtotal + shipping

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleNext = (e) => {
    e.preventDefault()
    if (step < 2) setStep((s) => s + 1)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setPlacing(false)
    setPlaced(true)
    clearCart()
  }

  if (placed) {
    return (
      <PageTransition>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px', textAlign: 'center',
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
              boxShadow: '0 0 60px rgba(123,0,255,0.4)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              letterSpacing: '0.05em', color: 'var(--white)',
              marginBottom: 16,
            }}
          >
            ORDER PLACED
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 12,
            }}
          >
            Confirmation sent to {form.email || 'your email'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', maxWidth: 420, lineHeight: 1.7, marginBottom: 48,
            }}
          >
            Your order is on its way. We'll notify you when it ships. Thank you for shopping at ACTIN OUT.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Home
          </motion.button>
        </div>
      </PageTransition>
    )
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,255,255,0.1)' }}>YOUR CART IS EMPTY</p>
          <button onClick={() => navigate('/apparel')} className="btn btn-primary">Go Shopping</button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="grain-overlay" />
      <div className="page">
        <div style={{ padding: '40px 40px 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
              Checkout
            </h1>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 0 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => i < step && setStep(i)}
                    style={{
                      background: 'none', border: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: i === step ? 'var(--white)' : i < step ? 'var(--purple-pale)' : 'var(--muted)',
                      padding: '6px 12px',
                      borderBottom: i === step ? '1px solid var(--purple)' : '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {i + 1}. {s}
                  </button>
                  {i < STEPS.length - 1 && (
                    <span style={{ color: 'var(--gray)', margin: '0 4px', fontSize: '0.6rem' }}>›</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60, alignItems: 'start' }}>
            {/* Form */}
            <div>
              <AnimatePresence mode="wait">
                {/* Step 0: Contact */}
                {step === 0 && (
                  <motion.form
                    key="contact"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleNext}
                  >
                    <SectionTitle>Contact</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                      <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First" half required />
                      <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last" half required />
                    </div>
                    <StepNav onNext={null} label="Continue to Shipping" />
                  </motion.form>
                )}

                {/* Step 1: Shipping */}
                {step === 1 && (
                  <motion.form
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleNext}
                  >
                    <SectionTitle>Shipping Address</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Nowhere St" required />
                      <Field label="Apt / Suite (optional)" name="apt" value={form.apt} onChange={handleChange} placeholder="Apt 4B" />
                      <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="City" half required />
                      <Field label="State" name="state" value={form.state} onChange={handleChange} placeholder="NY" half required />
                      <Field label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" half required />
                      <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="US" half />
                    </div>

                    {/* Shipping method */}
                    <div style={{ marginTop: 28 }}>
                      <SectionTitle small>Shipping Method</SectionTitle>
                      {[
                        { id: 'standard', label: 'Standard Shipping', time: '5–8 business days', price: shipping === 0 ? 'Free' : '$8.00' },
                        { id: 'express', label: 'Express Shipping', time: '2–3 business days', price: '$18.00' },
                      ].map((m) => (
                        <div key={m.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '16px', marginBottom: 8,
                          border: m.id === 'standard' ? '1px solid var(--purple)' : '1px solid var(--gray)',
                          background: m.id === 'standard' ? 'rgba(123,0,255,0.04)' : 'transparent',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: '50%',
                              border: `1px solid ${m.id === 'standard' ? 'var(--purple)' : 'var(--gray)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {m.id === 'standard' && (
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }} />
                              )}
                            </div>
                            <div>
                              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--white)' }}>{m.label}</p>
                              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{m.time}</p>
                            </div>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--white)' }}>{m.price}</span>
                        </div>
                      ))}
                    </div>

                    <StepNav onBack={() => setStep(0)} label="Continue to Payment" />
                  </motion.form>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.form
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePlaceOrder}
                  >
                    <SectionTitle>Payment</SectionTitle>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', marginBottom: 24,
                      background: 'rgba(123,0,255,0.06)',
                      border: '1px solid rgba(123,0,255,0.15)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple-pale)" strokeWidth="1.5">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                        Simulated payment — no real charge
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Cardholder Name" name="cardName" value={form.cardName} onChange={handleChange} placeholder="Name on card" required />
                      <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" required />
                      <Field label="Expiry Date" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" half required />
                      <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" half required />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={placing}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%', marginTop: 32, padding: '18px',
                        background: placing ? 'var(--purple-dim)' : 'var(--purple)',
                        border: 'none', color: '#fff',
                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        transition: 'background 0.2s',
                        boxShadow: '0 0 40px rgba(123,0,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      }}
                    >
                      {placing ? (
                        <>
                          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>↻</motion.span>
                          Processing...
                        </>
                      ) : (
                        `Place Order · $${total.toFixed(2)}`
                      )}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        width: '100%', marginTop: 12, padding: '14px',
                        background: 'transparent', border: '1px solid var(--gray)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--muted)', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e=>e.target.style.color='var(--white)'}
                      onMouseLeave={e=>e.target.style.color='var(--muted)'}
                    >
                      ← Back
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Order summary sidebar */}
            <div style={{
              background: 'var(--gray-dark)',
              border: '1px solid rgba(123,0,255,0.1)',
              padding: 28,
              position: 'sticky', top: 100,
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 24 }}>
                Your Order
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map((item) => (
                  <div key={item.cartKey} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0, width: 60 }}>
                      <PlaceholderImage gradientStyle={item.gradientStyle} label="" aspect="4/5" />
                      <span style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--gray)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        color: 'var(--white)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.qty}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--white)', marginBottom: 2 }}>{item.name}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.size} / {item.color}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--white)' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--white)' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shipping</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: shipping === 0 ? 'var(--purple-pale)' : 'var(--white)' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--white)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--white)', fontWeight: 700 }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}

function SectionTitle({ children, small }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontSize: small ? '1.2rem' : '1.8rem',
      letterSpacing: '0.05em', color: 'var(--white)',
      marginBottom: small ? 14 : 24,
      marginTop: small ? 28 : 0,
    }}>
      {children}
    </h2>
  )
}

function StepNav({ onBack, label }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32, flexDirection: onBack ? 'row' : 'row-reverse' }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost"
          style={{ fontSize: '0.65rem', flex: '0 0 auto' }}
        >
          ← Back
        </button>
      )}
      <button
        type="submit"
        style={{
          flex: 1, padding: '16px',
          background: 'var(--purple)', border: 'none', color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e=>e.target.style.background='var(--purple-dim)'}
        onMouseLeave={e=>e.target.style.background='var(--purple)'}
      >
        {label} →
      </button>
    </div>
  )
}
