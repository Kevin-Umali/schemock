import { MOCK_LIMITS } from '../../shared/constants/mock'

export const decodeMockToken = async (token: string): Promise<Buffer> => {
  if (token.length > MOCK_LIMITS.encodedCharacters) throw new Error('Encoded mock definition exceeds the size limit.')
  if (!token || !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('Invalid mock definition.')
  const bytes = Buffer.from(token, 'base64url')
  if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    throw new Error('Mock definition must use gzip compression.')
  }
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.length
      if (total > MOCK_LIMITS.decodedBytes) throw new Error('Decoded mock definition exceeds the size limit.')
      chunks.push(value)
    }
  } finally {
    await reader.cancel().catch(() => undefined)
  }
  return Buffer.concat(
    chunks.map((chunk) => Buffer.from(chunk)),
    total,
  )
}
