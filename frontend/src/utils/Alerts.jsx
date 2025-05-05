import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

const AlertTypes = {
  success: {
    icon: <CheckCircle2 className="text-green-500" />,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800'
  },
  error: {
    icon: <XCircle className="text-red-500" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800'
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500" />,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800'
  },
  info: {
    icon: <Info className="text-blue-500" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800'
  }
};

const Alert = ({ message, type = 'success', duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      window.location.reload()
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const { icon, bgColor, borderColor, textColor } = AlertTypes[type];

  return (
    <div 
      className={`w-[70%] left-80 fixed top-4 z-50 ${bgColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-lg flex items-center justify-center`}
    >
      <div className="mr-3">{icon}</div>
      <div className={`${textColor} font-medium`}>{message}</div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']),
  duration: PropTypes.number,
};

export default Alert;