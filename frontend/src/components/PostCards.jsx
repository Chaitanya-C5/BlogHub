import PropTypes from "prop-types";
import { Heart, Trash2, MoreVertical, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import PostDetailModal from "./PostDetailModal";
import { deletePost, updatePost } from "../api/api";
import { Snackbar } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const PostCards = ({ title, posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const currentUserId = localStorage.getItem('username') || '';
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const { darkMode } = useTheme();


  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token") || 'abc';
    await deletePost(token, postId);
    setPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
    setActiveMenu(null);
    setShowDeletePopUp(false);
  };

  const handleLike = (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token") || '';
    try {
      const isLiked = posts.find((post) => post._id === postId)?.likes.includes(currentUserId);
      
      updatePost(token, postId, 'likes', { username: currentUserId });
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((user) => user !== currentUserId) 
                  : [...post.likes, currentUserId], 
                likes_count: isLiked
                  ? post.likes_count - 1 
                  : post.likes_count + 1, 
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const handleSave = (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token") || 'abc';
    try {
      const isSaved = posts.find((post) => post._id === postId)?.saves.includes(currentUserId);
      
      updatePost(token, postId, 'saves', { username: currentUserId });
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                saves: isSaved
                  ? post.saves.filter((user) => user !== currentUserId) 
                  : [...post.saves, currentUserId], 
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleShare = (e, postId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/blogs/posts/${postId}`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleMenu = (e, postId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === postId ? null : postId);
    // Reset delete popup when toggling menu
    setShowDeletePopUp(false);
  };

  const handlePopUp = (e) => {
    if (e) e.stopPropagation();
    setShowDeletePopUp(false);
  };

  return (
    <div className={`py-8 ${darkMode ? 'bg-[#0a111e]' : 'bg-white'}`}>
      <div className="mx-5 max-w-7xl px-2 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold mb-8 overflow-hidden ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-gray-900'}`}>
          {title} Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const isOwnPost = post.username === currentUserId;
            const isLiked = post.likes?.includes(currentUserId);
            const isSaved = post.saves?.includes(currentUserId);

            return (
              <div
                key={post._id}
                onClick={() => handlePostClick(post)}
                className={`rounded-lg shadow-md overflow-hidden 
                          transition-all duration-300 hover:shadow-xl cursor-pointer relative
                          ${darkMode ? 'bg-[#1d2d50] border border-blue-800' : 'bg-[#e6f1f9]'}`}
              >
                {isOwnPost && (
                  <>
                    <div className="absolute top-2 right-2 z-10 overflow-hidden">
                      <button
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'text-blue-400 hover:bg-[#2c3e67]' : 'text-blue-800 hover:bg-[#b7d1f7]'}`}
                        onClick={(e) => toggleMenu(e, post._id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    {activeMenu === post._id && (
                      <div
                        className={`absolute top-10 right-2 shadow-lg rounded-md py-1 w-36 z-20 border ${
                          darkMode ? 'bg-[#0f192c] border-blue-800 text-gray-200' : 'bg-white border-gray-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className={`flex items-center gap-2 px-4 py-2 w-full text-left ${
                            darkMode ? 'text-gray-200 hover:bg-[#2c3e67]' : 'text-gray-700 hover:bg-[#f1f9ff]'
                          } transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeletePopUp(true);
                          }}
                        >
                          <Trash2 size={16} className="text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}

                    {showDeletePopUp && activeMenu === post._id && (
                      <div 
                        className={`absolute top-16 right-2 p-3 rounded-lg shadow-lg w-48 z-30 border ${
                          darkMode ? 'bg-[#0f192c] border-blue-800 text-gray-200' : 'bg-white border-gray-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => handlePopUp(e)}
                          className={`absolute top-1 right-1 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        <p className={`mb-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delete this post?</p>
                        <div className="flex gap-2 justify-end">
                          <button 
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              darkMode ? 'text-gray-200 bg-[#2c3e67] hover:bg-[#3a4e7c]' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={(e) => handlePopUp(e)}
                          >
                            No
                          </button>
                          <button 
                            className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post._id);
                            }}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="p-6">
                  <div className="flex justify-start items-center mb-4 gap-5">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <img className="w-10 h-10 rounded-full" src={post.profilePicture} alt="profile_pic"/>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {post.username}
                        </p>
                      </div>
                    </div>
                    
                    {/* Interaction buttons */}
                    <div className="flex items-center gap-3">
                      {!isOwnPost ? (
                          <button
                            onClick={(e) => handleLike(e, post._id)}
                            className={`transition-colors ${
                              darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                            }`}
                          >
                            <Heart
                              size={20}
                              className={isLiked ? 
                                (darkMode ? "fill-red-400 text-red-400" : "fill-red-600 text-red-600") : ""}
                            />
                          </button>
                        ) : (
                          <button className={`cursor-not-allowed ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} disabled>
                            <Heart
                              size={20}
                              className={darkMode ? "fill-red-400 text-red-400" : "fill-red-600 text-red-600"}
                            />
                          </button>
                        )
                      }
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {post.likes_count}
                      </span>
                      {!isOwnPost ? (
                        <button
                          onClick={(e) => handleSave(e, post._id)}
                          className={`transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                          }`}
                        >
                          <Bookmark
                            size={20}
                            className={isSaved ? 
                              (darkMode ? "fill-blue-400 text-blue-400" : "fill-blue-600 text-blue-600") : ""}
                          />
                        </button>
                      ) : (
                        <button className={`cursor-not-allowed ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} disabled>
                          <Bookmark
                            size={20}
                            className={darkMode ? "text-blue-400" : "text-blue-600"}
                          />
                        </button>
                      )}
 
                      <button
                        onClick={(e) => handleShare(e, post._id)}
                        className={`transition-colors ${
                          darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'
                        }`}
                      >
                      <Share2 size={20} />
                      </button>
                      <Snackbar
                        open={openSnackbar}
                        autoHideDuration={2000}
                        onClose={handleCloseSnackbar}
                        message="Link copied to clipboard"
                        ContentProps={{
                          sx: {
                            background: darkMode 
                              ? 'linear-gradient(to right, #3b82f6, #6366f1)' 
                              : 'linear-gradient(to right, #3b82f6, #06b6d4)',
                            color: '#ffffff',
                            fontFamily: 'inherit',
                            border: darkMode ? '1px solid #3b4c79' : '1px solid #b7d1f7',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                            '& .MuiSnackbarContent-message': {
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }
                          }
                        }}
                      /> 
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handleCloseModal} darkMode={darkMode} />
      )}
    </div>
  );
};

PostCards.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired
};

export default PostCards;