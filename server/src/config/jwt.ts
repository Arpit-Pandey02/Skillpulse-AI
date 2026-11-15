const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';
const PLACEHOLDER_SECRET = 'replace_with_a_long_random_secret';

let hasWarned = false;

/**
 * Single source of truth for the JWT signing/verification secret.
 *
 * The secret is read at call time (not at import time), so it always sees the
 * values loaded from server/.env, regardless of module load order.
 * Signing (authRoutes) and verifying (authMiddleware) both use this function,
 * so they can never disagree.
 *
 * - Production: JWT_SECRET is mandatory and must not be the placeholder value.
 * - Development: falls back to an insecure dev secret and prints a warning.
 */
export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!secret || secret === PLACEHOLDER_SECRET) {
      throw new Error(
        'JWT_SECRET must be set to a long random value when NODE_ENV=production.'
      );
    }
    return secret;
  }

  if (secret) return secret;

  if (!hasWarned) {
    console.warn(
      '[Auth] JWT_SECRET is not set. Using an insecure development fallback. Set JWT_SECRET in server/.env.'
    );
    hasWarned = true;
  }
  return DEV_FALLBACK_SECRET;
};
