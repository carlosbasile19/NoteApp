import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { uploadImageToFirebase } from "@/lib/firebase";

export async function POST(req: Request){

    try {
        const {noteId} = await req.json();
        //extract dalle image url

        const note = await db.select().from($notes).where(eq($notes.id, parseInt(noteId)));
        
        if(!note[0].imageUrl){
            return new NextResponse('no image url', {status: 500})
        }

        const firebase_url = await uploadImageToFirebase(note[0].imageUrl, note[0].name);

        await db.update($notes).set(
            {
                imageUrl: firebase_url
            }
        ).where(eq($notes.id, parseInt(noteId)));

        return new NextResponse('ok', {status: 200});
    } catch (error) {
        console.error(error);
        return new NextResponse('error', {status: 500});
    }
}