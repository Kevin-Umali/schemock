// src/components/custom/animated-json.tsx
import React, { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

interface AnimatedJSONProps {
  data: unknown
  animate?: 'characters' | 'lines' | 'simple'
  className?: string
}

const AnimatedJSON: React.FC<AnimatedJSONProps> = ({ data, animate = 'lines', className }) => {
  const controls = useAnimationControls()
  const formattedJSON = JSON.stringify(data, null, 2)

  useEffect(() => {
    if (data) {
      controls.start('visible')
    }
  }, [data, controls])

  if (animate === 'characters') {
    const characters = formattedJSON.split('')

    return (
      <pre className={className}>
        <motion.code
          className='text-sm inline-block'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.005,
                duration: 0.5,
              },
            },
          }}
          initial='hidden'
          animate={controls}
        >
          {characters.map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.code>
      </pre>
    )
  }

  if (animate === 'lines') {
    const lines = formattedJSON.split('\n')

    return (
      <pre className={className}>
        <motion.code
          className='text-sm block'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                duration: 0.5,
              },
            },
          }}
          initial='hidden'
          animate={controls}
        >
          {lines.map((line, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.3,
                  },
                },
              }}
              className='block'
            >
              {line}
            </motion.span>
          ))}
        </motion.code>
      </pre>
    )
  }

  // Simple animation
  return (
    <motion.pre
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      }}
    >
      <motion.code
        className='text-sm block'
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.4,
            delay: 0.3,
          },
        }}
      >
        {formattedJSON}
      </motion.code>
    </motion.pre>
  )
}

AnimatedJSON.displayName = 'AnimatedJSON'

export default AnimatedJSON
