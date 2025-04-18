'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { Seat } from '@/types/types';

export const useSeatAvailability = () => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const { socket, isConnected } = useWebSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleSeatUpdate = (data: { seats: Seat[] }) => {
            setSeats(data.seats);
        };

        socket.emit('join', 'screen:1');
        socket.on('seatUpdate', handleSeatUpdate);

        return () => {
            socket.emit('leave', 'screen:1');
            socket.off('seatUpdate', handleSeatUpdate);
        };
    }, [socket, isConnected]);

    return seats;
};