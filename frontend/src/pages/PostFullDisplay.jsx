import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Calendar, Tag, Bookmark, Share2 } from 'lucide-react';
import { fetchSinglePost } from '../api/api.js';
import { usePostInteractions } from '../hooks/usePostInteractions';
import DOMPurify from 'dompurify';
import { Snackbar } from '@mui/material';
import { LoadingSpinner, ErrorMessage } from "../utils/CommonStates";
import { useTheme } from '../hooks/useTheme';

const PostFullDisplay = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username') || '';
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { darkMode } = useTheme();

  const {
    post: interactedPost,
    handleLike,
    handleSave,
    handleShare,
    showShareNotification,
    handleCloseShareNotification,
  } = usePostInteractions(post, username);

  const isOwnPost = interactedPost?.username === username;
  const isLiked = interactedPost?.likes?.includes(username);
  const isSaved = interactedPost?.saves?.includes(username);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetchSinglePost(token, postId);
        setPost(response.post);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if(loading) return <LoadingSpinner />;
  
  if (error) return <ErrorMessage error={error} />;
  
  if (!post || !interactedPost) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0a111e] text-gray-200' : ''}`}>
        <div className="spinner">Loading post data...</div>
      </div>
    );
  }

  // Sanitize content after we confirm post exists
  const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a111e]' : 'bg-gray-50'}`}>
      {/* Hero Section with Title */}
      <div className={`${darkMode ? 'bg-[#1d2d50] shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <span className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-sm px-3 py-1 rounded-full inline-flex items-center`}>
                <Tag size={16} className="mr-2" /> {post.category}
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} flex items-center`}>
                <Calendar size={16} className="mr-2" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className={`overflow-hidden text-4xl font-extrabold ${
              darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-gray-900'
            } leading-tight`}>
              {post.title}
            </h1>
            <div className={`flex items-center pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                <img
                  src={post.profilePicture || '/default-avatar.png'}
                  alt={`${post.username}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{post.username}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Author</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <article className={`${darkMode ? 'bg-[#1d2d50] shadow-lg' : 'bg-white shadow-sm'} rounded-lg p-6 sm:p-8`}>
          <div
            className={`prose prose-lg max-w-none ${
              darkMode 
                ? 'prose-invert prose-headings:text-gray-100 prose-p:text-gray-200 prose-a:text-blue-400 hover:prose-a:text-blue-300'
                : 'prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-500'
            } prose-headings:font-semibold`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          
          {/* Engagement Section */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-x-4`}>
              <div className="flex items-center gap-3">
                { !isOwnPost ? (
                    <button
                      onClick={(e) => handleLike(e, post._id)}
                      className={`${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                    >
                      <Heart
                        size={20}
                        className={`${
                          isLiked ? (darkMode ? "fill-red-400 text-red-400" : "fill-red-600 text-red-600") : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <button className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-not-allowed`} disabled>
                      <Heart
                        size={20}
                        className={darkMode ? "fill-red-400 text-red-400" : "fill-red-600 text-red-600"}
                      />
                    </button>
                  )
                }
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {post.likes_count}
                </span>
                {!isOwnPost ? (
                  <button
                    onClick={(e) => handleSave(e, post._id)}
                    className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-colors`}
                  >
                    <Bookmark
                      size={20}
                      className={`${
                        isSaved ? (darkMode ? "fill-blue-400 text-blue-400" : "fill-blue-600 text-blue-600") : ""
                      }`}
                    />
                  </button>
                ) : (
                  <button className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-not-allowed`} disabled>
                    <Bookmark
                      size={20}
                      className={darkMode ? "text-blue-400" : "text-blue-600"}
                    />
                  </button>
                )}

                <button
                  onClick={(e) => handleShare(e, post._id)}
                  className={`${darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-500 hover:text-green-600'} transition-colors`}
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
                        ? 'linear-gradient(to right, #3b82f6, #4f46e5)' 
                        : 'linear-gradient(to right, #3b82f6, #06b6d4)', 
                      color: '#ffffff',
                      fontFamily: 'inherit',
                      border: darkMode ? '1px solid #4b5563' : '1px solid #b7d1f7',
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

            {/* Share Notification */}
            {showShareNotification && (
              <div className={`mt-4 p-4 ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} rounded`}>
                <p>Link copied to clipboard!</p>
                <button
                  onClick={handleCloseShareNotification}
                  className={`mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'} underline`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostFullDisplay;