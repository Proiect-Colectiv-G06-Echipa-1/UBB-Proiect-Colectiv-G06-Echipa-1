import { jwtDecode } from "jwt-decode";
import { UserDTORoleEnum } from "../../typescript-client";

interface JwtPayload {
  sub: string;
  userId: number;
  role: UserDTORoleEnum;
  exp?: number;
  iat?: number;
}

interface TokenData {
  username: string;
  userId: number;
  role: UserDTORoleEnum;
  expired: boolean;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (err) {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return false;
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
}

export function getTokenData(): TokenData | null {
  const token = localStorage.getItem("jwt");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.sub || !decoded.role) return null;
  
  const expired = isTokenExpired(decoded.exp);
  if (expired) {
    localStorage.removeItem("jwt");
    return null;
  }
  
  return {
    username: decoded.sub,
    userId: decoded.userId,
    role: decoded.role,
    expired: false
  };
}

export function getUsernameFromToken(): string | null {
  const tokenData = getTokenData();
  return tokenData ? tokenData.username : null;
}

export function getUserIdFromToken(): number | null { 
  const tokenData = getTokenData();
  return tokenData ? tokenData.userId : null;
}

export function getRoleFromToken(): UserDTORoleEnum | null {
  const tokenData = getTokenData();
  return tokenData ? tokenData.role : null;
}