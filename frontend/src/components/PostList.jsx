import { useState, useEffect } from 'react';
import { fetchPosts } from '../api/api';

const PostList = () => {

  const [posts, setPosts] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
        const fetchData = async() => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetchPosts(token)
                setPosts(response.data)
                setLoading(false)
            } catch(error) {
                console.error(error);
                setError(error)
                setLoading(false)
            }
        }
        fetchData();
  },[])

  if(loading) {
    return <h1>Loading ...</h1>
  }

  if(error) {
    return <>
        <h1>Error...</h1>
        <h2>{error?.message} ...</h2>
    </>
  }

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