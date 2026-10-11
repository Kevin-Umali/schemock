export const MOCK_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const
export const MOCK_LIMITS = {
  encodedCharacters: 6144,
  decodedBytes: 65536,
  entries: 20,
  scenarios: 10,
  conditions: 20,
  delayMs: 5000,
} as const
