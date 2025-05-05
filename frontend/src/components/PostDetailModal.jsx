import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Heart, Calendar, Tag, Maximize, Bookmark, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { fetchSinglePost } from '../api/api';
import { usePostInteractions } from '../hooks/usePostInteractions';
import '../quill.css';
import { Snackbar } from '@mui/material';
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates';
import { useTheme } from '../hooks/useTheme';

const PostDetailModal = ({ post, onClose }) => {
  const [fullPost, setFullPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { darkMode } = useTheme();

  const username = localStorage.getItem('username') || ''; 
  const { post: interactedPost, handleLike, handleSave, handleShare, showShareNotification, handleCloseShareNotification } = usePostInteractions(post, username); 
  const isOwnPost = interactedPost?.username === username;
  const isLiked = interactedPost?.likes?.includes(username);
  const isSaved = interactedPost?.saves?.includes(username);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const loadFullPost = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetchSinglePost(token, post._id);
        console.log(response.post)
        setFullPost(response.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFullPost();
  }, [post._id]);

  const handleFullBlog = () => {
    window.open(`/blogs/posts/${post._id}`, '_blank');
  }

  if (loading) return <LoadingSpinner />
  
  if (error) return <ErrorMessage error={error} />;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`${darkMode ? 'bg-[#1d2d50] text-white' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <p className="text-red-500">{error}</p>
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  const sanitizedContent = fullPost?.content ? DOMPurify.sanitize(fullPost.content) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-enter">
      <div className={`${darkMode 
        ? 'bg-gradient-to-r from-[#0a111e] to-[#1d2d50] text-white' 
        : 'bg-white'} w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative p-6`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <X size={24} />
        </button>
        
        <button
          onClick={handleFullBlog}
          className={`absolute top-[1.20rem] right-[3.5rem] ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Maximize size={20} />
        </button>

        <div className="p-4">
          {/* Metadata */}
          <div className="flex justify-start items-center mb-4 gap-5">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} flex items-center`}>
              <Calendar size={16} className="mr-2" />
              {new Date(fullPost.created_at).toLocaleDateString()}
            </span>
            <span className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-xs px-2.5 py-1 rounded inline-flex items-center`}>
              <Tag size={16} className="mr-1" /> {fullPost.category}
            </span>
          </div>

          {/* Title */}
          <h1 className={`overflow-hidden text-3xl md:text-4xl font-extrabold ${
            darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-gray-900'
          } leading-tight text-center mb-6`}>
            {fullPost.title}
          </h1>

          {/* Author Section */}
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mr-4 overflow-hidden">
              <img
                src={post.profilePicture || '/default-avatar.png'}
                alt={`${fullPost.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{fullPost.username}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Author</p>
            </div>
          </div>

          {/* Content */}
          <div
            className={`prose prose-sm md:prose-lg max-w-none ${
              darkMode 
                ? 'prose-invert prose-headings:text-gray-100 prose-p:text-gray-200 prose-a:text-blue-400'
                : 'prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-600'
            } prose-headings:font-semibold prose-a:underline`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Interaction Buttons */}
          <div className="flex items-center gap-3">
            {!isOwnPost ? (
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

          {/* Share Notification */}
          {showShareNotification && (
            <div className={`mt-4 p-4 ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} rounded`}>
              <p>Link copied to clipboard!</p>
              <button onClick={handleCloseShareNotification} className={`mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'} underline`}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PostDetailModal.propTypes = {
  post: PropTypes.object?.isRequired,
  onClose: PropTypes.func?.isRequired,
};

export default PostDetailModal;