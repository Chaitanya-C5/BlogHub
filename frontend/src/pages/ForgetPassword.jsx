import { useState } from "react";
import { motion } from "framer-motion";
import EarthCanvas from "../canvas/Earth";
import StarsCanvas from "../canvas/Stars";
import { slideIn } from "../utils/motion";
import { Eye, EyeOff } from "lucide-react";
import { setNewPassword } from "../api/api";
import Alert from "../utils/Alerts";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../utils/CommonStates";

const initialState = {
  password: "",
  confirmPassword: "",
};

const ForgetPasswordCanvas = () => {
  const [form, setForm] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(form.confirmPassword.trim() !== form.password.trim()) {
      setAlertMessage('Passwords do not match');
      setAlertType('error');
      return ;
    }
    setLoading(true);
    try {
      const response = await setNewPassword(token, form.password);
      setTimeout(() => {
        setAlertMessage(response.message);
        setAlertType('success');
        setForm(initialState);
      }, 1000);
    } catch (error) {
      console.log(error)
      setAlertMessage(error.response.data.message);
      setAlertType('error');
    } finally {
      navigate("/login");
      setLoading(false);
    }
  };

  if(alertMessage) return <Alert message={alertMessage} type={alertType} />;
  
  if(isLoading) return <LoadingSpinner />


  return (
    <div className="flex xl:flex-row flex-col-reverse gap-10 overflow-hidden mt-10">
      {/* Login Form Section */}
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="flex-[0.75] bg-gray-800 p-8 rounded-xl h-[430px] w-full sm:w-[450px] mx-auto flex flex-col"
      >
          <div className="flex-grow">
            <h3 className="text-white text-3xl font-bold mb-4">Reset Password</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className="flex flex-col">
                <span className="text-white font-medium mb-2">New Password</span>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                    placeholder="Password"
                    required
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
                    className="w-full px-4 py-3 bg-gray-700 placeholder:text-gray-400 text-white rounded-lg border-none font-medium text-sm"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                </label>

              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-3 w-full font-bold rounded-lg ${
                  isLoading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

        <div className="mt-2 text-center">
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
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

const ForgetPassword = () => {
  return (
    <div className="bg-primary relative z-0 h-screen w-full flex items-center justify-center">
      <ForgetPasswordCanvas />
      <StarsCanvas />
    </div>
  );
};

export default ForgetPassword;