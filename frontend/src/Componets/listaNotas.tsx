import React from "react";
import { INote } from "../interfaces";

interface Props {
    notes: INote[],
    editHandler(note: INote): void,
    deleteHandler(id: string): void,
    archiveHandler(id: string): void,
    unarchiveHandler(id: string): void,
    
}

const ListNotes = ({ notes, editHandler, deleteHandler, archiveHandler, unarchiveHandler }: Props) => {
  return (
    <div className="note">
      <table>
      <thead>
          <tr>
             <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Is archived?</th>
              <th>Accions</th>
          </tr>
      </thead>
    <tbody>
      {notes.map((note, index) => {
       
       return (
        <tr>
          <td>{index+1} </td>
          <td>{note.noteName}</td>
          <td>{note.noteDescription}</td>
          <td>{note.isArchived? "SI" : "NO"}</td>
          <td>
          <button onClick={() => editHandler(note)}>Update</button>
          <button onClick={() => deleteHandler(note.noteId)} >Delete</button>
          { !note.isArchived &&  <button onClick={() => archiveHandler(note.noteId)}>Archive</button> } 
          { note.isArchived &&  <button onClick={() => unarchiveHandler(note.noteId)}>Urchived</button> }
          </td>
        </tr>
       ); 
      })}
    </tbody>
    </table>
      </div>
  );
};

export default ListNotes;
