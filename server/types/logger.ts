export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export interface LoggerConfig {
  level?: LogLevel
  excludePaths?: string[]
  enabled?: boolean
  mode?: 'pretty' | 'json'
}
