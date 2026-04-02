const TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
const CLIENT_ID = process.env.OPENSKY_CLIENT_ID || "your_client_id"
const CLIENT_SECRET = process.env.OPENSKY_CLIENT_SECRET || "your_client_secret"

// How many seconds before expiry to proactively refresh the token.
const TOKEN_REFRESH_MARGIN = 30

interface TokenResponse {
  access_token: string
  expires_in?: number
  token_type?: string
}

class TokenManager {
  private token: string | null = null
  private expiresAt: Date | null = null

  /**
   * Return a valid access token, refreshing automatically if needed.
   */
  async getToken(): Promise<string> {
    if (this.token && this.expiresAt && new Date() < this.expiresAt) {
      return this.token
    }
    return this._refresh()
  }

  /**
   * Fetch a new access token from the OpenSky authentication server.
   */
  private async _refresh(): Promise<string> {
    try {
      console.log("Refreshing token from OpenSky...")
      console.log("CLIENT_ID:", CLIENT_ID)
      console.log("CLIENT_SECRET:", CLIENT_SECRET ? "***" : "NOT SET")

      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
        // 添加超时设置
        signal: AbortSignal.timeout(10000), // 10秒超时
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Token refresh failed:", response.status, response.statusText, errorText)
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const data: TokenResponse = await response.json()
      this.token = data.access_token
      const expiresIn = data.expires_in || 1800
      this.expiresAt = new Date(
        Date.now() + (expiresIn - TOKEN_REFRESH_MARGIN) * 1000
      )

      console.log("Token refreshed successfully, expires at:", this.expiresAt)
      return this.token
    } catch (error) {
      console.error("Error refreshing token:", error)
      if (error instanceof Error) {
        throw new Error(`Failed to refresh token: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Return request headers with a valid Bearer token.
   */
  async getHeaders(): Promise<{ Authorization: string }> {
    return { Authorization: `Bearer ${await this.getToken()}` }
  }
}

// Create a single shared instance for your script.
export const tokens = new TokenManager()

export default tokens
