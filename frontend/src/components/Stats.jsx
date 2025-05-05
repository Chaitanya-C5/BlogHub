import { motion } from 'framer-motion';
import { Users, BookOpen, PenTool, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { fetchStats } from '../api/api.js';
import { LoadingSpinner, ErrorMessage } from '../utils/CommonStates';

const CommunityStats = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalWriters: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchStats();
      setMetrics(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
    }
    return num + '+';
}

  useEffect(() => {
    localStorage.username && localStorage.token ? setIsLogged(true) : setIsLogged(false);
    try {
      fetchMetrics();
    } catch(error) {
      setError(error);
    }
  },[fetchMetrics])


  const stats = [
    {
      icon: <Users className="w-12 h-12" />,
      number: formatNumber(metrics.totalUsers),
      label: "Active Users",
      description: "Growing community of writers and readers"
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      number: formatNumber(metrics.totalBlogs),
      label: "Total Blogs",
      description: "Diverse range of topics and perspectives"
    },
    {
      icon: <PenTool className="w-12 h-12" />,
      number: formatNumber(metrics.totalWriters),
      label: "Writers",
      description: "Passionate content creators"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      number: formatNumber(metrics.totalLikes),
      label: "Total Likes",
      description: "Community engagement"
    }
  ];

  if(loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-r from-[#0a111e] to-[#1d2d50] text-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-hidden">
        <div className="text-center mb-16 mt-[6.5rem] overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden text-3xl md:text-5xl  font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 py-2"
          >
            Our Growing Community
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Join thousands of writers and readers in our thriving ecosystem
          </motion.p>
        </div>

        <div className="overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-[#1a2942] to-[#2a3f6a] p-8 w-full rounded-2xl shadow-xl hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-400">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-white min-w-0 whitespace-nowrap overflow-hidden">
                  {stat.number}
                </h3>
                <p className="text-xl font-semibold text-gray-200">
                  {stat.label}
                </p>
                <p className="text-sm text-gray-400">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-10 overflow-hidden"
        >
          { !isLogged &&
            <button className="px-8 py-4 bg-blue-600 hover:bg-[#0f192c] hover:border-2 hover:border-white rounded-full transition-colors duration-300 text-lg font-semibold"
              onClick={() => navigate('/signup')}>
              Join Our Community
            </button>
          }
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityStats;