import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchByFilter } from "../api/api"
import PostCards from '../components/PostCards'
import { Search as SearchIcon } from 'lucide-react'
import UserCards from '../components/UserCards'
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates'

const Search = () => {
  const token = localStorage.getItem("token")
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "title"; 
  const value = searchParams.get("value") ||"My"; 
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const searchQuery = async() => {
      setIsLoading(true);
      if (value.trim() === "") {
        setSearchResults([]); 
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await searchByFilter(token, filter, value);
        setSearchResults(response)
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.message)
      } finally {
        setIsLoading(false);
      }
    }
    searchQuery();
  },[filter, value, token])

  if(isLoading) return <LoadingSpinner />

  if (error) return <ErrorMessage error={error} />;


  return (
    <div className="container mx-auto px-4 py-8 h-full bg-white">
      <div className="flex items-center mb-6 space-x-4">
        <SearchIcon className="text-gray-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">
          Search Results for &quot;{value}&quot;
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-xl">No results found</p>
          <p className="text-gray-500 mt-2">Try a different search term</p>
        </div>
      ) : (
        <div>
            {
                filter === 'title' ? (
                    <PostCards 
                        title={`Search Results (${searchResults.length})`} 
                        posts={searchResults} 
                    />
                ) : filter === 'username' ? (
                    <UserCards users={searchResults}/>
                ) : (
                    <PostCards 
                        title={`Tag Results (${searchResults.length})`} 
                        posts={searchResults} 
                    />
                )
            }
        </div>

      )}
    </div>
  )
}

export default Search