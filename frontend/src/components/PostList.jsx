import { useState, useEffect } from 'react';
import { fetchPosts } from '../api/api';
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates';

const PostList = () => {

  const [posts, setPosts] = useState()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
        const fetchData = async() => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetchPosts(token)
                setPosts(response.data)
            } catch(error) {
                console.error(error);
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData();
  },[])

  if(isLoading) return <LoadingSpinner />
  
  if (error) return <ErrorMessage error={error} />;
  

  return (
     <div>
        {
            posts && posts.length > 0 && 
            posts.map(post => {
                return (
                    <div key={post.post_id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                )
            })
        }
     </div>
  )
}

export default PostList