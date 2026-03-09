import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));


  if (!userInfo) {
    return <Navigate to="/login" />;
  }


  if (roleRequired && userInfo.role !== roleRequired) {
    return <Navigate to="/" />;
  }


  return children;
};

export default ProtectedRoute;