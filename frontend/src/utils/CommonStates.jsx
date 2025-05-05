import PropTypes from 'prop-types';

export const LoadingSpinner = () => (
    <div className={`flex justify-center items-center min-h-screen`}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
);
  
export const ErrorMessage = ({ error }) => (
    <div className={`min-h-screen flex items-center justify-center`}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-500">{error}</p>
        </div>
    </div>
);
  
ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired
}