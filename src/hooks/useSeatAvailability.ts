'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Seat } from '@/types/types';

export const useSeatAvailability = (screenId: number = 1) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to seat updates for this screen
    const unsubscribe = subscribe(screenId, (updatedSeats) => {
      setSeats(updatedSeats);
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe, screenId]);

  return seats;
};
