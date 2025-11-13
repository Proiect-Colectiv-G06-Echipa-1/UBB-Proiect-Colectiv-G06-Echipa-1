import { jwtDecode } from "jwt-decode";

interface IJwtPayload {
  sub: string;
  exp?: number;
  iat?: number;
}

interface ITokenData {
  username: string;
  expired: boolean;
}

function decodeToken(token: string): IJwtPayload | null {
  try {
    return jwtDecode<IJwtPayload>(token);
  } catch (err) {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return false;
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
}

export function getTokenData(): ITokenData | null {
  const token = localStorage.getItem("jwt");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.sub) return null;
  
  const expired = isTokenExpired(decoded.exp);
  if (expired) {
    localStorage.removeItem("jwt");
    return null;
  }
  
  return {
    username: decoded.sub,
    expired: false
  };
}

export function getSubFromToken(): string | null {
  const tokenData = getTokenData();
  return tokenData ? tokenData.username : null;
}
