import React from "react";
import { useSelector } from 'react-redux';
import { Navigate, Route } from "react-router-dom";
import { selectIsLoggedIn } from '../selectors/appSelector';

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  console.log("isAuthenticated ===> ", isAuthenticated);

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
}

export default ProtectedRoute;