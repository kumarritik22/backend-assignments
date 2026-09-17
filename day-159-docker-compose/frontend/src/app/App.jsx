import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

const App = () => {

  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const response = await axios.get("/api/users");
    setUsers(response.data);
  }

  useEffect(() => {
    getUsers()
  }, [])
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => {
          return <li key={user.id}>{user.name}</li>
        })}
      </ul>
    </div>
  )
}

export default App
