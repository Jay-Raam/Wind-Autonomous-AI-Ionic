/**
 * Authentication Guard Route Component
 */

import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../store';

interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
    ...rest
}) => {
    const tokens = useAuthStore((state: any) => state.tokens);
    const isLoading = useAuthStore((state: any) => state.isLoading);
    const isInitialized = useAuthStore((state: any) => state.isInitialized);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isInitialized || isLoading) {
                    return (
                        <div className="flex items-center justify-center h-screen">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border border-t-2 border-primary mx-auto mb-4"></div>
                                <p>Loading...</p>
                            </div>
                        </div>
                    );
                }

                if (!tokens?.accessToken) {
                    return <Redirect to="/login" />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default ProtectedRoute;
