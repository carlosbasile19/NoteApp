'use client'
import React from 'react'
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {Loader2} from 'lucide-react'

type Props = {}

const 
CreateNoteDialog = (props: Props) => {
    
    const [input, setInput] = React.useState('')
    const [isSaving, setIsSaving] = React.useState(false)
    const router = useRouter();
    const createNotebook = useMutation(
        {
            mutationFn: async () => {
                const response = await axios.post('/api/createNoteBook',
                { name: input },
                )
                setIsSaving(false)
                return response.data
            }
        }
    )


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (input === '') {
            alert('Please enter a name for the notebook')
            return
        }

        setIsSaving(true)

        createNotebook.mutate(undefined, {
            onSuccess: ({note_id}) => {
               router.push(`/notebook/${note_id}`)
               
            },
            onError: (error) => {
                console.error(error)
                window.alert('Failed to create a new notebook.')
            }
        }) 


    }
  return (
    <Dialog>
        <DialogTrigger>
           <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-traslate-y-1 flex-row p-4">
                <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
                <h2 className='font-semibold text-green-600 sm:mt-2'>New Notebook</h2>
           </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create a new note
                </DialogTitle>
                <DialogDescription>
                You can create a new note by clicking the button below.                
                </DialogDescription>
            </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Name...'/>
                    <div className="h-4"></div>
                    <div className="flex items-center gap-2">
                        <Button type='reset' variant={'secondary'}>Cancel</Button>
                        <Button type='submit' className='bg-green-600' disabled={isSaving}>
                            {isSaving && (<Loader2 className='w-4 h-2 animate-spin' /> )}
                            Create
                        </Button>
                    </div>
                </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialog