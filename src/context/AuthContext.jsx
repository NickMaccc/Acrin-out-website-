import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ao_user')) } catch { return null }
  })

  const [reward, setReward] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ao_reward')) } catch { return null }
  })

  // 'gate' = show landing, 'spin' = show spin wheel, 'app' = browsing
  const [appPhase, setAppPhase] = useState(() => {
    if (sessionStorage.getItem('ao_user')) return 'app'
    if (sessionStorage.getItem('ao_browsing')) return 'app'
    return 'gate'
  })

  const signIn = async (email, _password) => {
    // TODO: Replace with real API call → POST /api/auth/login
    // e.g. const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email, password: _password}) })
    await new Promise((r) => setTimeout(r, 900))
    const u = { email, name: email.split('@')[0] }
    setUser(u)
    sessionStorage.setItem('ao_user', JSON.stringify(u))
    setAppPhase('app')
    return u
  }

  const signUp = async (email, _password) => {
    // TODO: Replace with real API call → POST /api/auth/register
    // e.g. const res = await fetch('/api/auth/register', { method:'POST', body: JSON.stringify({email, password: _password}) })
    await new Promise((r) => setTimeout(r, 1100))
    const u = { email, name: email.split('@')[0], isNew: true }
    setUser(u)
    sessionStorage.setItem('ao_user', JSON.stringify(u))
    setAppPhase('spin') // new users get the spin wheel
    return u
  }

  const signOut = () => {
    setUser(null)
    setReward(null)
    setAppPhase('gate')
    sessionStorage.removeItem('ao_user')
    sessionStorage.removeItem('ao_reward')
    sessionStorage.removeItem('ao_browsing')
  }

  const skipGate = () => {
    sessionStorage.setItem('ao_browsing', '1')
    setAppPhase('app')
  }

  // Opens the auth screen from within the app (e.g. navbar Log In button)
  const openAuth = () => setAppPhase('gate')

  const completeSpin = (wonReward) => {
    setReward(wonReward)
    if (wonReward) sessionStorage.setItem('ao_reward', JSON.stringify(wonReward))
    setAppPhase('app')
  }

  return (
    <AuthContext.Provider value={{ user, reward, appPhase, signIn, signUp, signOut, skipGate, openAuth, completeSpin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
