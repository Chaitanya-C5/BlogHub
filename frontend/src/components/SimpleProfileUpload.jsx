import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileUpload } from "../api/api";
import { motion } from "framer-motion";
import EarthCanvas from "../canvas/Earth";
import StarsCanvas from "../canvas/Stars";
import { slideIn } from "../utils/motion"; 
import Alert from  "../utils/Alerts"
import { LoadingSpinner } from '../utils/CommonStates'


const SimpleProfileUploadCanvas = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState("success");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfilePicture(file);
  
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    };
  
    const handleSubmit = async() => {
      setLoading(true);
      if (!profilePicture) {
        setAlertMessage("Please upload a profile picture.");
        setAlertType("error");
        return;
      }
      try {
        const response = await profileUpload(token, profilePicture);
        console.log('comp',response)
        navigate("/"); 
      } catch (error) {
        console.error(error);
        setAlertMessage(`${error.response.data.message}`);
        setAlertType("error");
      } finally {
        setLoading(false);
      }
    };
  
    if(alertMessage) return <Alert message={alertMessage} type={alertType} />

    if(isLoading) return <LoadingSpinner />

    return (
    <div className="flex xl:flex-row flex-col-reverse gap-10 overflow-hidden mt-12">
    {/* Login Form Section */}
    <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="w-xs-300 flex-[0.75] bg-gray-800 p-8 rounded-xl h-[580px] w-full sm:w-[450px] mx-auto"
    >
      <div className="flex flex-col items-center bg-gray-800 p-8 rounded-xl w-full max-w-[450px] mx-auto">
        <h3 className="text-white text-3xl font-bold mb-4 overflow-hidden w-xs-heading-font">
          Upload Profile Picture
        </h3>
        <div className="flex flex-col gap-6 w-full w-xs-font">
          <label className="flex flex-col w-full">
            <span className="text-white font-medium mb-2">Profile Picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-gray-700 py-3 px-4 text-white rounded-lg border-none font-medium text-sm w-full"
              required
            />
          </label>
          {preview && (
            <div className="mt-4 flex justify-center w-full">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-3 w-full font-bold rounded-lg"
            onClick={handleSubmit}
          >
            {isLoading ? "Submitting ..." : "Submit"}
          </button>
        </div>
      </div>
      </motion.div>

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

const SimpleProfileUpload = () => {
  return (
    <div className="bg-primary relative z-0 h-screen w-full flex items-center justify-center">
      <SimpleProfileUploadCanvas />
      <StarsCanvas />
    </div>
  );
};
  
export default SimpleProfileUpload;
  