import { useState } from "react";
import { createPost } from "../api/api";
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user_id } = useParams();

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };
  
  const handleSubmit = async(e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try  {
            await createPost(title, content, token, user_id);
            setContent("");
            setTitle("");
            alert("Post added successfully!");
        } catch(error) {
            console.error("Error creating post:", error);
            alert("Failed to add post. Please try again.");
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit} style={{fontFamily: "poppins"}}> 
            <input type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <CKEditor
                editor={ClassicEditor}
                config={{
                    contentStyle: {
                        fontFamily: 'Poppins, sans-serif', 
                    },
                }}
                data=""
                onChange={handleEditorChange}
            />
            <button type="submit">Add Post</button>
        </form>
    </div>
  )
}

export default CreatePost