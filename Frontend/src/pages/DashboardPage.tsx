/**
 * Dashboard Page - Main Task Management Screen
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { add, refresh as refreshIcon, settings } from 'ionicons/icons';
import { useTaskStore } from '../store';
import { useToast, useAuthGuard } from '../hooks';
import { TaskCard, LoadingCard, ErrorCard, EmptyState } from '../components/common';
import { TaskStatus } from '../types/index';

const DashboardPage: React.FC = () => {
    const history = useHistory();
    const isAuthenticated = useAuthGuard();

    const { tasks, isLoading, error, listTasks } = useTaskStore();
    const toast = useToast();

    const [filterStatus, setFilterStatus] = React.useState<TaskStatus | 'all'>('all');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            await listTasks();
        } catch (err) {
            toast.error('Failed to load tasks');
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await loadTasks();
        (event.target as any).complete();
    };

    const handleTaskClick = (taskId: string) => {
        history.push(`/tasks/${taskId}`);
    };

    const handleCreateTask = () => {
        history.push('/tasks/new');
    };

    if (!isAuthenticated) return null;

    const filteredTasks =
        filterStatus === 'all'
            ? tasks
            : tasks.filter((t) => t.status === filterStatus);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tasks</IonTitle>
                    <div className="flex gap-2" slot="end">
                        <IonButton fill="clear" onClick={() => history.push('/settings')}>
                            <IonIcon icon={settings} />
                        </IonButton>
                        <IonButton fill="clear" onClick={loadTasks} disabled={isLoading}>
                            <IonIcon icon={refreshIcon} />
                        </IonButton>
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent />
                </IonRefresher>

                <div className="ion-padding">
                    {/* Filter Segment */}
                    <IonSegment value={filterStatus} onIonChange={(e) => setFilterStatus(e.detail.value as any)}>
                        <IonSegmentButton value="all">
                            <IonLabel>All</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="pending">
                            <IonLabel>Pending</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="running">
                            <IonLabel>Running</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="completed">
                            <IonLabel>Done</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {/* Content */}
                    <div className="mt-6">
                        {isLoading && !tasks.length ? (
                            <LoadingCard message="Loading tasks..." />
                        ) : error ? (
                            <ErrorCard error={error} onRetry={loadTasks} />
                        ) : (filteredTasks as any).length === 0 ? (
                            <EmptyState
                                title="No tasks found"
                                subtitle={
                                    filterStatus !== 'all'
                                        ? `No ${filterStatus} tasks yet`
                                        : 'Create your first task to get started'
                                }
                                icon="document-outline"
                            />
                        ) : (
                            <div className="space-y-3">
                                {(filteredTasks as any).map((task: any) => (
                                    <TaskCard
                                        key={task._id}
                                        taskId={task._id}
                                        title={task.input}
                                        status={task.status}
                                        createdAt={task.createdAt}
                                        onClick={handleTaskClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Action Button */}
                <IonButton
                    className="fab-bottom-right"
                    shape="round"
                    onClick={handleCreateTask}
                    fill="solid"
                    color="primary"
                >
                    <IonIcon icon={add} />
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default DashboardPage;
