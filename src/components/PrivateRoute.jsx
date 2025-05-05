import { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  // Temporarily bypass authentication check
  // const { isAuthenticated } = useContext(AuthContext);

  // return isAuthenticated ? children : <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
