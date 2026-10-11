export interface MockTestRequest {
  url: string
  method: string
  path: string
  body: string
  headers: Record<string, string>
}

export interface MockTestResult {
  method: string
  path: string
  status: number
  duration: number
  body: string
  headers: Record<string, string>
}
