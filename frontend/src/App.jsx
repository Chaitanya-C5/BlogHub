import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Blogs from "./pages/Blogs"; 
import PostsDisplay from "./components/PostsDisplay";
import PostFullDisplay from './pages/PostFullDisplay'
import ForgetPassword from "./pages/ForgetPassword";
import SimpleProfileUpload from "./components/SimpleProfileUpload";
import UserProfile from "./pages/ProfilePage";
import Search from "./pages/Search";
import NotFound from "./components/NotFound";
import Members from "./components/Members";
import { ThemeProvider } from "./utils/ThemeContext";

function App() {
  
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/profilepic" element={<SimpleProfileUpload/>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/reset-password' element={<ForgetPassword />} />

          <Route path="/blogs" element={<ProtectedRoute> <Blogs/> </ProtectedRoute>}>
            <Route index element={<PostsDisplay title="Your" query={{tag:"user"}} />} />
            <Route path="create" element={<CreatePost/>} />
            <Route path="famous" element={<PostsDisplay title="Famous" query={{tag:"famous"}} />} />
            <Route path="updates" element={<PostsDisplay title="Recent" query={{tag:"updates"}} />} />
            <Route path="liked" element={<PostsDisplay title="Liked" query={{tag:"liked"}} />} />
            <Route path="saved" element={<PostsDisplay title="Saved"  query={{tag:"saved"}} />} />
            <Route path="followers" element={<Members title={"Followers"} />} />
            <Route path="following" element={<Members title={"Following"} />} />
            <Route path="search" element={<Search />} />
          </Route>

          <Route path="/blogs/posts/:postId" element={<ProtectedRoute> <PostFullDisplay /> </ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path='/posts' element={<ProtectedRoute> <PostList /> </ProtectedRoute>} />
          <Route path="*" component={NotFound} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App