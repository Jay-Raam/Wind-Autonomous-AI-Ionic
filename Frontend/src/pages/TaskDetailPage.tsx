/**
 * Task Detail Page
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
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonNote,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { arrowBack, refresh as refreshIcon, copy } from 'ionicons/icons';
import { useTaskStore } from '../store';
import { useToast, useAuthGuard, usePollTask } from '../hooks';
import {
    LoadingCard,
    ErrorCard,
    StatusBadge,
    EmptyState,
} from '../components/common';
import { formatDate, formatBytes } from '../utils/common';

const TaskDetailPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const validTaskId = taskId && /^[a-fA-F0-9]{24}$/.test(taskId) ? taskId : null;
    const history = useHistory();
    const isAuthenticated = useAuthGuard();

    const {
        selectedTask,
        agents,
        tools,
        isLoading,
        error,
        getTaskById,
        listAgentsByTask,
        listToolsByTask,
    } = useTaskStore();

    const toast = useToast();
    const { isPolling } = usePollTask(validTaskId, 2000);

    useEffect(() => {
        if (validTaskId) {
            loadTaskDetails();
        }
    }, [validTaskId]);

    const loadTaskDetails = async () => {
        if (!validTaskId) return;
        try {
            await Promise.all([
                getTaskById(validTaskId),
                listAgentsByTask(validTaskId),
                listToolsByTask(validTaskId),
            ]);
        } catch (err) {
            toast.error('Failed to load task details');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const handleRefresh = async () => {
        await loadTaskDetails();
    };

    if (!isAuthenticated) return null;

    if (isLoading && !selectedTask) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                        <IonTitle>Task Details</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <LoadingCard message="Loading task details..." />
                </IonContent>
            </IonPage>
        );
    }

    if (error && !selectedTask) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                        <IonTitle>Task Details</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <ErrorCard error={error} onRetry={loadTaskDetails} />
                </IonContent>
            </IonPage>
        );
    }

    if (!selectedTask) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                        <IonTitle>Task Details</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <EmptyState title="Task not found" />
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" fill="clear" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Task Details</IonTitle>
                    <div className="flex gap-2" slot="end">
                        {isPolling && (
                            <IonNote className="text-xs text-warning">Updating...</IonNote>
                        )}
                        <IonButton fill="clear" onClick={handleRefresh} disabled={isLoading}>
                            <IonIcon icon={refreshIcon} />
                        </IonButton>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div className="space-y-4">
                    {/* Task Status Card */}
                    <IonCard>
                        <IonCardHeader>
                            <div className="flex justify-between items-start">
                                <IonCardTitle>Status</IonCardTitle>
                            </div>
                        </IonCardHeader>
                        <IonCardContent>
                            <StatusBadge status={selectedTask.status} className="text-lg" />
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-medium">
                                        {formatDate(selectedTask.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Updated:</span>
                                    <span className="font-medium">
                                        {formatDate(selectedTask.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    {/* Task Input */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Input</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {selectedTask.input}
                                </p>
                            </div>
                            <IonButton
                                expand="block"
                                fill="outline"
                                size="small"
                                onClick={() => handleCopy(selectedTask.input)}
                                className="mt-3"
                            >
                                <IonIcon icon={copy} slot="start" />
                                Copy
                            </IonButton>
                        </IonCardContent>
                    </IonCard>

                    {/* Task Result */}
                    {selectedTask.result && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Result</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {selectedTask.result}
                                    </p>
                                </div>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    size="small"
                                    onClick={() => handleCopy(selectedTask.result!)}
                                    className="mt-3"
                                >
                                    <IonIcon icon={copy} slot="start" />
                                    Copy Result
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Error */}
                    {selectedTask.error && (
                        <IonCard className="border-l-4 border-danger">
                            <IonCardHeader>
                                <IonCardTitle color="danger">Error</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-danger whitespace-pre-wrap">
                                        {selectedTask.error}
                                    </p>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Token Usage */}
                    {selectedTask.tokenUsage && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Token Usage</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Prompt Tokens:</span>
                                        <span className="font-bold">
                                            {selectedTask.tokenUsage.promptTokens}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completion Tokens:</span>
                                        <span className="font-bold">
                                            {selectedTask.tokenUsage.completionTokens}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between">
                                        <span className="text-gray-600 font-medium">Total Tokens:</span>
                                        <span className="font-bold text-lg">
                                            {selectedTask.tokenUsage.totalTokens}
                                        </span>
                                    </div>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Attachment */}
                    {selectedTask.attachment && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Attachment</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem lines="none">
                                    <IonLabel>
                                        <h3 className="font-semibold">
                                            {selectedTask.attachment.fileName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {selectedTask.attachment.kind.toUpperCase()} •{' '}
                                            {formatBytes(selectedTask.attachment.size)}
                                        </p>
                                    </IonLabel>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Agents */}
                    {agents.length > 0 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Agents ({agents.length})</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonAccordionGroup>
                                    {agents.map((agent) => (
                                        <IonAccordion key={agent._id} value={agent._id}>
                                            <IonItem slot="header">
                                                <IonLabel>
                                                    <h3 className="font-semibold">{agent.name}</h3>
                                                </IonLabel>
                                                <StatusBadge status={agent.status} className="text-sm" />
                                            </IonItem>
                                            <div slot="content" className="p-4">
                                                {agent.output && (
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                            {agent.output}
                                                        </p>
                                                    </div>
                                                )}
                                                <IonNote className="block mt-3">
                                                    {formatDate(agent.createdAt)}
                                                </IonNote>
                                            </div>
                                        </IonAccordion>
                                    ))}
                                </IonAccordionGroup>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Tools */}
                    {tools.length > 0 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Tools ({tools.length})</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonAccordionGroup>
                                    {tools.map((tool) => (
                                        <IonAccordion key={tool._id} value={tool._id}>
                                            <IonItem slot="header">
                                                <IonLabel>
                                                    <h3 className="font-semibold">{tool.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {tool.query.substring(0, 50)}...
                                                    </p>
                                                </IonLabel>
                                                <StatusBadge status={tool.status as any} className="text-sm" />
                                            </IonItem>
                                            <div slot="content" className="p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-600 mb-2">
                                                            Query:
                                                        </p>
                                                        <p className="text-sm text-gray-800">{tool.query}</p>
                                                    </div>
                                                    {tool.result && (
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-600 mb-2">
                                                                Result:
                                                            </p>
                                                            <p className="text-sm text-gray-800">
                                                                {tool.result.substring(0, 200)}
                                                                {tool.result.length > 200 ? '...' : ''}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </IonAccordion>
                                    ))}
                                </IonAccordionGroup>
                            </IonCardContent>
                        </IonCard>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default TaskDetailPage;
