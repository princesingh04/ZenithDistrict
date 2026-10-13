import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'zd_admin_session';
const DEFAULT_PASSWORD = 'zenithdistrict';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;
}

function getSecretKey(): string {
  return process.env.ADMIN_SECRET?.trim() || getAdminPassword() + '-zd-salt-2026';
}

/**
 * Validates provided plaintext password against environment secret.
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const adminPassword = getAdminPassword();
  return inputPassword.trim() === adminPassword;
}

/**
 * Generates a signed token for authenticated admin sessions.
 */
export function createAdminSessionToken(): string {
  const secret = getSecretKey();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Verifies the validity and expiration (7 days) of an admin session token.
 */
export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max session age: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) return false;

  const secret = getSecretKey();
  const expectedSignature = crypto.createHmac('sha256', secret).update(timestampStr).digest('hex');

  // Constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Checks if the current request has an active valid admin session.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return verifyAdminSessionToken(sessionCookie?.value);
}

export { ADMIN_COOKIE_NAME };
