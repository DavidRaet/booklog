import { createContext, useState, useEffect } from 'react'

// Step 1: Create the context
export const AuthContext = createContext()

// Step 2: Create the provider component
export function AuthProvider({ children }) {
  // TODO: Create state for 'user' (object with id, username, email)
  const [user, setUser] = useState(null)
  // TODO: Create state for 'token' (string)
  const [token, setToken] = useState(null)
  // TODO: Create state for 'loading' (boolean - true during initial token check)
  const [loading, setLoading] = useState(true)


  // Step 3: On component mount, check if token exists in localStorage
  useEffect(() => {
    // TODO: Get token from localStorage
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    // TODO: If token exists, decode it to get user info (or fetch user from backend)
    // TODO: Set user and token state
    // Decoding token returns the payload of the user-id and other formal key's of a jwt payload, what i mainly want to figure out is, will i have to get the user from the id first and then set the user state from that?
    if(token && user) {
      setUser(JSON.parse(user))
      setToken(token)
    }

    setLoading(false)
  }, [])

  // Step 4: Login function
  const login = (token, userData) => {
    // TODO: Save token to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    // TODO: Update token state
    setToken(token)
    // TODO: Update user state
    setUser(userData)
  }

  // Step 5: Logout function
  const logout = () => {
    // TODO: Remove token from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // TODO: Clear token state (set to null)
    setToken(null)
    // TODO: Clear user state (set to null)
    setUser(null)
  }

  // Step 6: Computed value - is user authenticated?
  const isAuthenticated = Boolean(token) // TODO: Return true if token exists, false otherwise

  // Step 7: Provide values to children
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}