import PropTypes from 'prop-types';
import { useEffect, useState, memo } from 'react';
import { fetchPosts } from '../api/api';
import PostCards from './PostCards';
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, containerAnimation, itemAnimation } from "../utils/motion";
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates'
import { useTheme } from '../hooks/useTheme';

const PostsDisplay = ({ title, query }) => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [skip, setSkip] = useState(0);
  const [username, setUsername] = useState(null);
  const [selectedCategory, setCategory] = useState('All');
  const [categoryPage, setCategoryPage] = useState(0);
  const categories = ["All", "Tech", "Lifestyle", "Health", "Education", "Travel", "Finance", "Food", "Entertainment", "Sports", "Fashion", "Music", "Politics", "Science", "Art", "Business", "Environment", "Other"];
  const { darkMode } = useTheme();
  
  const [categoriesPerPage, setCategoriesPerPage] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCategoriesPerPage(3);
      } else if (window.innerWidth < 768) {
        setCategoriesPerPage(4);
      } else if (window.innerWidth < 1024) {
        setCategoriesPerPage(7);
      } else {
        setCategoriesPerPage(12);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current page categories
  const getCurrentCategories = () => {
    const startIndex = categoryPage * categoriesPerPage;
    return categories.slice(startIndex, startIndex + categoriesPerPage);
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);

    const getPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      try {
        const response = await fetchPosts(token, { ...query, username, skip }, selectedCategory);
        setPosts(response.posts);
        setHasMore(response.hasMore);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (username !== null) getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.tag, skip, username, selectedCategory]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryClick = (selectedCategory) => {
    // e.preventDefault();
    setCategory(selectedCategory);
  };

  const nextCategoryPage = () => {
    setCategoryPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const prevCategoryPage = () => {
    setCategoryPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if(isLoading) return <LoadingSpinner />

  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      
      {/* Categories Section with Pagination */}
      <div className="mx-8">
        <div className="relative">
          <div className={`flex items-center gap-4 p-4 rounded-md overflow-hidden ${
            darkMode ? 'bg-[#0f192c]' : 'bg-slate-100'
          }`}>
            <motion.button
              variants={fadeIn("right", "spring", 0.1, 1)}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-3 py-2 cursor-pointer flex-shrink-0"
              onClick={handleToggle}
            >
              Categories
            </motion.button>
            
            <AnimatePresence mode="sync">
              {isExpanded && (
                <motion.div 
                  variants={containerAnimation}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="overflow-hidden flex items-center gap-2"
                >
                  {/* Previous button */}
                  <motion.button
                    variants={fadeIn("right", "spring", 0.1, 1)}
                    initial="hidden"
                    animate="show"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevCategoryPage}
                    disabled={categoryPage === 0}
                    className={`rounded-full w-8 h-8 flex items-center justify-center
                      ${categoryPage === 0 
                        ? darkMode 
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'bg-[#1d2d50] text-blue-400 hover:bg-[#263b63]' 
                          : 'bg-blue-100 text-blue-500 hover:bg-blue-200'}`}
                  >
                    &lt;
                  </motion.button>
                  
                  {/* Visible categories */}
                  {getCurrentCategories().map((category) => (
                    <motion.button
                      key={category}
                      variants={itemAnimation}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                        selectedCategory === category
                          ? darkMode
                            ? "bg-blue-700 text-white z-50" 
                            : "bg-blue-200 text-blue-800 z-50"
                          : darkMode
                            ? "bg-[#1d2d50] text-blue-300 hover:bg-[#263b63]"
                            : "bg-blue-100 text-blue-400 hover:bg-blue-200"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </motion.button>
                  ))}
                  
                  {/* Next button */}
                  <motion.button
                    variants={fadeIn("left", "spring", 0.1, 1)}
                    initial="hidden"
                    animate="show"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextCategoryPage}
                    disabled={categoryPage >= totalPages - 1}
                    className={`rounded-full w-8 h-8 flex items-center justify-center
                      ${categoryPage >= totalPages - 1 
                        ? darkMode 
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : darkMode 
                          ? 'bg-[#1d2d50] text-blue-400 hover:bg-[#263b63]' 
                          : 'bg-blue-100 text-blue-500 hover:bg-blue-200'}`}
                  >
                    &gt;
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PostCards title={title} posts={posts} />
      <div className={`flex flex-1 w-full justify-end gap-5 pr-7 py-4 ${
        darkMode ? 'bg-[#0a111e]' : 'bg-[#ffffff]'
      }`}>
        <button
          disabled={skip === 0}
          className={`border-2 px-5 py-2 h-12 rounded-md ${
            skip === 0 
              ? 'cursor-not-allowed opacity-50' 
              : ''
          } ${
            darkMode
              ? 'border-gray-700 text-gray-300 hover:border-gray-500'
              : 'border-gray-300 text-gray-600 hover:border-gray-500'
          }`}
          onClick={() => setSkip(Math.max(0, skip - 2))}
        >
          Previous
        </button>
        <button
          disabled={!hasMore}
          className={`rounded-md h-12 px-7 py-2 text-white ${
            !hasMore ? 'cursor-not-allowed opacity-50' : ''
          } ${
            darkMode
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
          }`}
          onClick={() => setSkip(skip + 2)}
        >
          Next
        </button>
      </div>
    </>
  );
};

PostsDisplay.propTypes = {
  title: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired
};

export default memo(PostsDisplay);