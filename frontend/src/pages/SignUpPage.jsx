import { useState } from "react";
import { motion } from "framer-motion";
import EarthCanvas from "../canvas/Earth";
import StarsCanvas from "../canvas/Stars";
import { slideIn } from "../utils/motion";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../utils/CommonStates"; 
import Alert from "../utils/Alerts";

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpPageCanvas = () => {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState("success");
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      if(form.confirmPassword.trim() !== form.password.trim()) {
        setAlertMessage('Passwords do not match');
        setAlertType('error');
        return ;
      }
      setLoading(true);
      try {
        const response = await registerUser({username: form.username.trim(), email:form.email.trim(), password:form.password.trim()});
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.user.username);
        setTimeout(() => {
            setAlertMessage('Sign Up successful!');
            setAlertType('success');
            setForm(initialState);
            navigate('/profilepic')
        }, 500);
      } catch (error) {
        setAlertMessage(error.response.data.message);
        setAlertType('error');
      } finally {
        setLoading(false); 
      }
    }

    if(loading) return <LoadingSpinner />

    if(alertMessage) return <Alert message={alertMessage} type={alertType} />;
  
    return (
      <div className="flex xl:flex-row flex-col-reverse gap-10 overflow-hidden mt-12">
        {/* Login Form Section */}
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex-[0.75] bg-gray-800 p-6 sm:p-8 rounded-xl h-auto sm:h-[580px] w-[350px] sm:w-[450px] mx-auto overflow-hidden w-xs-300"
        >
          <h3 className="text-white text-3xl font-bold mb-4 overflow-hidden w-xs-heading-font">Sign Up</h3>
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-xs-font">
          <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="custom-input bg-gray-700 py-3 px-4 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm "
                required
                minLength={5}
                maxLength={20}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-gray-700 py-3 custom-input px-4 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                required
              />
            </label>
  
            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Password</span>
              <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full py-3 custom-input px-4 bg-gray-700 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                      placeholder="Enter your password"
                      required
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      minLength={8}
                      maxLength={20}
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Confirm Password</span>
              <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className=" custom-input w-full py-3 px-4 bg-gray-700 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className=" absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
            </label>
  
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 w-full font-bold rounded-lg"
            >
              {loading ? "Signing in..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-slate-400">
              Already Registered? {" "}
              <NavLink to='/login' className="text-blue-400 hover:text-blue-300 hover:underline transition-all">
                Login
              </NavLink>
            </p>
          </div>
        </motion.div>
  
        {/* Canvas Background Section */}
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="hidden xl:block xl:flex-1 xl:h-[500px] md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    );
  };  

const SignUpPage = () => {
  return (
    <div className="bg-primary relative z-0 h-screen w-full flex items-center justify-center">
      <SignUpPageCanvas />
      <StarsCanvas />
    </div>
  );
};

export default SignUpPage;