// /api/createNoteBook
import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import {db} from "@/lib/db"
import { $notes } from "@/lib/db/schema";

export async function POST(req: Request) {
    const {userId} = auth();

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;

    //const image_description = await generateImagePrompt(name);
    const image_description = 'A notebook with the title ' + name + ' and a flat styled thumbnail';
    console.log(image_description);

    if (!image_description) {
        return new NextResponse('Failed to generate image description', { status: 500 });
    }
   
    const image_url = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-DLLpPjqtAB5h3flR9yz0DxB5/user-UEgm8bJruj8XWRjyJlumS0RJ/img-OK7MXwcbSTooLkBJskeb9l03.png?st=2023-11-05T18%3A03%3A17Z&se=2023-11-05T20%3A03%3A17Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-05T04%3A28%3A46Z&ske=2023-11-06T04%3A28%3A46Z&sks=b&skv=2021-08-06&sig=qrONs7XigTzSyUo4o5DitWjnPCjSCuZ6z5ZCvLBVXm4%3D';
    //const image_url = await generateImage(image_description);
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