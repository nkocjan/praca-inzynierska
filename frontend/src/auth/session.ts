const TOKEN_KEY = "jwtToken";

interface TokenPayload {
  sub?: string;
  userId?: string;
  exp?: number;
}

// Reads the JWT payload without verifying it: only used to know who is logged in on the client.
export const getTokenPayload = (): TokenPayload | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as TokenPayload;
  } catch {
    return null;
  }
};

export const clearSession = () => localStorage.removeItem(TOKEN_KEY);
