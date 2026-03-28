/**
 * Register Page
 */

import React from 'react';
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
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useForm, useToast } from '../hooks';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: React.FC = () => {
    const history = useHistory();
    const { register, isLoading, error } = useAuthStore();
    const toast = useToast();

    const form = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!form.values.name || !form.values.email || !form.values.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (form.values.password !== form.values.confirmPassword) {
            form.setFieldError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (form.values.password.length < 6) {
            form.setFieldError('password', 'Password must be at least 6 characters');
            return;
        }

        try {
            await register(form.values.email, form.values.name, form.values.password);
            toast.success('Account created successfully!');
            history.replace('/dashboard');
        } catch (err) {
            toast.error(error || 'Registration failed. Please try again.');
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <IonCard className="w-full max-w-md">
                        <IonCardHeader className="text-center">
                            <div className="mb-4 text-4xl font-bold text-primary">AI</div>
                            <IonCardTitle>Create Account</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-2">Full Name</label>
                                    <IonInput
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.values.name}
                                        onIonChange={(e) => form.setFieldValue('name', e.detail.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-2">Email</label>
                                    <IonInput
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={form.values.email}
                                        onIonChange={(e) => form.setFieldValue('email', e.detail.value)}
                                        disabled={isLoading}
                                    />
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
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-2">
                                        Confirm Password
                                    </label>
                                    <IonInput
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.values.confirmPassword}
                                        onIonChange={(e) =>
                                            form.setFieldValue('confirmPassword', e.detail.value)
                                        }
                                        disabled={isLoading}
                                    />
                                    {form.errors.confirmPassword && (
                                        <IonText color="danger" className="text-xs">
                                            {form.errors.confirmPassword}
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
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </IonButton>
                            </form>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">Already have an account?</p>
                                <IonButton
                                    fill="clear"
                                    onClick={() => history.replace('/login')}
                                    disabled={isLoading}
                                >
                                    Sign In
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default RegisterPage;
