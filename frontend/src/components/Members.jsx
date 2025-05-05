import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchUsers } from "../api/api"
import UserCards from '../components/UserCards'
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates'
import { useTheme } from '../hooks/useTheme';

const Members = ({ title }) => {
  const token = localStorage.getItem("token")
  const [fetchResults, setFetchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)
  
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchQuery = async() => {
      try {
        const response = await fetchUsers(token, title);
        setFetchResults(response)
        console.log("Search results:", response);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.message)
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuery();
  },[title, token])

  if(isLoading) return <LoadingSpinner />

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={`container mx-auto px-4 py-8 h-full ${
      darkMode 
        ? 'bg-gradient-to-r from-[#0a111e] to-[#1d2d50] text-white' 
        : 'bg-white'
    }`}>
        <div className="flex items-center mb-6 space-x-4 justify-center">
            <h1 className={`text-4xl font-bold ${
              darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                : 'text-gray-800'
            } overflow-hidden`}>
                {title}
            </h1>
        </div>  

        <div>
           <UserCards users={fetchResults}/>   
        </div>
    </div>
  )
}

Members.propTypes = {
    title: PropTypes.string.isRequired
}

export default Members