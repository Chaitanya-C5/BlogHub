import { useState, useEffect } from 'react';
import { updatePost } from '../api/api';

export const usePostInteractions = (initialPost, currentUserId) => {
  const [post, setPost] = useState(null);
  const [showShareNotification, setShowShareNotification] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
    }
  }, [initialPost]);

  const handleLike = async () => {
    if (!post) return;
    
    const token = localStorage.getItem("token") || 'abc';
    try {
      const isLiked = post.likes?.includes(currentUserId);
      await updatePost(token, post._id, 'likes', { username: currentUserId });
  
      setPost(prevPost => ({
        ...prevPost,
        likes: isLiked
          ? prevPost.likes.filter(user => user !== currentUserId)
          : [...(prevPost.likes || []), currentUserId],
        likes_count: isLiked ? prevPost.likes_count - 1 : prevPost.likes_count + 1
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    if (!post) return;

    const token = localStorage.getItem("token") || 'abc';
    try {
      const isSaved = post.saves?.includes(currentUserId);
      await updatePost(token, post._id, 'saves', { username: currentUserId });
  
      setPost(prevPost => ({
        ...prevPost,
        saves: isSaved
          ? prevPost.saves.filter(user => user !== currentUserId)
          : [...(prevPost.saves || []), currentUserId]
      }));
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleShare = () => {
    if (!post) return;

    const url = window.location.pathname.includes('/blogs/posts/')
      ? window.location.href
      : `${window.location.origin}/blogs/posts/${post._id}`;
      
    navigator.clipboard.writeText(url);
    setShowShareNotification(true);
  };

  const handleCloseShareNotification = () => {
    setShowShareNotification(false);
  };

  return {
    post,
    showShareNotification,
    handleLike,
    handleSave,
    handleShare,
    handleCloseShareNotification
  };
};