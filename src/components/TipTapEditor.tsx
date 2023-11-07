'use client'
import React from 'react'
import {useEditor} from "@tiptap/react"
import { EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from './tipTapMenuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import { $notes, NoteType } from '@/lib/db/schema'
import axios from 'axios'
import Text from '@tiptap/extension-text'
import { useCompletion } from 'ai/react'

type Props = {note: NoteType}

const TipTapEditor = ({note}: Props) => {
    const [editorState, setEditorState] = React.useState(note.editorState || `<h1>${note.name}</h1>`)
    const [isSaving, setIsSaving] = React.useState(false)
    
    const {complete, completion} = useCompletion({
        api: '/api/completion'
    })

    const saveNote = useMutation(
        {
            mutationFn: async () => {
               
                const response = await axios.post('/api/saveNote', 
                {
                    noteId: note.id,
                    editorState: editorState
                });
                setIsSaving(false)
                return response.data;
            },
        }
    )
    
    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Shift-a": () => {
                    const prompt = this.editor.getText().split(' ').slice(-30).join('-')
                    
                    complete(prompt)
                    return true
                },
            }
        }
    })

    
    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({editor}) => {
            setIsSaving(true)
            setEditorState(editor.getHTML())
        }

    })

    const lastCompletion = React.useRef("")
    const token = React.useMemo(() => {
        if(!completion || !editor) return
        const diff = completion.slice(lastCompletion.current.length)
        lastCompletion.current = completion
        editor.commands.insertContent(diff);
        return diff
    }, [completion])

    React.useEffect(() => {
        if(!editor || !token) return
            editor?.commands.insertContent(token);
        
    }, [token, editor])

    const debouncedEditorState = useDebounce(editorState, 1000);

   React.useEffect(() => {
    
         if(debouncedEditorState === '') return
         saveNote.mutate(
            undefined,
            {
                onSuccess: () => {
                    console.log("Saved")
                },
                onError: (error) => {
                    console.log(error)
                }
            }
         )
    }, [debouncedEditorState])

  return (
    <>
        <div className='flex'>
            {editor && (
                <TipTapMenuBar editor={editor} />
            )}
            
            <Button disabled variant={"outline"}>
                {isSaving ? "Saving..." : "Saved" }
            </Button>
        </div>
        <div className="prose prose-sm w-full mt-4">
            <EditorContent editor={editor} />
        </div>
        <div className="h-4">
            <span className='text-sm'>
                Tip: Press {" "}<kbd className='px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-200 rounded-lg'>Shift + A</kbd>  {" "}for AI to autocomplete
            </span>
        </div>
    </>
        
  )
}

export default TipTapEditor