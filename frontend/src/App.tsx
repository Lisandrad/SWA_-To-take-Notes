import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import './App.css';
import { INote } from './interfaces';
import ListNotes from './Componets/listaNotas';

const App: FC = () => {
  const [noteId, setNoteId] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [isArchived, setIsArchived] = useState<boolean>(false)
  const [noteList, setNoteList] = useState<INote[]>([])
  const [filteredNoteList, setFilteredNoteList] = useState<INote[]>([])
  const [notekAdded, setNoteAdded] = useState<boolean>(false);
  const [checkArchived, setCheckArchived] = useState<boolean>(true)

  useEffect(() => {
    setNotes();
  }, []);

  const handleChanges = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    if (name === 'note') {
      setNote(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const addNote = (): void => {
    const newNote: INote = { noteId: noteId, noteName: note, noteDescription: description, isArchived: false };

    createNewNote(newNote)
      .then((resp) => {
        alert(resp.message);
        setNoteAdded(true);
        setNoteList([...noteList, newNote]); 
        setNotes(); 
        setIsArchived(false)
      })
      .catch((error) => {
        console.error('Error adding note:', error);
      });

    setNote('');
    setDescription('');
  };

  function setNotes(): void {
    fetch('http://localhost:4000/Note')
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch. Status: ' + resp.status);
        }
        return resp.json();
      })
      .then((data: any[]) => {
        const notes: INote[] = data.map((note: any) => ({
          noteId: note.id,
          noteName: note.noteName,
          noteDescription: note.noteDescription,
          isArchived: note.isArchived
        }));
        console.log(notes)
        setNoteList(notes);
        setFilteredNoteList(notes);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
    

  function createNewNote(newNote: INote): Promise<{ message: string }> {
    return fetch('http://localhost:4000/Note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteName: newNote.noteName,
        noteDescription: newNote.noteDescription,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Network response was not ok');
        }
        return resp.json();
      })
      .catch((error) => {
        console.error('Error adding note:', error);
        throw new Error('Error adding note');
      });
  }
  
//PUT Method
function noteToEdit(note: INote) {
  setNote(note.noteName);
  setDescription(note.noteDescription);
  setNoteId(note.noteId);
  setNoteAdded(true);
  setIsArchived(note.isArchived || false);
  setCheckArchived(note.isArchived || false)
}

const editNote = (): void => {
  fetch('http://localhost:4000/Note', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: noteId, noteName: note, noteDescription: description }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      setNotes();
      setNoteAdded(false);
    });
};


  //DELETE Method
  function toDelete(noteId: string) {
    fetch(`http://localhost:4000/Note?noteId=${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes();
        setNoteAdded(false);
      });
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    if(value.length > 1) {
      const resultNotes = noteList.filter( n => n.noteName.toLowerCase().includes(value) || n.noteDescription.toLowerCase().includes(value));

      setFilteredNoteList(resultNotes);
    }
    else {
      setFilteredNoteList(noteList);
    }

    setSearchTerm(value);
  };

  function toArchive(noteId: string) {
    fetch(`http://localhost:4000/Note/archive?noteId=${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
    setNotes();
    setNoteAdded(false);
  })
  .catch((error) => {
    console.error('Error archiving note:', error);
  });
  }

  function toUnarchive(noteId: string) {
    fetch(`http://localhost:4000/Note/unarchive?noteId=${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
    setNotes();
    setNoteAdded(false);
  })
  .catch((error) => {
    console.error('Error unarchiving note:', error);
  });
  }
  
  const handleShowArchived = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckArchived(event.target.checked)
      const resultNotes = noteList.filter( n => n.isArchived == event.target.checked || event.target.checked);
      setFilteredNoteList(resultNotes);
  }

  return (
    <div className="App">
      <div className="header">
        <div className="inputContainer">
          <input type="text" placeholder="Note" name="note" value={note} onChange={handleChanges} />
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={description}
            onChange={handleChanges}
          />
        </div>
       
        <div className="buttonContainer ">
          { (noteId == '') &&  <button onClick={addNote}>Add note</button> }
          { (noteId != '') && <button onClick={editNote}>Update</button> }
          {}
        </div>
        
      </div>
      <div className="search">
          <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
          <input className='checkbox' name='mark' type="checkbox"
           onChange={handleShowArchived} checked={checkArchived} />
          <label>Show Archived</label>
        </div>
        
      <div>
        <ListNotes notes={filteredNoteList} editHandler={noteToEdit} deleteHandler={toDelete} archiveHandler={toArchive} unarchiveHandler={toUnarchive}/>
      </div>
    </div>
  );
}


export default App;

