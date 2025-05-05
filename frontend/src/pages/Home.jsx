import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import About from '../components/About';
import Stats from '../components/Stats';

const Home = () => {
  return (
    <div className="relative w-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed top-0 left-0 right-0 z-20"
      >
        <Navbar />
      </motion.div>

      <div className="h-screen relative" id='home'>
        <img src='/assets/mpodium.png' alt='podium' className='w-full h-full' />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex flex-col items-center justify-center gap-4 w-full text-white h-full absolute top-0 left-0 right-0 z-10"
        >
          <motion.h1
            className="lg:text-8xl md:text-6xl sm:text-5xl text-4xl font-bold lg:min-h-28 md:min-h-24 sm:min-h-20 min-h-16"
            initial={{
              opacity: 0,
              y: 100,
              rotateY: -180
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateY: 0
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          >
            BlogHub
          </motion.h1>

          <motion.p
            className="text-center lg:text-lg md:text-base sm:text-sm text-xs"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            Discover insightful articles and share your thoughts. <br />
            Start your journey as a blogger today!
          </motion.p>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }} 
        id='about'
        className='min-h-screen'
      >
        <About />
      </motion.div>

      {/* Community Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }} 
        id='community'
        className='min-h-screen'
      >
        <Stats />
      </motion.div>
    </div>
  );
};

export default Home;