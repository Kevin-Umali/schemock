// src/components/template-editor.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import TypeSelectorCommand from '@/components/custom/type-selector-command'
import { FakerMethodCategory } from '@/types/tree'

interface TemplateEditorProps {
  fakerMethods: FakerMethodCategory[]
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ fakerMethods }) => {
  const [text, setText] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart || 0
    setText(value)
    setCursorPosition(cursorPos)

    const textBeforeCursor = value.slice(0, cursorPos)
    const lines = textBeforeCursor.split('\n')
    const currentLine = lines[lines.length - 1]
    const words = currentLine.split(' ')
    const currentWord = words[words.length - 1]

    if (currentWord === '/') {
      setShowMenu(true)
      updateMenuPosition(cursorPos)
    } else if (!currentWord.startsWith('/')) {
      setShowMenu(false)
    }
  }

  const updateMenuPosition = (cursorPos: number) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const { top: textareaTop, left: textareaLeft } = textarea.getBoundingClientRect()

    const textBeforeCursor = textarea.value.substring(0, cursorPos)
    const lines = textBeforeCursor.split('\n')
    const currentLineNumber = lines.length
    const currentLineText = lines[lines.length - 1]

    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20
    const charWidth = 8

    const top = textareaTop + currentLineNumber * lineHeight - textarea.scrollTop + 20 // Added offset
    const left = textareaLeft + currentLineText.length * charWidth - textarea.scrollLeft

    setMenuPosition({ top, left })
  }

  const handleSelectType = (selectedType: string) => {
    if (textareaRef.current) {
      const beforeCursor = text.slice(0, cursorPosition - 1)
      const afterCursor = text.slice(cursorPosition)
      const newText = `${beforeCursor}{{${selectedType}}}${afterCursor}`

      setText(newText)
      setShowMenu(false)

      // Restore focus and move cursor after the inserted text
      textareaRef.current.focus()
      const newCursorPosition = beforeCursor.length + selectedType.length + 4
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      setCursorPosition(newCursorPosition)
    }
  }

  const handleCloseMenu = () => {
    setShowMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is inside the menu or textarea
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        handleCloseMenu()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className='relative w-full max-w-2xl mx-auto'>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder='Type / to insert a faker method...'
        className='w-full min-h-[200px] p-4 font-mono text-sm resize-none'
      />

      {showMenu && (
        <div ref={menuRef}>
          <TypeSelectorCommand onSelect={handleSelectType} baseTypes={[]} fakerMethods={fakerMethods} position={menuPosition} onClose={handleCloseMenu} />
        </div>
      )}
    </div>
  )
}

export default TemplateEditor
