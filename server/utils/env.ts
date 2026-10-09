export const positiveInteger = (value: string | undefined, fallback: number): number => {
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? number : fallback
}
