const TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
const CLIENT_ID = process.env.OPENSKY_CLIENT_ID || "your_client_id"
const CLIENT_SECRET = process.env.OPENSKY_CLIENT_SECRET || "your_client_secret"

// How many seconds before expiry to proactively refresh the token.
const TOKEN_REFRESH_MARGIN = 30
const TOKEN_FETCH_TIMEOUT = 30000 // 30s
const TOKEN_RETRY_TIMES = 3 // 最多重试次数
const TOKEN_RETRY_DELAY = 2000 // 重试间隔 ms

interface TokenResponse {
  access_token: string
  expires_in?: number
  token_type?: string
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
    return this._refreshWithRetry()
  }

  /**
   * Retry wrapper around _refresh().
   */
  private async _refreshWithRetry(): Promise<string> {
    let lastError: unknown
    for (let attempt = 1; attempt <= TOKEN_RETRY_TIMES; attempt++) {
      try {
        return await this._refresh(attempt)
      } catch (error) {
        lastError = error
        console.warn(`Token refresh attempt ${attempt}/${TOKEN_RETRY_TIMES} failed:`, error)
        if (attempt < TOKEN_RETRY_TIMES) {
          await sleep(TOKEN_RETRY_DELAY * attempt)
        }
      }
    }
    throw lastError
  }

  /**
   * Fetch a new access token from the OpenSky authentication server.
   */
  private async _refresh(attempt = 1): Promise<string> {
    console.log(`[OpenSky] Refreshing token (attempt ${attempt})...`)
    console.log("[OpenSky] CLIENT_ID:", CLIENT_ID)
    console.log("[OpenSky] CLIENT_SECRET:", CLIENT_SECRET ? "***" : "NOT SET")
    console.log("[OpenSky] TOKEN_URL:", TOKEN_URL)

    let response: Response
    try {
      response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
        signal: AbortSignal.timeout(TOKEN_FETCH_TIMEOUT),
      })
    } catch (fetchError) {
      // 网络层错误（DNS 失败、连接拒绝、超时等）
      const msg = fetchError instanceof Error ? fetchError.message : String(fetchError)
      console.error(`[OpenSky] Network error during token fetch: ${msg}`)
      throw new Error(`Failed to refresh token: ${msg}`)
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "(unreadable)")
      console.error(
        `[OpenSky] Token refresh HTTP error: ${response.status} ${response.statusText}`,
        errorText
      )
      throw new Error(
        `Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const data: TokenResponse = await response.json()
    this.token = data.access_token
    const expiresIn = data.expires_in || 1800
    this.expiresAt = new Date(Date.now() + (expiresIn - TOKEN_REFRESH_MARGIN) * 1000)

    console.log("[OpenSky] Token refreshed successfully, expires at:", this.expiresAt)
    return this.token
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
