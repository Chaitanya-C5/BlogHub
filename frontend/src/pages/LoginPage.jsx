import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EarthCanvas from "../canvas/Earth";
import StarsCanvas from "../canvas/Stars";
import { slideIn } from "../utils/motion";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, resetPassword } from "../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import Alert from "../utils/Alerts";
import { LoadingSpinner } from "../utils/CommonStates";

const initialState = {
  email: "",
  password: "",
};

const LoginPageCanvas = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "/";

  useEffect(() => {
    localStorage.clear()
    const token = localStorage.getItem("token");
    if (token) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/";
  
      navigate(redirectUrl);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password.trim(),
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.user.username);
      localStorage.setItem("theme", 'light');
      setMessage("Login successful!");
      setTimeout(() => {
        navigate(redirectUrl);
        setForm(initialState);
      }, 500);
    } catch (error) {
      setAlertMessage(error.response.data.message);
      setAlertType("error");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await resetPassword(form.email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if(loading) return <LoadingSpinner />
  
  if (alertMessage) return <Alert message={alertMessage} type={alertType} />;

  return (
    <div className="flex xl:flex-row flex-col-reverse gap-10 overflow-hidden mt-10">
      {/* Login Form Section */}
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="mt-4 overflow-hidden flex-[0.75] bg-gray-800 px-6 pb-4 pt-6 rounded-xl h-[430px] w-full sm:w-[450px] mx-auto flex flex-col w-xs-300"
      >
        {!showForgetPassword ? (
          <div className="flex-grow overflow-hidden">
            <p className="text-secondary text-lg">Welcome back</p>
            <h3 className="text-white text-3xl font-bold mb-4 overflow-hidden w-xs-heading-font">Login</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-xs-font">
              <label className="flex flex-col">
                <span className="text-white font-medium mb-2">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className="custom-input bg-gray-700 py-3 px-4 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
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
                    className="custom-input w-full px-4 py-3 bg-gray-700 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-all"
                    onClick={() => setShowForgetPassword(true)}
                  >
                    Forgot Password?
                  </a>
                </div>
              </label>

              <button
                type="submit"
                className={`overflow-hidden bg-blue-600 text-white px-6 py-3 w-full font-bold rounded-lg ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        ) : message.length === 0 ? (
          <div className="flex-grow">
            <h3 className="text-white text-3xl font-bold mb-4 text-center">Reset Password</h3>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
              <label className="flex flex-col">
                <span className="text-white font-medium mb-2">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className="bg-gray-700 custom-input py-3 px-4 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                  required
                />
              </label>

              <button
                type="submit"
                className={`bg-blue-600  text-white px-6 py-3 w-full font-bold rounded-lg ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
            <button
              onClick={() => setShowForgetPassword(false)}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-all mt-4"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <p className="text-white text-3xl font-bold mb-4 text-center">{message}</p>
        )}

        <div className="text-center overflow-hidden">
          <p className="text-slate-400">
            Not Registered?{" "}
            <NavLink
              to="/signup"
              className="text-blue-400 hover:text-blue-300 hover:underline transition-all"
            >
              Sign Up
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

const LoginPage = () => {
  return (
    <div className="bg-primary relative z-0 h-screen w-full flex items-center justify-center">
      <LoginPageCanvas />
      <StarsCanvas />
    </div>
  );
};

export default LoginPage;