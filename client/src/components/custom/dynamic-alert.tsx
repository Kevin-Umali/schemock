// src/components/custom/dynamic-alert.tsx

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type AlertType = 'info' | 'success' | 'warning' | 'error'
type AnimationType = 'pulse' | 'glow' | 'bounce' | 'none'

interface DynamicAlertProps {
  type?: AlertType
  title: string
  description?: string
  className?: string
  show?: boolean
  closable?: boolean
  onClose?: () => void
  variant?: 'default' | 'colored'
  animation?: AnimationType
}

const alertStyles: Record<
  AlertType,
  {
    icon: React.ReactNode
    className: {
      default: string
      colored: string
    }
  }
> = {
  info: {
    icon: <Info className='h-4 w-4' />,
    className: {
      default: 'border-blue-200 [&>svg]:text-blue-500',
      colored: 'bg-blue-50 border-blue-200 [&>svg]:text-blue-500',
    },
  },
  success: {
    icon: <CheckCircle2 className='h-4 w-4' />,
    className: {
      default: 'border-green-200 [&>svg]:text-green-500',
      colored: 'bg-green-50 border-green-200 [&>svg]:text-green-500',
    },
  },
  warning: {
    icon: <AlertCircle className='h-4 w-4' />,
    className: {
      default: 'border-yellow-200 [&>svg]:text-yellow-500',
      colored: 'bg-yellow-50 border-yellow-200 [&>svg]:text-yellow-500',
    },
  },
  error: {
    icon: <XCircle className='h-4 w-4' />,
    className: {
      default: 'border-red-200 [&>svg]:text-red-500',
      colored: 'bg-red-50 border-red-200 [&>svg]:text-red-500',
    },
  },
}

const animationVariants = {
  pulse: {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.3 },
        y: { duration: 0.3 },
      },
    },
  },
  glow: {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.3 },
        y: { duration: 0.3 },
      },
    },
  },
  bounce: {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: [0, -5, 0],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        opacity: {
          duration: 0.3,
        },
      },
    },
  },
  none: {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  },
}

const pulseVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const DynamicAlert: React.FC<DynamicAlertProps> = ({
  type = 'info',
  title,
  description,
  className,
  show: showProp = true,
  closable = true,
  onClose,
  variant = 'default',
  animation = 'none',
}) => {
  const [showInternal, setShowInternal] = useState(true)
  const show = closable ? showInternal && showProp : showProp

  const { icon, className: alertClassName } = alertStyles[type]
  const currentAnimation = animationVariants[animation]

  const getBorderColorVar = () => {
    switch (type) {
      case 'info':
        return '59, 130, 246' // blue-500
      case 'success':
        return '34, 197, 94' // green-500
      case 'warning':
        return '234, 179, 8' // yellow-500
      case 'error':
        return '239, 68, 68' // red-500
      default:
        return '59, 130, 246' // default blue
    }
  }

  const handleClose = () => {
    setShowInternal(false)
    onClose?.()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={currentAnimation.initial}
          animate={currentAnimation.animate}
          exit={{ opacity: 0, y: -10 }}
          className='relative'
          style={{ '--border-color': getBorderColorVar() } as React.CSSProperties}
        >
          {animation === 'glow' && (
            <motion.div
              className='absolute inset-0'
              animate={{
                boxShadow: [
                  '0 0 0px 0px rgba(var(--border-color), 0)',
                  '0 0 8px 4px rgba(var(--border-color), 0.3)',
                  '0 0 0px 0px rgba(var(--border-color), 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                borderRadius: '8px',
                position: 'absolute',
                inset: '-1px',
                pointerEvents: 'none',
              }}
            />
          )}

          <motion.div
            variants={animation === 'pulse' ? pulseVariants : undefined}
            initial={animation === 'pulse' ? 'initial' : undefined}
            animate={animation === 'pulse' ? 'animate' : undefined}
          >
            <Alert className={cn('relative w-full px-4 py-3 border rounded-lg', alertClassName[variant], className)}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div
                    className={cn('mr-2 flex-shrink-0', {
                      'text-blue-500': type === 'info',
                      'text-green-500': type === 'success',
                      'text-yellow-500': type === 'warning',
                      'text-red-500': type === 'error',
                    })}
                  >
                    {icon}
                  </div>
                  <AlertTitle className='font-medium text-sm'>{title}</AlertTitle>
                </div>

                {closable && (
                  <Button variant='ghost' size='sm' className='h-6 w-6 p-0 hover:bg-background/80' onClick={handleClose}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>

              {description && (
                <div className='pl-6 mt-1'>
                  <AlertDescription className='text-sm text-muted-foreground'>{description}</AlertDescription>
                </div>
              )}
            </Alert>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

DynamicAlert.displayName = 'DynamicAlert'

export default DynamicAlert
