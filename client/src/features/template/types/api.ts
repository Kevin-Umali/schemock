export interface TemplateRequest {
  template: string
  count: number
  locale: string
  headers?: Record<string, string>
}
