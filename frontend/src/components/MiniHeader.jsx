import { useEffect, useState, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Moon } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { searchByFilter } from "../api/api"
import { textVariant, zoomIn } from "../utils/motion";
import { getProfilePic } from "../api/api";
import { LoadingSpinner, ErrorMessage } from "../utils/CommonStates";
import { useTheme } from '../hooks/useTheme';
import PropTypes from 'prop-types';

const MiniHeader = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilter, setSearchFilter] = useState("username");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username")
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = useCallback(async (value) => {
    if (value.trim() === "") {
      setSearchResults([]); 
      return;
    }

    try {
      const response = await searchByFilter(token, searchFilter, searchValue);
      setSearchResults(response);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  }, [searchFilter, searchValue, token]);

  const handleSearchClick = (filter, result) => {
    if(filter === 'username') {
      navigate(`/profile/${result.username}`);
    } else if(filter === 'title') {
      navigate(`/blogs/posts/${result._id}`);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' && searchFilter === 'tag') || (e.key === 'Enter' && searchResults && searchResults.length > 0)) {
      navigate(`/blogs/search?filter=${searchFilter}&value=${searchValue}`);
    } 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if(debouncedSearchValue) {
      handleSearch(debouncedSearchValue);
    }
  },[debouncedSearchValue, handleSearch]);

  useEffect(() => {
    const fetchProfilePic = async() => {
      try { 
        const response = await getProfilePic(token);
        setProfilePic(response.profilePicture);
      } catch(error) {
        console.error("Error fetching search results:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfilePic();
  },[token]);

  

  if(isLoading) return <LoadingSpinner />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={`w-full rounded-md mx-auto px-6 ${darkMode ? 'bg-[#0a111e]' : 'bg-white'}`}>
      {/* Header with Profile Picture */}
      <div className="flex justify-center items-center pt-4 pr-2 mb-4 mt-2 w-full">
        <div className="flex-1 flex justify-center mx-2">
          <div className="w-full sm:w-96">
              <div className={`flex items-center px-2 py-2 rounded-md w-full transition-colors duration-200 ${
                darkMode 
                  ? 'border-2 border-gray-700 hover:border-gray-500 focus-within:border-blue-400' 
                  : 'border-2 border-gray-300 hover:border-gray-500 focus-within:border-gray-500'
              }`}>
                <Search size={24} className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} flex-shrink-0 mr-2`} />
                <div className="flex-1 flex items-center min-w-0">
                  <input
                    className={`outline-none w-full min-w-0 ${darkMode ? 'bg-transparent text-gray-200 placeholder-gray-400' : 'bg-transparent'}`}
                    type="search"
                    placeholder={`Search by ${searchFilter}`}
                    value={searchValue}
                    onKeyDown={handleKeyDown}
                    onChange={e => setSearchValue(e.target.value)}
                  />
                </div>
                <select
                  className={`outline-none cursor-pointer pl-2 ml-2 flex-shrink-0 ${
                    darkMode 
                      ? 'bg-transparent text-gray-300 border-l border-gray-700' 
                      : 'bg-transparent text-gray-500 border-l border-gray-300'
                  }`}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                >
                  <option className={`${darkMode ? 'text-gray-600' : ''}`} value="title">Title</option>
                  <option className={`${darkMode ? 'text-gray-600' : ''}`} value="username">Username</option>
                  <option className={`${darkMode ? 'text-gray-600' : ''}`} value="tag">Tags</option>
                </select>
              </div>

              <AnimatePresence>
                {searchResults && searchResults.length > 0 && searchValue && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute max-h-80 w-72 mt-2 py-2 rounded-md shadow-lg z-50 overflow-y-auto ${
                      darkMode 
                        ? 'bg-[#1d2d50] border border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={index}
                        className={`px-4 py-2 cursor-pointer ${
                          darkMode 
                            ? 'hover:bg-[#0f192c]' 
                            : 'hover:bg-gray-100'
                        }`}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSearchClick(searchFilter, result)}
                      >
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {result[searchFilter]}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors mr-5 shadow-sm ${
              darkMode 
                ? 'bg-[#1d2d50] hover:bg-[#0f192c] border border-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
            }`}
            aria-label="Toggle dark mode"
          >
            <Moon size={20} className={darkMode ? 'text-blue-400' : 'text-gray-500'} />
          </button>

          {/* Profile Dropdown */}
          <div ref={dropdownRef}>
            <div 
              className={`p-0.5 rounded-full flex-none shadow-lg ${darkMode ? 'bg-[#1d2d50]' : 'bg-white'}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div 
                className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                  darkMode 
                    ? 'ring-2 ring-gray-700' 
                    : 'ring-2 ring-gray-300'
                }`}
              >
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-200 text-xl">?</span>
                  </div>
                )}
              </div>
            </div>

            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg z-50 mr-2 ${
                darkMode 
                  ? 'bg-[#1d2d50] border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div 
                  className={`px-4 py-2 cursor-pointer flex items-center ${
                    darkMode 
                      ? 'hover:bg-[#0f192c] text-gray-200' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    navigate(`/profile/${username}`);
                    setIsDropdownOpen(false);
                  }}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer flex items-center ${
                    darkMode 
                      ? 'hover:bg-[#0f192c] text-red-400' 
                      : 'hover:bg-gray-100 text-red-600'
                  }`}
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div 
        variants={zoomIn(0.2, 1)}
        initial="hidden"
        animate="show"
        className={`h-60 rounded-xl flex items-center justify-center my-6 mx-10 ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600' 
            : 'bg-gradient-to-r from-blue-300 via-blue-500 to-blue-600'
        }`}
      >
        <motion.p 
          variants={textVariant(0.4)}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-7xl text-white font-bold text-center px-4 overflow-hidden py-4"
        >
          Discover Blogs
        </motion.p>
      </motion.div>
    </div>
  );
};

MiniHeader.propTypes = {
  setMode: PropTypes.func.isRequired,
};

export default memo(MiniHeader);