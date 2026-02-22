import "../style/form.scss";
import { Link } from "react-router";
import { useState } from "react";

const register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
   
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input 
            onInput={(e)=> {setUsername(e.target.value)}} 
            type="text" 
            name="username" 
            placeholder="Enter username" />
          <input
            onInput={(e)=> {setEmail(e.target.value)}}  
            type="email" 
            name="email" 
            placeholder="Enter email" />
          <input
            onInput={(e)=> {setPassword(e.target.value)}}
            type="password" 
            name="password" 
            placeholder="Enter password" />
          <button type="submit">Register</button>
        </form>

        <p>Already have an account? <Link to="/login" className="toggleAuthForm">Login</Link></p>
      </div>
    </main>
  )
}

export default register
