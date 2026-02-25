import "../style/form.scss"
import { Link } from "react-router-dom";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" id="username" placeholder="Enter username" />
          <input type="email" name="email" id="email" placeholder="Enter email id" />
          <input type="password" name="password" id="password" placeholder="Enter password" />
          <button className="button primary-button">Login</button>
        </form>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
