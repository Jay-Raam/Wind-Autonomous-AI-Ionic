/**
 * Login Page
 */

import React, { useState } from 'react';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useForm, useToast } from '../hooks';

interface LoginForm {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const { login, isLoading, error } = useAuthStore();
    const toast = useToast();

    const form = useForm<LoginForm>({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.values.email || !form.values.password) {
            toast.error('Please fill in all fields');
            return;
        }

        console.log(form.values.email, form.values.password);


        try {
            await login(form.values.email, form.values.password);
            toast.success('Login successful!');

            // Redirect to intended page or dashboard
            history.push('/dashboard');
        } catch (err) {
            toast.error(error || 'Login failed. Please try again.');
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <IonCard className="w-full max-w-md">
                        <IonCardHeader className="text-center">
                            <div className="mb-4 text-4xl font-bold text-primary">AI</div>
                            <IonCardTitle>Welcome Back</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-2">Email</label>
                                    <IonInput
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={form.values.email}
                                        onIonChange={(e) =>
                                            form.setFieldValue('email', e.detail.value)
                                        }
                                        disabled={isLoading}
                                        className={form.errors.email ? 'ion-invalid' : ''}
                                    />
                                    {form.errors.email && (
                                        <IonText color="danger" className="text-xs">
                                            {form.errors.email}
                                        </IonText>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-2">Password</label>
                                    <IonInput
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.values.password}
                                        onIonChange={(e) =>
                                            form.setFieldValue('password', e.detail.value)
                                        }
                                        disabled={isLoading}
                                        className={form.errors.password ? 'ion-invalid' : ''}
                                    />
                                    {form.errors.password && (
                                        <IonText color="danger" className="text-xs">
                                            {form.errors.password}
                                        </IonText>
                                    )}
                                </div>

                                {error && (
                                    <IonText color="danger" className="block">
                                        {error}
                                    </IonText>
                                )}

                                <IonButton
                                    expand="block"
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-6"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </IonButton>
                            </form>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">Don't have an account?</p>
                                <IonButton
                                    fill="clear"
                                    onClick={() => history.push('/register')}
                                    disabled={isLoading}
                                >
                                    Create One
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;
