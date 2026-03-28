/**
 * Settings Page
 */

import React, { useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonRange,
    IonAlert,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack, logOut } from 'ionicons/icons';
import { useSettingsStore, useAuthStore } from '../store';
import { useToast, useAuthGuard } from '../hooks';
import { LoadingCard, ErrorCard } from '../components/common';
import { AiModel } from '../types/index';

const SettingsPage: React.FC = () => {
    const history = useHistory();
    const isAuthenticated = useAuthGuard();

    const { settings, isLoading, error, loadSettings, updateSettings } =
        useSettingsStore();
    const { logout, user, fetchCurrentUser } = useAuthStore();
    const toast = useToast();

    const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    useEffect(() => {
        if (!user) {
            fetchCurrentUser().catch(() => {
                // Auth guard and token interceptor handle navigation on auth failures.
            });
        }
    }, [fetchCurrentUser, user]);

    const handleAiModelChange = async (model: AiModel) => {
        try {
            await updateSettings({ aiModel: model });
            toast.success('AI model updated');
        } catch (err) {
            toast.error('Failed to update AI model');
        }
    };

    const handleTemperatureChange = async (temp: number) => {
        try {
            await updateSettings({ temperature: temp });
            toast.success('Temperature updated');
        } catch (err) {
            toast.error('Failed to update temperature');
        }
    };

    const handleToolApprovalChange = async (required: boolean) => {
        try {
            await updateSettings({ requireToolApproval: required });
            toast.success('Tool approval setting updated');
        } catch (err) {
            toast.error('Failed to update setting');
        }
    };

    const handleAutonomousModeChange = async (enabled: boolean) => {
        try {
            await updateSettings({ autonomousMode: enabled });
            toast.success('Autonomous mode updated');
        } catch (err) {
            toast.error('Failed to update setting');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            history.replace('/login');
        } catch (err) {
            toast.error('Failed to logout');
        }
    };

    if (!isAuthenticated) return null;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {isLoading && !settings ? (
                    <LoadingCard message="Loading settings..." />
                ) : error ? (
                    <ErrorCard error={error} onRetry={loadSettings} />
                ) : settings ? (
                    <div className="space-y-4">
                        {/* User Profile Card */}
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Profile</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="space-y-2">
                                    <div>
                                        <IonLabel className="text-sm text-gray-600">Name</IonLabel>
                                        <p className="font-semibold">{user?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <IonLabel className="text-sm text-gray-600">Email</IonLabel>
                                        <p className="font-semibold text-sm break-all">
                                            {user?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {/* AI Model Settings */}
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>AI Model</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem>
                                    <IonLabel>Model</IonLabel>
                                    <IonSelect
                                        value={settings.aiModel}
                                        onIonChange={(e) =>
                                            handleAiModelChange(e.detail.value as AiModel)
                                        }
                                    >
                                        <IonSelectOption value="wind-v2.5">
                                            Wind v2.5 (Latest)
                                        </IonSelectOption>
                                        <IonSelectOption value="wind-v2.0">
                                            Wind v2.0
                                        </IonSelectOption>
                                        <IonSelectOption value="deepthink-1.0">
                                            DeepThink v1.0
                                        </IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>

                        {/* Temperature Control */}
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Temperature</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem>
                                    <IonLabel slot="start">Temperature</IonLabel>
                                    <IonRange
                                        slot="end"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={settings.temperature}
                                        onIonChange={(e) =>
                                            handleTemperatureChange(e.detail.value as number)
                                        }
                                    />
                                </IonItem>
                                <div className="mt-3 p-3 bg-blue-50 rounded">
                                    <p className="text-xs text-gray-700">
                                        <strong>Current: {settings.temperature.toFixed(1)}</strong>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Lower values (0.3-0.6) produce more focused results. Higher
                                        values (0.7-1.0) produce more creative responses.
                                    </p>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {/* Tool Settings */}
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Tool Settings</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem>
                                    <IonLabel>Require Tool Approval</IonLabel>
                                    <IonToggle
                                        slot="end"
                                        checked={settings.requireToolApproval}
                                        onIonChange={(e) =>
                                            handleToolApprovalChange(e.detail.checked)
                                        }
                                    />
                                </IonItem>
                                <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-700">
                                    Require your approval before tools are executed
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {/* Autonomous Mode */}
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Autonomous Mode</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem>
                                    <IonLabel>Enable Autonomous Mode</IonLabel>
                                    <IonToggle
                                        slot="end"
                                        checked={settings.autonomousMode}
                                        onIonChange={(e) =>
                                            handleAutonomousModeChange(e.detail.checked)
                                        }
                                    />
                                </IonItem>
                                <div className="mt-3 p-3 bg-yellow-50 rounded text-xs text-gray-700">
                                    <strong>Warning:</strong> In autonomous mode, the AI will
                                    execute tools and make decisions without waiting for your
                                    approval.
                                </div>
                            </IonCardContent>
                        </IonCard>

                        {/* Logout Section */}
                        <div className="mt-8">
                            <IonButton
                                expand="block"
                                color="danger"
                                onClick={() => setShowLogoutAlert(true)}
                            >
                                <IonIcon icon={logOut} slot="start" />
                                Sign Out
                            </IonButton>
                        </div>
                    </div>
                ) : null}
            </IonContent>

            <IonAlert
                isOpen={showLogoutAlert}
                onDidDismiss={() => setShowLogoutAlert(false)}
                header="Sign Out"
                message="Are you sure you want to sign out?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Sign Out',
                        role: 'destructive',
                        handler: handleLogout,
                    },
                ]}
            />
        </IonPage>
    );
};

export default SettingsPage;
