// src/components/custom/generated-data.tsx

import { cn } from '@/lib/utils'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '../ui/button'
import AnimatedJSON from './animated-json'
import Spinner from './spinner'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import DynamicAlert from './dynamic-alert'

interface GeneratedDataProps {
  generatedData: unknown
  generationError?: Error | null
  isGenerating: boolean
}

const GeneratedData: React.FC<GeneratedDataProps> = ({ generatedData, isGenerating, generationError }) => {
  const [copiedText, copy] = useCopyToClipboard()

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className='flex items-center justify-center gap-2 p-20'>
          <Spinner show text='Generating JSON...' />
        </div>
      )
    }

    if (generatedData) {
      return (
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-card-foreground'>Generated Result</h3>
            <div className='flex gap-2'>
              {/* Copy Button */}
              <Button
                variant='outline'
                size='sm'
                onClick={async () => {
                  await copy(JSON.stringify(generatedData, null, 2))
                }}
                className='flex items-center gap-2 relative w-24 justify-center'
              >
                <div className={cn('flex items-center gap-2', copiedText && 'text-emerald-500')}>
                  {copiedText ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                  <span className='text-sm'>{copiedText ? 'Copied!' : 'Copy'}</span>
                </div>
              </Button>

              {/* Download Button */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = 'generated-schema.json'
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className='flex items-center gap-2'
              >
                <Download className='mr-1 h-4 w-4' />
                <span className='text-sm'>Download</span>
              </Button>
            </div>
          </div>

          {/* Display Generated JSON */}
          <AnimatedJSON data={generatedData} animate='characters' className='rounded-md p-4 bg-input text-foreground overflow-auto' />
        </div>
      )
    }

    if (generationError) {
      return <DynamicAlert type='error' title='Error' description={generationError.message} className='mb-20' />
    }

    return (
      <p className='text-muted-foreground text-center p-20'>
        Build your schema and click the <code>Generate JSON</code> button to see the result.
      </p>
    )
  }

  return <div className='mt-6 border rounded-lg p-4 shadow-sm bg-card'>{renderContent()}</div>
}

GeneratedData.displayName = 'GeneratedData'

export default GeneratedData
