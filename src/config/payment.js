// ─── PAYMENT CONFIGURATION ───────────────────────────────────────
//
// Set these in .env.local (never commit real keys):
//
//   VITE_STRIPE_PUBLIC_KEY=pk_test_...   (Stripe publishable key)
//   VITE_PAYPAL_CLIENT_ID=AaBbCc...      (PayPal REST client ID)
//   VITE_PAYMENT_MODE=simulated          (change to "live" when ready)
//
// ─── TO ENABLE STRIPE (cards, Apple Pay, Google Pay) ─────────────
//   1. npm install @stripe/react-stripe-js @stripe/stripe-js
//   2. Set VITE_STRIPE_PUBLIC_KEY in .env.local
//   3. In Checkout.jsx, replace the StripeCardPlaceholder component with:
//        import { loadStripe } from '@stripe/stripe-js'
//        import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
//        const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
//        // Wrap payment step in: <Elements stripe={stripePromise}>
//        // Mount: <CardElement id="stripe-card-element" options={CARD_ELEMENT_OPTIONS} />
//        // On submit: stripe.createPaymentMethod({ type: 'card', card: elements.getElement(CardElement) })
//
// ─── TO ENABLE PAYPAL ────────────────────────────────────────────
//   1. npm install @paypal/react-paypal-js
//   2. Set VITE_PAYPAL_CLIENT_ID in .env.local
//   3. Wrap app (or just checkout) with:
//        import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
//        <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
//   4. Replace PayPalPlaceholder with actual <PayPalButtons> component
//
// ─── APPLE PAY / GOOGLE PAY ──────────────────────────────────────
//   Handled automatically by Stripe Payment Request Button (no extra setup).
//   Stripe detects device + browser and shows the appropriate button.
//   Requires HTTPS in production. Works in Stripe test mode on localhost.
// ─────────────────────────────────────────────────────────────────

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? null
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? null

// 'simulated' shows a test UI with no real charge.
// Set VITE_PAYMENT_MODE=live to enable real payment providers.
export const PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE ?? 'simulated'

export const isLive = PAYMENT_MODE === 'live'
export const stripeEnabled = isLive && !!STRIPE_PUBLISHABLE_KEY
export const paypalEnabled = isLive && !!PAYPAL_CLIENT_ID
