import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
const Login = (props) => {
    const [credentials, setCredentials] = useState({
        email:"",
        password:""
    });
    let navigate = useNavigate();
   
    const handleSubmit = async (e)=>{

        e.preventDefault();
        var val = {
            "email":String(credentials.email),
            "password":String(credentials.password)
            
          }
        const response = await fetch("http://localhost:3000/api/auth/login",{
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
            localStorage.setItem("token",json.authToken);
            
            
            console.log(localStorage);
            Object.entries(localStorage).forEach(([ key, value ]) => {
              console.log(`${key} => ${value}`);
          })
            props.showAlert("Logged in successfully","success");
            navigate("/");

          }else{
            props.showAlert("Invalid Credentials","danger");
          }
    }       

    const onChange = (e)=>{
       setCredentials({...credentials,[e.target.name]:[e.target.value]})
    }
  return (
    <>
    <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" value={credentials.email} onChange={onChange}  id="email" name='email' aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' id="password"/>
  </div>
  
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </>
  )
}

export default Login