import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchPosts = async(token) => {
  return axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}`}
  });
};

export const createPost = async (title, content, token, user_id) => {
    return axios.post(`${API_URL}/add`, { title, content, user_id }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const registerUser = async (username, password, email) => {
  return axios.post(`${API_URL}/register`,{ username, password, email })
}

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`,{ email, password })
  return response.data
}