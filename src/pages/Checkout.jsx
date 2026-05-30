import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import PlaceholderImage from '../components/PlaceholderImage'
import { useCart } from '../context/CartContext'
import { STRIPE_PUBLISHABLE_KEY, PAYPAL_CLIENT_ID, stripeEnabled, paypalEnabled, isLive } from '../config/payment'

// ─── PAYMENT METHOD TABS ─────────────────────────────────────────
// In live mode with keys set, replace these placeholder components with:
//   Card: <CardElement> from @stripe/react-stripe-js
//   Digital: <PaymentRequestButtonElement> from @stripe/react-stripe-js
//   PayPal: <PayPalButtons> from @paypal/react-paypal-js
// See src/config/payment.js for full integration instructions.
// ─────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'digital', label: 'Apple / Google Pay', icon: '⬡' },
  { id: 'paypal', label: 'PayPal', icon: 'P' },
]

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
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'var(--gray-dark)',
          border: '1px solid var(--gray)',
          color: 'var(--off-white)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--purple)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--gray)'}
      />
    </div>
  )
}

function SectionTitle({ children, small }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontSize: small ? '1.2rem' : '1.8rem',
      letterSpacing: '0.05em', color: 'var(--white)',
      marginBottom: small ? 14 : 24, marginTop: small ? 28 : 0,
    }}>
      {children}
    </h2>
  )
}

function StepNav({ onBack, label }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32, flexDirection: onBack ? 'row' : 'row-reverse' }}>
      {onBack && (
        <button type="button" onClick={onBack} className="btn btn-ghost" style={{ fontSize: '0.65rem', flex: '0 0 auto' }}>
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
        onMouseEnter={(e) => e.target.style.background = 'var(--purple-dim)'}
        onMouseLeave={(e) => e.target.style.background = 'var(--purple)'}
      >
        {label} →
      </button>
    </div>
  )
}

// ─── PAYMENT SECTION COMPONENTS ─────────────────────────────────

function TestModeBanner() {
  if (isLive) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 16px', marginBottom: 20,
      background: 'rgba(255,200,0,0.06)',
      border: '1px solid rgba(255,200,0,0.2)',
    }}>
      <span style={{ fontSize: '0.75rem' }}>⚠</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,210,0,0.7)', textTransform: 'uppercase' }}>
        Simulated — no real charge. Set VITE_PAYMENT_MODE=live to go live.
      </span>
    </div>
  )
}

// Placeholder where Stripe CardElement mounts when @stripe/react-stripe-js is installed
function StripeCardPlaceholder({ form, onChange }) {
  if (stripeEnabled) {
    // TODO: Replace with:
    // import { CardElement } from '@stripe/react-stripe-js'
    // return <CardElement id="stripe-card-element" className="stripe-card-element" options={...} />
    return null
  }
  // Simulated card form
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Field label="Cardholder Name" name="cardName" value={form.cardName} onChange={onChange} placeholder="Name on card" required />
      <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={onChange} placeholder="1234 5678 9012 3456" required />
      <Field label="Expiry" name="expiry" value={form.expiry} onChange={onChange} placeholder="MM / YY" half required />
      <Field label="CVV" name="cvv" value={form.cvv} onChange={onChange} placeholder="•••" half required />
    </div>
  )
}

