import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
    const [credentials, setCredentials] = useState({
        name:"",
        email:"",
        password:"",
        cpassword:""
    });
    let navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        var val = {
            "name":String(credentials.name),
            "email":String(credentials.email),
            "password":String(credentials.password)
          }
        const response = await fetch("/api/auth/createUser",{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              
            },
            body: JSON.stringify (val)
            
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            //Save the authtoken and redirect
            localStorage.setItem('token',json.authToken);
            navigate("/");
            props.showAlert("Account created successfully","success");

          }else{
            props.showAlert("Invalid Details","danger");
          }
    }
    const onChange =  (e)=>{
        setCredentials({...credentials,[e.target.name]:[e.target.value]})
    }
  return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name </label>
    <input type="text" className="form-control" value={credentials.name} onChange={onChange}  id="name" name='name' aria-describedby="emailHelp" required minLength={5}/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address </label>
    <input type="email" className="form-control" value={credentials.email} onChange={onChange}  id="email" name='email' aria-describedby="emailHelp" required />

  </div>

  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' id="password" minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} name='cpassword' id="cpassword" minLength={5} required/>
  </div>
  
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Signup