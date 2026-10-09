export interface FakerMethodItem {
  method: string
  description: string
  parameters: string
  example: string
}
export interface FakerMethodCategory {
  category: string
  description: string
  items: FakerMethodItem[]
}
