/**
 * Authentication Service
 * 
 * Handles all API calls related to user authentication.
 * Uses centralized API configuration from config/api.js for consistency.
 * 
 * WHY CENTRALIZED CONFIG:
 * - Single source of truth for API base URL
 * - Easy environment switching (dev/staging/prod)
 * - DRY principle - change URL in one place
 */
import apiConfig from '../config/api.js';

const { apiBaseUrl, headers } = apiConfig;

export const authService = {

  signup: async (username, email, password) => {
    const response = await fetch(`${apiBaseUrl}/auth/signup`, { 
        method: "POST",
        headers,
        body: JSON.stringify({ username, email, password })
    })
    if (!response.ok) {
      throw new Error("Failed to sign up user")
    }
    return response.json()
  },

  login: async (email, password) => {
        const response = await fetch(`${apiBaseUrl}/auth/login`, { 
        method: "POST",
        headers,
        body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      throw new Error("Failed to login user")
    }
    return response.json()
  },

  verifyToken: async (token) => {
        const response = await fetch(`${apiBaseUrl}/auth/verify`, { 
        method: "GET",
        headers: { 
          ...headers,
          "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
      throw new Error("Failed to verify token")
    }
    return response.json()
  }
}