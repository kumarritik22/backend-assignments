import React, { useState, useEffect } from 'react'
import axios from "axios"

const App = () => {

  const [profiles, setProfiles] = useState([])

  function fetchProfiles(){
    axios.get("https://day-86-server.onrender.com/api/profiles")
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
    
    axios.post("https://day-86-server.onrender.com/api/profiles", {
      name: name.value,
      profession: profession.value
    })
    .then((res) => {
      // console.log(res.data)
      fetchProfiles()
    })
  }

  function handleDeleteProfile(profileId){
    axios.delete("https://day-86-server.onrender.com/api/profiles/" + profileId)
    .then((res) => {
      // console.log(res.data)
      fetchProfiles()
    })
  }

  function handleUpdateProfession(profileId){
    const newProfession = prompt("Enter New Profession");
    
    axios.patch("https://day-86-server.onrender.com/api/profiles/" + profileId, {profession: newProfession})
    .then((res) => {
      // console.log(res.data);
      fetchProfiles()
    })
  }

  function handleUpdateProfile(profileId){
    const newName = prompt("Enter New Name");
    const newProfession = prompt("Enter New Profession");

    axios.put("https://day-86-server.onrender.com/api/profiles/" + profileId, {name: newName, profession: newProfession})
    .then((res) => {
      // console.log(res.data);
      fetchProfiles()
    })
  }
  

  return (
    <>
      <div className='heading'>
        <h1>Profile Generator</h1>
      </div>
      <form className='note-create-form' onSubmit={handleSubmit}>
        <input className='name' name="name" type='text' placeholder='Enter Name'></input>
        <input className='profession' name="profession" type='text' placeholder='Enter Profession'></input>
        <button className='create-profile'>Create Profile</button>
      </form>


      <div className="profiles">
        {
          profiles.map(profile => {
            return  <div className="profile">
                  <h1>{profile.name}</h1>
                  <p>{profile.profession}</p>
                  <div className="btn">
                    <button className='delete' onClick={()=> {
                      handleDeleteProfile(profile._id)
                    }}>Delete</button>

                    <button className='update-profession' onClick={()=> {
                      handleUpdateProfession(profile._id)
                    }}>Update Profession</button>

                    <button className='update-profile' onClick={()=> {
                      handleUpdateProfile(profile._id)
                    }}>Update Profile</button>
                  </div>
              </div>
          })
        }

      </div>
    </>
  )
}

export default App
