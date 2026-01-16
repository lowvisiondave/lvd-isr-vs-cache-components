/**
 * Promise-based delay helper for simulating async operations
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a value with a simulated delay
 * Useful for mocking slow API responses
 */
export async function withDelay<T>(value: T, ms: number): Promise<T> {
  await delay(ms);
  return value;
}
