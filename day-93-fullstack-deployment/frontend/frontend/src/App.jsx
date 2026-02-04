import React, { useState, useEffect } from 'react'
import axios from "axios"

const App = () => {

  const [profiles, setProfiles] = useState([])

  function fetchProfiles(){
    axios.get("http://localhost:3000/api/profiles")
    .then((res) => {
      setProfiles(res.data.profiles)
    })
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    const {name, profession} = e.target.elements

    // console.log(name.value, profession.value)
    
    axios.post("http://localhost:3000/api/profiles", {
      name: name.value,
      profession: profession.value
    })
    .then((res) => {
      // console.log(res.data)
      fetchProfiles()
    })
  }

  function handleDeleteProfile(profileId){
    axios.delete("http://localhost:3000/api/profiles/" + profileId)
    .then((res) => {
      // console.log(res.data)
      fetchProfiles()
    })
  }

  function handleUpdateProfession(profileId){
    const newProfession = prompt("Enter new profession");
    
    axios.patch("http://localhost:3000/api/profiles/" + profileId, {profession: newProfession})
    .then((res) => {
      // console.log(res.data);
      fetchProfiles()
    })
  }

  function handleUpdateProfile(profileId){
    const newName = prompt("Enter new name");
    const newProfession = prompt("Enter new profession");

    axios.put("http://localhost:3000/api/profiles/" + profileId, {name: newName, profession: newProfession})
    .then((res) => {
      // console.log(res.data);
      fetchProfiles()
    })
  }
  

  return (
    <>
      <form className='note-create-form' onSubmit={handleSubmit}>
        <input name='name' type='text' placeholder='Enter Name'></input>
        <input name='profession' type='text' placeholder='Enter Profession'></input>
        <button>Create Profile</button>
      </form>


      <div className="profiles">
        {
          profiles.map(profile => {
            return  <div className="profile">
                  <h1>{profile.name}</h1>
                  <p>{profile.profession}</p>
                  <button onClick={()=> {
                    handleDeleteProfile(profile._id)
                  }}>Delete</button>

                  <button onClick={()=> {
                    handleUpdateProfession(profile._id)
                  }}>Update profession</button>

                  <button onClick={()=> {
                    handleUpdateProfile(profile._id)
                  }}>Update Profile</button>
              </div>
          })
        }

      </div>
    </>
  )
}

export default App
