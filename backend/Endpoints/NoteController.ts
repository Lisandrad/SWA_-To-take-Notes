import {  Request, Response, Router } from "express";
import { Note, Prisma, PrismaClient } from '@prisma/client'; 


const prisma = new PrismaClient()
const app = Router()

//endPoints
app.get('/', async (req: Request, resp: Response) => {
  const noteList = await prisma.note.findMany() 
  console.log(noteList);
	resp.send(noteList)
})

//method POST
app.post('/', async (req: Request, resp: Response) => {
  try{
		const {noteName, noteDescription} = req.body;

		const existingNote = await prisma.note.findFirst({
			where: {
				noteName: noteName,
        noteDescription: noteDescription,
			},
		});

		if (existingNote) {
			return resp.status(400).json({message: 'Note already exists'})
		}

		const newNote = await prisma.note.create({
			data: {
				noteName: noteName,
				noteDescription:noteDescription,
        isArchived: false,
			},
		})
		resp.status(201).json({message: 'Note added successfully', newNote })
	} 
	catch(error: any) {
		console.error('Error adding note:', error);
		resp.status(500).json({ error: 'Error adding note', details: (error as Error).message });
	}                                                                      
	
})

type NoteParams = {
   id?:string,
   name?:string,
   description?:string
}
//method PUT
app.put('/', async (req: Request, resp: Response) => {
  try {
    
    const { noteName, noteDescription, id } = req.body;

    const existingNote = await prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingNote) {
      return resp.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        noteName: noteName || existingNote.noteName,
        noteDescription: noteDescription || existingNote.noteDescription,
      },
    });

    resp.status(200).json({ message: 'Note updated successfully', updatedNote });
  } catch (error: any) {
    console.error('Error updating note:', error);
    resp.status(500).json({ error: 'Error updating note', details: (error as Error).message });
  }
});

app.delete('/', async (req: Request, resp: Response) => {
  try {
    const noteId: string | undefined = req.query.noteId as string;

    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!existingNote) {
      return resp.status(404).json({ message: 'Note not found' });
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    resp.status(200).json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    resp.status(500).json({ error: 'Error deleting note', details: (error as Error).message });
  }
});

//to archive/unarchive notes.
app.put('/archive', async (req: Request, res: Response) => {
    try {
      const noteId: string | undefined = req.query.noteId as string;

      const existingNote = await prisma.note.findUnique({
        where: { id: noteId },
      });

      console.log(existingNote);
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
 
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { isArchived: true },
      });
  
      res.status(200).json({ message: 'Note archived successfully', updatedNote });
    } catch (error: any) {
      console.error('Error unarchive note:', error);
      res.status(500).json({ error: 'Error unarchive note', details: error.message });
    }
  });
  
  app.put('/unarchive', async (req: Request, res: Response) => {
    try {
      const noteId: string | undefined = req.query.noteId as string;

      const existingNote = await prisma.note.findUnique({
        where: { id: noteId },
      });
  
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { isArchived: false },
      });
  
      res.status(200).json({ message: 'Note unarchived successfully', updatedNote });
    } catch (error: any) {
      console.error('Error unarchive note:', error);
      res.status(500).json({ error: 'Error unarchive note', details: error.message });
    }
  });



  export default app












