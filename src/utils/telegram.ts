let cachedToken: string | null = null;
let lastTokenTimestamp: number | null = null;

// Token expiration in milliseconds (5 minutes)
const TOKEN_EXPIRATION = 5 * 60 * 1000;

export async function getValidToken(): Promise<string> {
  const currentTime = Date.now();

  // Return cached token if it's still valid
  if (cachedToken && lastTokenTimestamp && (currentTime - lastTokenTimestamp) < TOKEN_EXPIRATION) {
    return cachedToken;
  }

  // Request new token
  const webApp = (window as any).Telegram?.WebApp;
  if (!webApp) {
    throw new Error('Telegram WebApp is not available');
  }

  // Update cache
  cachedToken = webApp.initData;
  lastTokenTimestamp = currentTime;

  return cachedToken;
}