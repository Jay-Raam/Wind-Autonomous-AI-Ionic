/**
 * App Router Configuration
 */

import React, { useEffect } from 'react';
import {
    IonApp,
    IonSplitPane,
    IonMenu,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import {
    home,
    settingsOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../store';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CreateTaskPage from '../pages/CreateTaskPage';
import TaskDetailPage from '../pages/TaskDetailPage';
import SettingsPage from '../pages/SettingsPage';
import ToastContainer from '../components/Toast';


const AppContent: React.FC = () => {
    const { user, tokens, isInitialized } = useAuthStore();
    const location = useLocation();

    const isAuthPage =
        location.pathname === '/login' || location.pathname === '/register';

    const isAuthenticated = !!tokens?.accessToken;
    const showMenu = !!tokens?.accessToken && !isAuthPage;

    const renderAuthPage = (Component: React.ComponentType<any>, props: any) => {
        if (!isInitialized) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border border-t-2 border-primary mx-auto mb-4"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            );
        }

        if (isAuthenticated) {
            return <Redirect to="/dashboard" />;
        }

        return <Component {...props} />;
    };

    return (
        <IonSplitPane contentId="main">
            {showMenu && (
                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>AI Assistant</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            <IonMenuToggle auto-hide="false">
                                <IonItem routerLink="/dashboard" routerDirection="root">
                                    <IonIcon slot="start" icon={home} />
                                    <IonLabel>Dashboard</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                            <IonMenuToggle auto-hide="false">
                                <IonItem routerLink="/settings" routerDirection="root">
                                    <IonIcon slot="start" icon={settingsOutline} />
                                    <IonLabel>Settings</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        </IonList>

                        {user && (
                            <div className="p-4 border-t mt-4">
                                <div className="text-sm">
                                    <p className="text-gray-600">Signed in as</p>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-600 break-all">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </IonContent>
                </IonMenu>
            )}

            <IonRouterOutlet id="main">
                {/* Auth Routes */}
                <Route
                    path="/login"
                    exact
                    render={(props) => renderAuthPage(LoginPage, props)}
                />
                <Route
                    path="/register"
                    exact
                    render={(props) => renderAuthPage(RegisterPage, props)}
                />

                {/* Protected Routes */}
                <ProtectedRoute path="/dashboard" exact component={DashboardPage} />
                <ProtectedRoute path="/tasks/new" exact component={CreateTaskPage} />
                <ProtectedRoute
                    path="/tasks/:taskId([a-fA-F0-9]{24})"
                    exact
                    component={TaskDetailPage}
                />
                <ProtectedRoute path="/settings" exact component={SettingsPage} />

                {/* Catch-all redirect */}
                <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
                <Route render={() => <Redirect to="/dashboard" />} />
            </IonRouterOutlet>
        </IonSplitPane>
    );
};

const AppRouter: React.FC = () => {
    const { initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, []);

    return (
        <IonApp>
            <IonReactRouter>
                <AppContent />
            </IonReactRouter>

            {/* Toast Container */}
            <ToastContainer />
        </IonApp>
    );
};

export default AppRouter;
