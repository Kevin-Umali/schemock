export type CopiedValue = string | null
export type CopyFn = (text: string) => Promise<boolean>
export type CopyReturn = [CopiedValue, CopyFn]
/**
 * A hook that allows to copy text to clipboard.
 * @returns {CopyReturn} An array of two elements:
 * 1. The current value of the copied text.
 * 2. A function to copy text to clipboard.
 */
