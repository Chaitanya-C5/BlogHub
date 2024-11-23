import React, { useEffect, useState } from "react";
import { loginUser } from "../api/api";
import {  useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const inpRef = React.useRef()

    useEffect(() => {
        inpRef.current.focus()
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const { token, user } = await loginUser(email, password)
            localStorage.setItem("token", token)
            localStorage.setItem("user", user)
            setPassword('')
            setEmail('')
            alert('Login successful!')
            return navigate(`/create/${user.user_id}`)
        } catch(error) {
            console.error("Login Failed",error);
            alert('Login failed!')
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" 
                    ref={inpRef}
                    value={email} 
                    name="email" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)}    
                />
                <input type="text" 
                    value={password} 
                    name="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)}    
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage;