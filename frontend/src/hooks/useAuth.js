import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  // TODO: Get context value using useContext
  // TODO: Throw error if used outside AuthProvider
  const context = useContext(AuthContext)
  if (!context){
    throw new Error("AuthContext was used outside of AuthProvider")
  }
  // TODO: Return context value
  return context 
}