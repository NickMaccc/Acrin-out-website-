import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  enter: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0, y: -16, filter: 'blur(4px)',
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}
