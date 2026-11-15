/**
 * Returns a copy of a user object that is safe to send to the client.
 * Always use this before putting a user into an API response so that the
 * password hash can never leak.
 */
export const toPublicUser = <T extends { passwordHash?: unknown }>(
  user: T
): Omit<T, 'passwordHash'> => {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
};
