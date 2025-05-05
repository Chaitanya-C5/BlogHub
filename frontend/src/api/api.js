import axios from "axios";

const API_URL = "https://bloghub-backend-prrz.onrender.com";

const apiRequest = async (method, endpoint, token, data = null, isFormData = false) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (isFormData) headers["Content-Type"] = "multipart/form-data";

    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${endpoint}:`, error);
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login"; 
    }

    throw error;
  }
};

export const registerUser = (form) => apiRequest("post", "/api/register", null, form);

export const loginUser = (form) => apiRequest("post", "/api/login", null, form);

export const fetchStats = () => apiRequest("get", "/api/stats", null)

export const fetchUser = (token, username) => apiRequest("get", `/api/profile/${username}`, token);

export const fetchUsers = (token, query) => apiRequest("get", `/api/users?category=${query}`, token)

export const searchByFilter = (token, filter, query) => apiRequest("get", `/api/search?category=${filter}&value=${query}`, token);

export const profileUpload = (token, profilePicture) => {
  const formData = new FormData();
  formData.append("profilePicture", profilePicture);
  return apiRequest("post", "/api/profile/update", token, formData, true);
};

export const updateProfile = (token, form) => {
  const username = localStorage.getItem("username");
  return apiRequest("patch", `/api/profile/update/${username}`, token, form, true);
};

export const getImageURL = (token, form) => apiRequest("post", "/api/posts/imageurl", token, form, true);

export const getProfilePic = (token) => apiRequest("get","/api/user/pic",token)

export const resetPassword = (email) => apiRequest("post", "/api/reset-password", null, { email });

export const setNewPassword = (token, password) => apiRequest("post", "/api/set-new-password", null, { token, password });

export const fetchPosts = (token, query, category='All', limit = 3) => {
  let MODIFIED_URL = "/api/posts/user";
  switch (query.tag) {
    case "famous": MODIFIED_URL = "/posts/famous"; break;
    case "updates": MODIFIED_URL = "/posts/updates"; break;
    case "liked": MODIFIED_URL = "/posts/liked"; break;
    case "saved": MODIFIED_URL = "/posts/saved"; break;
  }
  return apiRequest("get", `${MODIFIED_URL}/${category}?user=${query.username}&skip=${query.skip}&limit=${limit}`, token);
};

export const fetchSinglePost = (token, postId) => apiRequest("get", `/api/posts/${postId}`, token);

export const fetchPostByTitle = (token, postTitle) => apiRequest("get", `/api/posts/search/${postTitle}`, token);

export const createPost = (title, category, content, tags, token, username) =>
  apiRequest("post", "/api/posts/add", token, { title, category, content, tags, username });

export const updatePost = (token, postId, action, payload) =>
  apiRequest("patch", `/api/posts/update/${postId}`, token, { action, payload });

export const deletePost = (token, postId) => apiRequest("delete", `/api/posts/delete/${postId}`, token);

export default apiRequest;
