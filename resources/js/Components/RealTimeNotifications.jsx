import { useState } from 'react';
import useWebSocket from '@/Hooks/useWebSocket';

export default function RealTimeNotifications() {
    const [notifications, setNotifications] = useState([]);
    const { auth } = usePage().props;

    const handleNewBooking = (data) => {
        setNotifications(prev => [
            ...prev,
            {
                id: Date.now(),
                type: 'booking',
                message: `New booking: ${data.booking.reference} for ${data.booking.hotel.name}`,
                data: data.booking
            }
        ]);
    };

    // Listen for admin notifications
    useWebSocket('admin.bookings', 'NewBookingCreated', handleNewBooking);

    // Listen for user-specific notifications
    useWebSocket(`user.${auth.user?.id}.bookings`, 'NewBookingCreated', handleNewBooking);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4 w-80 animate-fade-in"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.data.created_at).toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}