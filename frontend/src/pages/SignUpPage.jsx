import { useState, useRef, useEffect } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCpassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const inpRef = useRef()

  useEffect(() => {
    inpRef.current.focus();
  },[])

  const handleSignUp = async(e) => {
    e.preventDefault();
    if(password !== cpassword) {
        alert("Password and Confirm Password are not matching!")
        return ;
    }
    try {
        await registerUser(username, password, email)
        setUsername('')
        setPassword('')
        setCpassword('')
        setEmail('')
        alert('Sign up successful!')
        return navigate("/login");
    } catch(error) {
        console.error('Sign Up failed',error)
        alert('Sign up failed. Please try again.')
    }
  }

  return (
    <div>
        <form onSubmit={handleSignUp}>
            <input type="text"
                ref={inpRef}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input type="password"
                placeholder="Confirm Password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
            />
            <input type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Sign Up</button>
        </form>
    </div>
  )
}

export default SignUpPage;