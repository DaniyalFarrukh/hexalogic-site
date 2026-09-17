// Structured global error logger
// In the future, this can be hooked into Sentry by checking process.env.NEXT_PUBLIC_SENTRY_DSN

type LogLevel = 'info' | 'warn' | 'error'

interface LogPayload {
  message: string
  context?: Record<string, unknown>
  error?: Error | unknown
}

export const logger = {
  log: (level: LogLevel, payload: LogPayload) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: payload.message,
      context: payload.context,
      error: payload.error instanceof Error ? {
        name: payload.error.name,
        message: payload.error.message,
        stack: payload.error.stack
      } : payload.error
    }

    // Format output as structured JSON for easy parsing by external log aggregators (e.g. Datadog, AWS CloudWatch)
    const formatted = JSON.stringify(logEntry)

    switch (level) {
      case 'info':
        console.log(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted)
        break
    }
  },
  
  info: (message: string, context?: Record<string, unknown>) => 
    logger.log('info', { message, context }),
    
  warn: (message: string, context?: Record<string, unknown>, error?: unknown) => 
    logger.log('warn', { message, context, error }),
    
  error: (message: string, error: unknown, context?: Record<string, unknown>) => 
    logger.log('error', { message, context, error })
}
