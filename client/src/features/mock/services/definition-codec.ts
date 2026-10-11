import { MOCK_LIMITS } from '../constants/definition'
import type { MockDefinition } from '../types/definition'
import { validateMockDefinition } from '../../../../../shared/utils/mock-definition'

export const encodeMockDefinition = async (definition: MockDefinition): Promise<string> => {
  validateMockDefinition(definition)
  const bytes = new TextEncoder().encode(JSON.stringify(definition))
  if (bytes.length > MOCK_LIMITS.decodedBytes)
    throw new Error('This mock is too large. Keep its definition under 64 KiB.')
  const compressed = new Uint8Array(
    await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer(),
  )
  const token = btoa(Array.from(compressed, (byte) => String.fromCharCode(byte)).join(''))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
  if (token.length > MOCK_LIMITS.encodedCharacters)
    throw new Error('This mock link is too long. Reduce endpoints, scenarios, or response bodies to stay under 6 KiB.')
  return token
}

export const decodeMockDefinition = async (token: string): Promise<MockDefinition> => {
  if (!token || token.length > MOCK_LIMITS.encodedCharacters || !/^[A-Za-z0-9_-]+$/.test(token))
    throw new Error('This mock link is invalid or too long.')
  try {
    const bytes = Uint8Array.from(atob(token.replaceAll('-', '+').replaceAll('_', '/')), (character) =>
      character.charCodeAt(0),
    )
    const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader()
    const chunks: Uint8Array[] = []
    let length = 0
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        length += value.length
        if (length > MOCK_LIMITS.decodedBytes) throw new Error('This mock expands beyond the 64 KiB definition limit.')
        chunks.push(value)
      }
    } finally {
      await reader.cancel().catch(() => undefined)
    }
    const decoded = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) {
      decoded.set(chunk, offset)
      offset += chunk.length
    }
    return validateMockDefinition(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(decoded)))
  } catch (error) {
    throw new Error(
      `Could not read this mock link. ${error instanceof Error ? error.message : 'Check the link and try again.'}`,
      { cause: error },
    )
  }
}
