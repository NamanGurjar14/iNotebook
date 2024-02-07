import React from 'react'
import NoteContext from "../context/notes/NoteContext"
import { useState,useContext } from 'react';
const AddNote = (props) => {
    const context = useContext(NoteContext);
  const {addNote} = context;
  const [note, setNote] = useState({title:"",description:"",tag:"default"})
  const handleClick = (e)=>{
    e.preventDefault();
         addNote(note.title,note.description,note.tag);
         props.showAlert("Added successfully","success");
  }
  const onChange = (e)=>{
        setNote({...note,[e.target.name]:[e.target.value]})
  }
  return (
    <div>
        <h1>Add a note</h1>
      <form>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control"name='title' id="title" aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
   
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Desciption</label>
    <input type="text" name="description"className="form-control" id="description" onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" name="tag"className="form-control" id="tag" onChange={onChange} minLength={5} required/>
  </div>
  {/* <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div> */}
  <button type="submit" className="btn btn-primary" onClick={handleClick}>Add note</button>
</form>
    </div>
  )
}

export default AddNote