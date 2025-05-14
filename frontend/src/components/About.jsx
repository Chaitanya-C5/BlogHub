import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
    const navigate = useNavigate();
    return (
      <div className="pb-20 pt-20 md:pt-40 px-6 md:px-12 lg:px-44 min-h-screen bg-gradient-to-r from-[#0a111e] to-[#1d2d50] text-white">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
              }}
              className="flex-1 flex justify-center md:justify-start mb-8 md:mb-0">
            <img 
              src='/assets/blog.png'  
              alt="about"
              className="w-64 md:w-80 lg:w-96"
            />
          </motion.div>
          
          <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ 
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2
              }}
              className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">

              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 py-2">
                  About BlogHub
              </h2>
              
              <p className="text-lg md:text-xl text-gray-200">
                  BlogHub is a dynamic multi-blogging platform where writers and readers connect effortlessly. Whether you&apos;re an aspiring blogger or an avid reader, our platform allows you to explore, write, and engage with a thriving community.
              </p>
              
              <p className="text-base md:text-lg text-gray-300">
                  Follow your favorite writers and never miss a post! Every time someone you follow uploads a new blog, you&apos;ll receive an instant email notification—keeping you updated with fresh and exciting content.
              </p>

              <p className="text-base md:text-lg text-gray-300">
                  Join BlogHub today and start sharing your thoughts with the world while discovering insightful stories from others.
              </p>
              
              <div className="w-full flex justify-center md:justify-start mt-6">
                <button 
                  className="px-6 md:px-8 py-3 md:py-4 text-white bg-blue-600 hover:bg-[#0f192c] hover:border-2 hover:border-white rounded-full transition-colors duration-300 text-base md:text-lg font-semibold"
                  onClick={() => navigate('/blogs')}>
                    Start Blogging
                </button>
              </div>
          </motion.div>
        </div>
      </div>
    );
};

export default About;