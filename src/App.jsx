import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Apparel from './pages/Apparel'
import CategoryPage from './pages/CategoryPage'
import About from './pages/About'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Landing from './pages/Landing'
import SpinWheel from './components/SpinWheel'

export default function App() {
  const location = useLocation()
  const { appPhase, reward } = useAuth()

  // Gate phase — show Landing
  if (appPhase === 'gate') {
    return (
      <>
        <Cursor />
        <Landing />
      </>
    )
  }

  // Spin phase — show spin wheel full-screen
  if (appPhase === 'spin') {
    return (
      <>
        <Cursor />
        <SpinWheel />
      </>
    )
  }

  // App phase — normal browsing
  return (
    <>
      <Cursor />
      {/* Reward banner — shown after spin if user won a discount */}
      <AnimatePresence>
        {reward && <RewardBanner reward={reward} />}
      </AnimatePresence>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/apparel/tshirts" element={<CategoryPage category="tshirts" />} />
          <Route path="/apparel/hoodies" element={<CategoryPage category="hoodies" />} />
          <Route path="/apparel/accessories" element={<CategoryPage category="accessories" />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </AnimatePresence>
      <ChatWidget />
    </>
  )
}

function RewardBanner({ reward }) {
  const { completeSpin } = useAuth()

  if (!reward || reward.label === 'No Discount') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
        background: 'linear-gradient(90deg, rgba(123,0,255,0.95), rgba(255,0,110,0.95))',
        backdropFilter: 'blur(8px)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <span style={{ fontSize: '0.9rem' }}>🎰</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#fff',
      }}>
        Your reward: <strong>{reward.label}</strong>
        {reward.code && (
          <> — code <strong style={{ background: 'rgba(0,0,0,0.25)', padding: '2px 7px', borderRadius: 3 }}>{reward.code}</strong></>
        )}
      </span>
      {/* TODO: Apply discount code to cart totals when backend is wired */}
      <button
        onClick={() => completeSpin(null)}
        style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.6)', fontSize: '1rem',
          cursor: 'pointer', marginLeft: 8, lineHeight: 1,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#fff'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
        aria-label="Dismiss reward banner"
      >
        ×
      </button>
    </motion.div>
  )
}
