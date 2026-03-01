import "../style/form.scss"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef } from "react";

const Register = () => {

  const {loading, handleRegister} = useAuth();

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const profileImageInputFieldRef = useRef(null)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const file = profileImageInputFieldRef.current.files[0]

    await handleRegister(username, email, password, bio, file)

    navigate("/login");
  }

  if (loading) {
    return (<main>
      <h1>Loading...</h1>
    </main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => {setUsername(e.target.value) }}
            type="text" 
            name="username" 
            id="username" 
            placeholder="Enter username" />

          <input
            onChange={(e) => {setEmail(e.target.value) }} 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter email id" />

          <input 
            onChange={(e) => {setPassword(e.target.value) }} 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Enter password" />

          <input
            onChange={(e) => {setBio(e.target.value) }}
            type="text" 
            name="bio" 
            id="bio" 
            placeholder="Enter bio" />

          <label className="profile-image-label" htmlFor="profileImage">Select profile image</label>
          <input ref={profileImageInputFieldRef} hidden type="file" id="profileImage" name="profileImage" />
          <button className="button primary-button">Register</button>
        </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
