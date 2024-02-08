import {useState} from 'react'

import NoteContext from "./NoteContext";

const NoteState = (props)=>{
  
    const notesInitials =[]
    const [notes, setNotes] = useState(notesInitials)

    //Get all notes
    const getNotes = async()=>{
      const response = await fetch(`/api/notes/fetchallnotes`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem("token")
        },
        
      });
      const json = await response.json();
      setNotes(json);
    }

    //Add a note 
    const addNote = async (title,description,tag)=>{

      var val = {
        "title":String(title),
        "description":String(description),
        "tag":String(tag)
      }
      //API call
       const response = await fetch(`/api/notes/addnote`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem("token")
        },
        body: JSON.stringify (val)
      });
      
      const note = await response.json();
    //  const note = {
    //     "_id": "651e63b2e2502698528fe863",
    //     "user": "651d15fa7b37c97682d0833d",
    //     "title": title,
    //     "description": description,
    //     "tag": tag,
    //     "date": "2023-10-05T07:20:18.935Z",
    //     "__v": 0
    //   };
       setNotes(notes.concat(note))
        
    }

    //Delete a note
const deleteNote = async(id)=>{

    //API call
    const response = await fetch(`/api/notes/deletenote/${id}`,{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        "auth-token":localStorage.getItem("token")
      }
      
    });
    const json = await response.json();
    console.log(json);

    const newNotes = notes.filter((note)=>{
         return note._id!==id
    })
    setNotes(newNotes)
}
    //Edit a note
    const editNote = async(id,title,description,tag)=>{

      //API call
      const response = await fetch(`/api/notes/updatenote/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem("token")
        },
        body:JSON.stringify({title,description,tag})
      });
      const json = await response.json();
      console.log(json)

      let newNotes = JSON.parse(JSON.stringify(notes))
      //logic to edit client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id === id){
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
        
      }
      setNotes(newNotes)
    }
    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>{props.children}</NoteContext.Provider>
    )
}

export default NoteState