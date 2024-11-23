import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePost/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/posts' element={<ProtectedRoute> <PostList /> </ProtectedRoute>} />
        <Route path='/create/:user_id' element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App