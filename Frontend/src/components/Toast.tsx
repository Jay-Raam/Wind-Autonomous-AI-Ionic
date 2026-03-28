/**
 * Toast Notification Component
 */

import React from 'react';
import { IonToast } from '@ionic/react';
import { useUIStore } from '../store';

const ToastContainer: React.FC = () => {
    const { toasts } = useUIStore();

    return (
        <>
            {(toasts as any).map((toast: any) => (
                <IonToast
                    key={toast.id}
                    isOpen={true}
                    message={toast.message}
                    duration={toast.duration}
                    position="bottom"
                    color={
                        toast.type === 'error'
                            ? 'danger'
                            : toast.type === 'warning'
                                ? 'warning'
                                : toast.type === 'success'
                                    ? 'success'
                                    : 'primary'
                    }
                />
            ))}
        </>
    );
};

export default ToastContainer;
