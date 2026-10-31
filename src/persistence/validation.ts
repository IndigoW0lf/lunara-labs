import { LAB_VERSION } from '../domain/data.mjs';

// JSON parsing establishes syntax, not the shape of a saved attempt.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function oneOf<T extends string | number>(
  value: unknown,
  choices: readonly T[],
): value is T {
  return choices.some((choice) => choice === value);
}

export function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function nonNegative(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function integer(value: unknown, minimum: number, maximum: number): value is number {
  return (
    typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum
  );
}

export function step(value: unknown): number {
  return integer(value, 0, 4) ? value : 0;
}

export function version(value: unknown, fallback: string): string {
  return oneOf(value, ['0.1.0', '0.2.0', LAB_VERSION]) ? value : fallback;
}
