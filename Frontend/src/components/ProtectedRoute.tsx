/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../store';

interface ProtectedRouteProps extends RouteProps {
  // children or component prop can be used, but here we use component for clarity
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const tokens = useAuthStore((state) => state.tokens);
  const isAuthenticated = !!tokens?.accessToken;

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
