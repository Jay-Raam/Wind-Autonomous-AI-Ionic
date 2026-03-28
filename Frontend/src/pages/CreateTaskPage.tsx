/**
 * Create/Edit Task Page
 */

import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonTextarea,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonNote,
    IonItem,
    IonLabel,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';
import { useTaskStore } from '../store';
import { useForm, useToast } from '../hooks';
import { CreateTaskInput } from '../types/index';

const CreateTaskPage: React.FC = () => {
    const history = useHistory();
    const { createTask, isLoading } = useTaskStore();
    const toast = useToast();
    const [characterCount, setCharacterCount] = useState(0);

    const form = useForm<{ input: string }>({
        input: '',
    });

    const handleInputChange = (value: string) => {
        form.setFieldValue('input', value);
        setCharacterCount(value.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.values.input.trim()) {
            toast.error('Please enter a task description');
            return;
        }

        try {
            const taskInput: CreateTaskInput = {
                input: form.values.input,
            };

            const newTask = await createTask(taskInput);
            toast.success('Task created successfully!');
            history.push(`/tasks/${newTask._id}`);
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>New Task</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <form onSubmit={handleSubmit}>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Describe Your Task</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="space-y-4">
                                <div>
                                    <IonLabel className="block mb-2 font-medium">
                                        Task Description
                                    </IonLabel>
                                    <IonTextarea
                                        placeholder="What would you like the AI to help you with?"
                                        value={form.values.input}
                                        onIonChange={(e) =>
                                            handleInputChange(e.detail.value || '')
                                        }
                                        rows={6}
                                        disabled={isLoading}
                                        className="border rounded-lg"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <IonNote>
                                            Be as detailed as possible for better results
                                        </IonNote>
                                        <IonNote>{characterCount}/10000</IonNote>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <IonButton
                                        expand="block"
                                        type="submit"
                                        disabled={isLoading || !form.values.input.trim()}
                                    >
                                        {isLoading ? 'Creating Task...' : 'Create Task'}
                                    </IonButton>
                                    <IonButton
                                        expand="block"
                                        fill="outline"
                                        onClick={() => history.goBack()}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </IonButton>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default CreateTaskPage;
