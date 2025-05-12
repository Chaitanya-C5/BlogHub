/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Camera, Save, Edit2, ThumbsUp, FileText, Plus } from "lucide-react";
import { fetchUser } from "../api/api";
import { updateProfile } from "../api/api";
import { useParams } from "react-router-dom";
import PostCards from "../components/PostCards"
import { LoadingSpinner, ErrorMessage } from "../utils/CommonStates";
import { useTheme } from '../hooks/useTheme';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [follow, setFollow] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const { username } = useParams();
  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
  },[posts]);

  const fetchUserData = async () => {
    try {
      const response = await fetchUser(token, username);
      setUser({ ...response.user, ...response.stats });
      setPosts(response.posts);
      setFollow(response?.user.followers);
      setEditForm(response.user);
    } catch (error) {
      console.log(error);
      setError(error.response.message || "Error fetching profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const newForm = { ...editForm, profilePicture: profilePictureFile ? profilePictureFile : editForm.profilePicture };
      const response = await updateProfile(token, newForm);
      localStorage.setItem("username", response.user.username);
      setUser(response.user); 
      window.location.reload();
      setIsEditing(false);
    } catch (error) {
      setError(error?.response?.data?.message|| "Error updating profile");
      console.error("Error updating profile:", error?.response?.data?.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditForm({ ...editForm, profilePicture: imageUrl });
    }
  };

  const handleFollow = async() => {
    try {
      follow.includes(currentUser) ? 
        setFollow(follow => follow.filter(user => user !== currentUser )) :
        setFollow(follow => [...follow, currentUser]);
      const formData = new FormData();
      formData.append('following', username);
      await updateProfile(token, formData);
    } catch(error) {
      setError(error?.response?.data?.message|| "Error updating profile");
      console.error("Error:", error?.response?.data?.message);
    }
  };

  if(isLoading) return <LoadingSpinner />;
  
  if (error) return <ErrorMessage error={error} />;
  

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-[#0a111e]' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className={`${
        darkMode ? 'bg-gradient-to-r from-[#1d2d50] to-[#254278]' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
      } text-white py-10 px-6`}>
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <img
            src={user.profilePicture || "/api/placeholder/150/150"}
            alt="Profile"
            className={`w-36 h-36 rounded-full object-cover shadow-md ${
              darkMode ? 'border-4 border-[#254278]' : 'border-4 border-white'
            }`}
          />
          <div>
            <h1 className={`text-4xl font-bold overflow-hidden py-2 ${
              darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-white'
            }`}>{user.username}</h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-white'}`}>{user.email}</p>
          </div>
          {(currentUser !== username) && (
            <div className="mb-4 mx-4">
              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-800 hover:to-cyan-600'
                }`}
              >
                {!follow.includes(currentUser) && <Plus size={18} />}
                {follow.includes(currentUser) ? "Following" : "Follow"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        {/* Edit Form */}
        {currentUser === username && (
          <>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className={`p-6 rounded-lg shadow space-y-6 ${
                darkMode ? 'bg-[#1d2d50] border border-blue-800' : 'bg-white'
              }`}>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={editForm.profilePicture || "/api/placeholder/150/150"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <label className={`absolute bottom-0 right-0 p-2 rounded-full text-white cursor-pointer ${
                      darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Email</label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={`px-2 mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                          darkMode 
                            ? 'bg-[#0a111e] border-gray-700 text-gray-200 focus:border-blue-600' 
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(user);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                      darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg ${
                    darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              </div>
            )}
          </>
        )}

        {/* Stats and Social Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[ 
            { icon: FileText, label: "Total Posts", value: user.totalPosts || 0 },
            { icon: ThumbsUp, label: "Total Likes", value: user.totalLikes || 0 },
            { label: "Followers", value: user.followers?.length || 0 },
            { label: "Following", value: user.following?.length || 0 }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col justify-between items-center ${
                darkMode ? 'bg-[#1d2d50] border border-blue-800' : 'bg-gray-100'
              }`}
            >
              {stat.icon && (
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={18} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                  <span className={darkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>{stat.label}</span>
                </div>
              )}
              {!stat.icon && (
                <div className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>{stat.label}</div>
              )}
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>{stat.value}</div>
            </div>
          ))}
        </div>


        {/* PostCards Section */}
        <PostCards title="Your" posts={posts} />
      </div>
  </div>

  );
};

export default UserProfile;