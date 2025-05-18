import React, { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FakerMethodCategory } from '@/types/tree'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough as StrikeIcon,
  Code as CodeIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Slash,
} from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface TipTapEditorProps {
  onChange: (content: string) => void
  initialContent?: string
  fakerMethods: FakerMethodCategory[]
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onChange, initialContent = '', fakerMethods }) => {
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const slashMenuRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Code,
      CodeBlock,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HardBreak,
      History,
      Placeholder.configure({
        placeholder: 'Type / to insert a faker method...',
      }),
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        hardBreak: false,
        history: false,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getText())
    },
  })

  // Handle keyboard events separately
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        // Get current cursor position
        const { view } = editor
        const { state } = view
        const { selection } = state
        const { ranges } = selection
        const from = Math.min(...ranges.map((range: any) => range.$from.pos))
        const to = Math.max(...ranges.map((range: any) => range.$to.pos))

        // Get coordinates of cursor
        const start = view.coordsAtPos(from)
        const end = view.coordsAtPos(to)

        setSlashMenuPosition({
          x: start.left,
          y: end.bottom,
        })
        setShowSlashMenu(true)
        setSearchTerm('')
        event.preventDefault()
      } else if (event.key === 'Escape' && showSlashMenu) {
        setShowSlashMenu(false)
        event.preventDefault()
      }
    }

    // Add event listener to the editor DOM element
    const editorElement = editor.view.dom
    editorElement.addEventListener('keydown', handleKeyDown)

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, showSlashMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const insertFakerMethod = (method: string) => {
    if (editor) {
      editor.commands.insertContent(`{{${method}}}`)
      setShowSlashMenu(false)
    }
  }

  // We'll use the filtering directly in the JSX instead of storing in a variable
  // to avoid the unused variable warning

  if (!editor) {
    return null
  }

  return (
    <div className='relative border rounded-md p-2'>
      <div className='flex items-center gap-1 mb-2 border-b pb-2'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent text-accent-foreground')}
        >
          <BoldIcon className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent text-accent-foreground')}
        >
          <ItalicIcon className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent text-accent-foreground')}
        >
          <StrikeIcon className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent text-accent-foreground')}
        >
          <CodeIcon className='h-4 w-4' />
        </Button>
        <span className='w-[1px] h-4 bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 1 }) && 'bg-accent text-accent-foreground')}
        >
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 2 }) && 'bg-accent text-accent-foreground')}
        >
          <Heading2 className='h-4 w-4' />
        </Button>
        <span className='w-[1px] h-4 bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-accent text-accent-foreground')}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-accent text-accent-foreground')}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('blockquote') && 'bg-accent text-accent-foreground')}
        >
          <Quote className='h-4 w-4' />
        </Button>
        <span className='w-[1px] h-4 bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className='h-8 w-8 p-0'
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className='h-8 w-8 p-0'
        >
          <Redo className='h-4 w-4' />
        </Button>
        <span className='w-[1px] h-4 bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => {
            setShowSlashMenu(true)
            setSlashMenuPosition({
              x: 100,
              y: 100,
            })
          }}
          className='h-8 px-2 text-xs flex items-center gap-1'
        >
          <Slash className='h-4 w-4' />
          <span>Insert Faker Method</span>
        </Button>
      </div>

      <EditorContent editor={editor} className='prose prose-sm max-w-none min-h-[200px] focus:outline-none' />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className='flex items-center bg-white border rounded-md shadow-md p-1'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent text-accent-foreground')}
            >
              <BoldIcon className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent text-accent-foreground')}
            >
              <ItalicIcon className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent text-accent-foreground')}
            >
              <StrikeIcon className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent text-accent-foreground')}
            >
              <CodeIcon className='h-4 w-4' />
            </Button>
          </div>
        </BubbleMenu>
      )}

      {showSlashMenu && (
        <div
          ref={slashMenuRef}
          style={{
            position: 'absolute',
            left: `${slashMenuPosition.x}px`,
            top: `${slashMenuPosition.y}px`,
            zIndex: 50,
          }}
        >
          <Command className='rounded-lg border shadow-md bg-popover w-[300px]'>
            <CommandInput
              placeholder='Search faker methods...'
              value={searchTerm}
              onValueChange={setSearchTerm}
              className='border-none focus:ring-0'
              autoFocus
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {fakerMethods?.map((category) => (
                <CommandGroup key={category.category} heading={category.category}>
                  {category.items
                    .filter((item) => item.method.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, 5)
                    .map((item) => (
                      <CommandItem key={item.method} onSelect={() => insertFakerMethod(item.method)}>
                        <div className='flex flex-col'>
                          <span className='font-mono text-sm'>{item.method}</span>
                          <span className='text-xs text-muted-foreground'>{item.description}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

export default TipTapEditor
