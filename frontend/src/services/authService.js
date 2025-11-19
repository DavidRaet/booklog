const API_BASE_URL = "http://localhost:3002/api"

export const authService = {
  // TODO: Implement signup
  signup: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
    if (!response.ok) {
      throw new Error("Failed to sign up user")
    }
    return response.json()
  },

  // TODO: Implement login
  login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      throw new Error("Failed to login user")
    }
    return response.json()
  },

  // BONUS: Implement token verification
  verifyToken: async (token) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, { 
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" }
    })
    if (!response.ok) {
      throw new Error("Failed to login user")
    }
    return response.json()
  }
}