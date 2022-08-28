import React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';
import Sidebar from './components/Sidebar/Sidebar';
import { nanoid } from 'nanoid';
import Split from 'react-split';

export default function App() {
  // Sync notes with localStorage
  const [notes, setNotes] = React.useState(
    () => {
      return JSON.parse(localStorage.getItem('notes')) || [];
    }
  );
  // const [notes, setNotes] = React.useState([]);

  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  // Sync notes with localStorage
  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }
  
  function updateNote(text) {
    // Move modified notes to the top of the list
    setNotes(oldNotes => {
      const notes = [];
      oldNotes.forEach((note) => {
        if (note.id === currentNoteId) {
          notes.unshift({...note, body: text});
        } else {
          notes.push(note);
        }
      });
      return notes;
    });
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ? { ...oldNote, body: text }
    //     : oldNote;
    // }));
  }
  
  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId;
    }) || notes[0];
  }

  // Delete notes
  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(oldNotes => oldNotes.filter((note) => {
      return note.id !== noteId;
    }));
  }
  
  return (
    <main>
    {
      notes.length > 0 
      ?
      <Split 
        sizes={[30, 70]} 
        direction="horizontal" 
        className="split"
      >
        <Sidebar
          notes={notes}
          currentNote={findCurrentNote()}
          setCurrentNoteId={setCurrentNoteId}
          newNote={createNewNote}
          deleteNote={deleteNote}
        />
        {
          currentNoteId && 
          notes.length > 0 &&
          <Editor 
            currentNote={findCurrentNote()} 
            updateNote={updateNote} 
          />
        }
      </Split>
      :
      <div className="no-notes">
        <h1>You have no notes</h1>
        <button 
          className="first-note" 
          onClick={createNewNote}
        >
          Create one now
        </button>
      </div>
    }
    </main>
  );
}
