import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import { useTheme } from '../hooks/useTheme';

const UserCards = ({ users }) => {
  const navigate = useNavigate();
  
  const { darkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {users.map((user, index) => (
        <div 
          key={index} 
          onClick={() => navigate(`/profile/${user.username}`)}
          className={`${
            darkMode 
              ? 'bg-[#1d2d50] shadow-lg border border-gray-700' 
              : 'bg-blue-100 shadow-md'
          } rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
        >
          <div className="flex items-center p-4 space-x-4">
            <img 
              src={user.profilePicture || '/default-avatar.png'} 
              alt={`${user.username}'s profile`}
              className={`w-16 h-16 rounded-full object-cover border-2 ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}
            />
            <div>
              <h3 className={`text-lg font-semibold ${
                darkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                  : 'text-gray-800'
              }`}>
                {user.username}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

UserCards.propTypes = {
  users: PropTypes.array.isRequired
};


export default UserCards;