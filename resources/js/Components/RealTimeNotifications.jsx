import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default function RealTimeNotifications() {
    const [notifications, setNotifications] = useState([]);
    const { auth } = usePage().props;

    useEffect(() => {
    if (!auth.user) return;

    console.log('Initializing Echo with config:', {
        key: import.meta.env.VITE_REVERB_APP_KEY,
        host: import.meta.env.VITE_REVERB_HOST,
        port: import.meta.env.VITE_REVERB_PORT
    });

    try {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        console.log('Echo initialized successfully');

        // Add connection event listeners for debugging
        if (
            window.Echo &&
            window.Echo.connector &&
            window.Echo.connector.socket &&
            window.Echo.connector.socket.on
        ) {
            window.Echo.connector.socket.on('connect', () => {
                console.log('WebSocket connected successfully');
            });

            window.Echo.connector.socket.on('error', (error) => {
                console.error('WebSocket connection error:', error);
            });
        } else {
            console.warn('Echo socket or connection is not available for event binding.');
        }

    } catch (error) {
        console.error('Failed to initialize Echo:', error);
    }

    // ... rest of the useEffect
}, [auth.user]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className="bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 w-80"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 text-gray-400 hover:text-gray-600 text-lg"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}