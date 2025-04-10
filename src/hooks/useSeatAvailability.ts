'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { Seat } from '@/types/types';

export const useSeatAvailability = () => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const { socket, isConnected } = useWebSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Join the room for this screen
        socket.emit('join', 'screen:1');

        const handleSeatUpdate = (data: { seats: Seat[] }) => {
            setSeats(data.seats);
        };

        socket.on('seatUpdate', handleSeatUpdate);

        return () => {
            socket.off('seatUpdate', handleSeatUpdate);
            // Leave the room when component unmounts
            socket.emit('leave', 'screen:1');
        };
    }, [socket, isConnected]);

    return seats;
};