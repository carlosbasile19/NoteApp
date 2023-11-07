// /api/createNoteBook
import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import {db} from "@/lib/db"
import { $notes } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
    const {userId} = auth();

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;

    const image_description = await generateImagePrompt(name);
    //const image_description = 'A notebook with the title ' + name + ' and a flat styled thumbnail';
    console.log(image_description);

    if (!image_description) {
        return new NextResponse('Failed to generate image description', { status: 500 });
    }
   
     const image_url = await generateImage(image_description);
    //console.log(image_url);

    if (!image_url) {
        return new NextResponse('Failed to generate image', { status: 500 });
    }

    const notes_ids = await db.insert($notes).values({
        name,
        userId,
        imageUrl: image_url,
    }).returning({ insertedId: $notes.id})



    return NextResponse.json({  
        note_id: notes_ids[0].insertedId})
}