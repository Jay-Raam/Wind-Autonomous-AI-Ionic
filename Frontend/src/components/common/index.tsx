/**
 * Common Reusable Components
 */

import React from 'react';
import {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonBadge,
    IonIcon,
    IonSpinner,
    IonButton,
    IonAlert,
} from '@ionic/react';
import {
    checkmarkCircle,
    closeCircle,
    hourglass,
    ellipsisHorizontal,
    documentOutline,
    helpCircleOutline,
} from 'ionicons/icons';
import { TaskStatus } from '../../types/index';
import { getStatusColor, formatDistanceToNow, truncateText } from '../../utils/common';

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const getIcon = () => {
        switch (status) {
            case 'completed':
                return checkmarkCircle;
            case 'failed':
                return closeCircle;
            case 'running':
                return hourglass;
            default:
                return ellipsisHorizontal;
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <IonIcon
                icon={getIcon()}
                color={getStatusColor(status)}
                className="text-lg"
            />
            <span className="capitalize font-medium">{status}</span>
        </div>
    );
};

interface LoadingCardProps {
    message?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
    message = 'Loading...',
}) => (
    <IonCard>
        <IonCardContent className="flex items-center justify-center py-8">
            <div className="text-center">
                <IonSpinner></IonSpinner>
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </IonCardContent>
    </IonCard>
);

interface ErrorCardProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry }) => (
    <IonCard className="border-l-4 border-danger">
        <IonCardContent>
            <h3 className="text-danger font-bold mb-2">Error</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            {onRetry && (
                <IonButton expand="block" color="danger" onClick={onRetry}>
                    Retry
                </IonButton>
            )}
        </IonCardContent>
    </IonCard>
);

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    icon?: string | typeof documentOutline;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    subtitle,
    icon = 'document-outline',
}) => {
    const resolvedIcon =
        typeof icon === 'string'
            ? icon === 'document-outline'
                ? documentOutline
                : helpCircleOutline
            : icon;

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <IonIcon icon={resolvedIcon} className="text-6xl text-gray-400 mb-4"></IonIcon>
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            {subtitle && <p className="text-gray-600 text-center mt-2">{subtitle}</p>}
        </div>
    );
};

interface TaskCardProps {
    taskId: string;
    title: string;
    status: TaskStatus;
    createdAt: string;
    onClick?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    taskId,
    title,
    status,
    createdAt,
    onClick,
}) => (
    <IonCard button onClick={() => onClick?.(taskId)}>
        <IonCardHeader>
            <div className="flex justify-between items-start">
                <IonCardTitle className="flex-1">{truncateText(title, 50)}</IonCardTitle>
            </div>
        </IonCardHeader>
        <IonCardContent>
            <div className="flex justify-between items-center">
                <StatusBadge status={status} />
                <span className="text-xs text-gray-500">
                    {formatDistanceToNow(createdAt)}
                </span>
            </div>
        </IonCardContent>
    </IonCard>
);

interface ConfirmAlertProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean;
}

export const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDangerous = false,
}) => (
    <IonAlert
        isOpen={isOpen}
        onDidDismiss={onCancel}
        header={title}
        message={message}
        buttons={[
            {
                text: cancelText,
                role: 'cancel',
                handler: onCancel,
            },
            {
                text: confirmText,
                role: isDangerous ? 'destructive' : undefined,
                handler: onConfirm,
            },
        ]}
    />
);
