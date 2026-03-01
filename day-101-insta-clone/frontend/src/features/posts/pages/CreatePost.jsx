import "../style/createPost.scss";
import { useState, useRef } from "react";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

  const [caption, setCaption] = useState("")
  const postImageInputFieldRef = useRef(null)

  const navigate = useNavigate()

  const {loading, handleCreatePost} = usePost()

  async function handleSubmit(e) {
    e.preventDefault()

    const file = postImageInputFieldRef.current.files[0]

    await handleCreatePost(file, caption)

    navigate("/")
  }

  if(loading) {
    return (<main>
      <h1>Creating post...</h1>
    </main>)
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}>
          <label className="post-image-label" htmlFor="postImage">Select image</label>
          <input ref={postImageInputFieldRef} hidden type="file" id="postImage" name="postImage" />
          <input 
            value={caption}
            onChange={(e) => {setCaption(e.target.value)}}
            type="text" id="caption" name="caption" placeholder="Enter caption"/>
          <button className="button primary-button">Create post</button>
        </form>
      </div>
    </main>
  )
}

export default CreatePost