// Placeholder where Stripe Payment Request Button mounts (Apple Pay / Google Pay)
function DigitalWalletPlaceholder() {
  if (stripeEnabled) {
    // TODO: Replace with:
    // import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js'
    // const stripe = useStripe()
    // const [paymentRequest, setPaymentRequest] = useState(null)
    // useEffect(() => { /* create paymentRequest */ }, [stripe])
    // return paymentRequest ? <PaymentRequestButtonElement id="payment-request-button" options={{ paymentRequest }} /> : <p>Not available</p>
    return null
  }
  return (
    <div style={{
      padding: '28px', textAlign: 'center',
      border: '1px solid var(--gray)',
      background: 'var(--gray-dark)',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
        Apple Pay / Google Pay
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
        Available after Stripe integration.<br />
        Automatically detects device &amp; browser.
      </p>
      <div style={{
        marginTop: 16, padding: '12px 28px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Pay with  — / —
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>
        Powered by Stripe — requires HTTPS in production
      </p>
    </div>
  )
}

// Placeholder where PayPal SDK buttons mount
function PayPalPlaceholder() {
  if (paypalEnabled) {
    // TODO: Replace with:
    // import { PayPalButtons } from '@paypal/react-paypal-js'
    // return (
    //   <PayPalButtons
    //     createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: total.toFixed(2) } }] })}
    //     onApprove={(data, actions) => actions.order.capture().then(handlePayPalSuccess)}
    //   />
    // )
    return null
  }
  return (
    <div style={{
      padding: '28px', textAlign: 'center',
      border: '1px solid var(--gray)',
      background: 'var(--gray-dark)',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        PayPal
      </p>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', maxWidth: 280, padding: '13px',
        background: '#FFC439', borderRadius: 2,
        fontFamily: "'Trebuchet MS', sans-serif", fontSize: '1.1rem',
        fontWeight: 700, color: '#003087', letterSpacing: 0,
        opacity: 0.35,
      }}>
        Pay<span style={{ color: '#009cde' }}>Pal</span>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>
        Set VITE_PAYPAL_CLIENT_ID to activate
      </p>
    </div>
  )
}

// ─── MAIN CHECKOUT COMPONENT ─────────────────────────────────────

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [payMethod, setPayMethod] = useState('card')

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', apt: '', city: '', state: '', zip: '', country: 'US',
    shippingMethod: 'standard',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  })

  const shipping = form.shippingMethod === 'express' ? 18 : (subtotal >= 100 ? 0 : 8)
  const total = subtotal + shipping

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleNext = (e) => {
    e.preventDefault()
    setStep((s) => s + 1)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    // TODO: In live mode, call your backend to create a PaymentIntent
    // and confirm with stripe.confirmCardPayment(clientSecret, { payment_method: ... })
    // or let Stripe handle it via the Payment Element.
    await new Promise((r) => setTimeout(r, 1800))
    setPlacing(false)
    setPlaced(true)
    clearCart()
  }

  // ─── ORDER CONFIRMED SCREEN ───────────────────────────────────
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
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 16 }}>
            ORDER PLACED
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
            Confirmation sent to {form.email || 'your email'}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--muted)', maxWidth: 420, lineHeight: 1.7, marginBottom: 48 }}>
            Your order is on its way. We'll notify you when it ships.
          </motion.p>
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            onClick={() => navigate('/')} className="btn btn-primary">
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,255,255,0.1)' }}>CART IS EMPTY</p>
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
          {/* Header + stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em', color: 'var(--white)' }}>
              Checkout
            </h1>
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
                    <span style={{ color: 'var(--gray)', fontSize: '0.6rem', margin: '0 4px' }}>›</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60, alignItems: 'start' }}>
            {/* ─── FORMS ─── */}
            <div>
              <AnimatePresence mode="wait">

                {/* STEP 0 — Contact */}
                {step === 0 && (
                  <motion.form key="contact"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleNext}
                  >
                    <SectionTitle>Contact</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                      <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First" half required />
                      <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last" half required />
                    </div>
                    <StepNav label="Continue to Shipping" />
                  </motion.form>
                )}

                {/* STEP 1 — Shipping */}
                {step === 1 && (
                  <motion.form key="shipping"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleNext}
                  >
                    <SectionTitle>Shipping Address</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Field label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Nowhere St" required />
                      <Field label="Apt / Suite (optional)" name="apt" value={form.apt} onChange={handleChange} placeholder="Apt 4B" />
                      <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="City" half required />
                      <Field label="State / Region" name="state" value={form.state} onChange={handleChange} placeholder="NY" half required />
                      <Field label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" half required />
                      <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="US" half />
                    </div>

                    <SectionTitle small>Shipping Method</SectionTitle>
                    {[
                      { id: 'standard', label: 'Standard', time: '5–8 business days', price: subtotal >= 100 ? 'Free' : '$8.00' },
                      { id: 'express', label: 'Express', time: '2–3 business days', price: '$18.00' },
                    ].map((m) => (
                      <label key={m.id} data-cursor-scale style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px', marginBottom: 8,
                        border: `1px solid ${form.shippingMethod === m.id ? 'var(--purple)' : 'var(--gray)'}`,
                        background: form.shippingMethod === m.id ? 'rgba(123,0,255,0.05)' : 'transparent',
                        transition: 'all 0.2s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%',
                            border: `1px solid ${form.shippingMethod === m.id ? 'var(--purple)' : 'var(--gray)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {form.shippingMethod === m.id && (
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }} />
                            )}
                          </div>
                          <input type="radio" name="shippingMethod" value={m.id} checked={form.shippingMethod === m.id} onChange={handleChange} style={{ display: 'none' }} />
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--off-white)' }}>{m.label}</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{m.time}</p>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--white)' }}>{m.price}</span>
                      </label>
                    ))}

                    <StepNav onBack={() => setStep(0)} label="Continue to Payment" />
                  </motion.form>
                )}

                {/* STEP 2 — Payment */}
                {step === 2 && (
                  <motion.form key="payment"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePlaceOrder}
                  >
                    <SectionTitle>Payment</SectionTitle>
                    <TestModeBanner />

                    {/* Payment method tabs */}
                    <div style={{ display: 'flex', marginBottom: 24 }}>
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`payment-tab${payMethod === m.id ? ' active' : ''}`}
                          onClick={() => setPayMethod(m.id)}
                        >
                          <span>{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Card tab */}
                    {payMethod === 'card' && (
                      <motion.div key="card-form"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
                      >
                        {stripeEnabled ? (
                          // Stripe Card Element mounts here. See src/config/payment.js.
                          <div id="stripe-card-element" className="stripe-card-element" />
                        ) : (
                          <StripeCardPlaceholder form={form} onChange={handleChange} />
                        )}
                      </motion.div>
                    )}

                    {/* Apple Pay / Google Pay tab */}
                    {payMethod === 'digital' && (
                      <motion.div key="digital-form"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
                      >
                        {/* Stripe Payment Request Button mounts here. See src/config/payment.js. */}
                        <div id="payment-request-button" />
                        <DigitalWalletPlaceholder />
                      </motion.div>
                    )}

                    {/* PayPal tab */}
                    {payMethod === 'paypal' && (
                      <motion.div key="paypal-form"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
                      >
                        {/* PayPal Buttons mount here. See src/config/payment.js. */}
                        <div id="paypal-button-container" />
                        <PayPalPlaceholder />
                      </motion.div>
                    )}

                    {/* Submit */}
                    {(payMethod === 'card' || !isLive) && (
                      <motion.button
                        type="submit"
                        disabled={placing}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%', marginTop: 28, padding: '18px',
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
                          `Place Order — $${total.toFixed(2)}`
                        )}
                      </motion.button>
                    )}

                    <button
                      type="button" onClick={() => setStep(1)}
                      style={{
                        width: '100%', marginTop: 12, padding: '14px',
                        background: 'transparent', border: '1px solid var(--gray)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--muted)', transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--white)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
                    >
                      ← Back
                    </button>

                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', marginTop: 16 }}>
                      {stripeEnabled ? 'Secured by Stripe' : 'Payment powered by Stripe · PayPal'}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ─── ORDER SUMMARY SIDEBAR ─── */}
            <div style={{
              background: 'var(--gray-dark)',
              border: '1px solid rgba(123,0,255,0.1)',
              padding: 28,
              position: 'sticky', top: 100,
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 24 }}>
                Your Order
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {items.map((item) => (
                  <div key={item.cartKey} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0, width: 60 }}>
                      <PlaceholderImage gradientStyle={item.gradientStyle} label="" aspect="4/5" />
                      <span style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--gray)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--white)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{item.qty}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--off-white)', marginBottom: 2 }}>{item.name}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.size} / {item.color}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--white)' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} valueColor={shipping === 0 ? 'var(--purple-pale)' : 'var(--white)'} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                  <Row label="Total" value={`$${total.toFixed(2)}`} large />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .payment-tab { font-size: 0.55rem !important; padding: 10px 8px !important; }
        }
      `}</style>
    </PageTransition>
  )
}

function Row({ label, value, valueColor = 'var(--white)', large = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: large ? '0.78rem' : '0.68rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: large ? 'var(--off-white)' : 'var(--muted)', fontWeight: large ? 700 : 400,
      }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: large ? '1rem' : '0.82rem', color: valueColor, fontWeight: large ? 700 : 400 }}>
        {value}
      </span>
    </div>
  )
}
