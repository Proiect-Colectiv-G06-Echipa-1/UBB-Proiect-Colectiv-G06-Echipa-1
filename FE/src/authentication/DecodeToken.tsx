/**
 * @file DecodeToken.tsx
 * @brief Utilities for decoding and extracting information from JWT tokens.
 */
import { jwtDecode } from "jwt-decode";
import { UserDTORoleEnum } from "../../typescript-client";

/**
 * @interface JwtPayload
 * @brief Structure of the JWT payload used in the application.
 */
interface JwtPayload {
  sub: string; ///< Subject (usually username).
  userId: number; ///< Unique identifier for the user.
  role: UserDTORoleEnum; ///< User role (e.g., Admin, User).
  exp?: number; ///< Expiration time (seconds since epoch).
  iat?: number; ///< Issued at time (seconds since epoch).
}

/**
 * @interface TokenData
 * @brief Extracted and validated data from a JWT.
 */
interface TokenData {
  username: string;
  userId: number;
  role: UserDTORoleEnum;
  expired: boolean;
}

/**
 * @brief Decodes a JWT token.
 * @param token The JWT string to decode.
 * @return The decoded payload or null if decoding fails.
 */
function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (err) {
    return null;
  }
}

/**
 * @brief Checks if a token is expired.
 * @param exp Expiration time in seconds since epoch.
 * @return True if expired, false otherwise.
 */
function isTokenExpired(exp?: number): boolean {
  if (!exp) return false;
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
}

/**
 * @brief Retrieves and validates token data from localStorage.
 * @return Token data if valid and not expired, otherwise null.
 */
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

/**
 * @brief Extracts the username from the current token.
 * @return The username or null.
 */
export function getUsernameFromToken(): string | null {
  const tokenData = getTokenData();
  return tokenData ? tokenData.username : null;
}

/**
 * @brief Extracts the user ID from the current token.
 * @return The user ID or null.
 */
export function getUserIdFromToken(): number | null { 
  const tokenData = getTokenData();
  return tokenData ? tokenData.userId : null;
}

/**
 * @brief Extracts the user role from the current token.
 * @return The user role or null.
 */
export function getRoleFromToken(): UserDTORoleEnum | null {
  const tokenData = getTokenData();
  return tokenData ? tokenData.role : null;
}