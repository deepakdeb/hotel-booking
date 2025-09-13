import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

export default function useWebSocket(channel, event, callback) {
    const { auth } = usePage().props;
    const socketRef = useRef(null);

    useEffect(() => {
        if (!auth.user) return;

        // Initialize Echo
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        socketRef.current = window.Echo.private(channel).listen(event, callback);

        return () => {
            if (socketRef.current) {
                socketRef.current.stopListening(event);
                window.Echo.leave(channel);
            }
        };
    }, [auth.user, channel, event, callback]);
}