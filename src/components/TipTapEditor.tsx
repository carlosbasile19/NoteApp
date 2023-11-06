'use client'
import React from 'react'
import {useEditor} from "@tiptap/react"
import { EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from './tipTapMenuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import { NoteType } from '@/lib/db/schema'
import axios from 'axios'

type Props = {note: NoteType}

const TipTapEditor = ({note}: Props) => {
    const [editorState, setEditorState] = React.useState(note.editorState || '')
    const saveNote = useMutation(
        {
            mutationFn: async () => {
                const response = await axios.post('/api/saveNote', 
                {
                    noteId: note.id,
                    editorState: editorState
                });
                return response.data;
            },
        }
    )
    
    
    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit],
        content: editorState,
        onUpdate: ({editor}) => {
            setEditorState(editor.getHTML())
        }

    })

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
                {saveNote.isLoading ? "Saving..." : "Saved" }
            </Button>
        </div>
        <div className="prose">
            <EditorContent editor={editor} />
        </div>
    </>
        
  )
}

export default TipTapEditor