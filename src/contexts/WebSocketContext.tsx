'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (screenId: number, callback: (seats: Seat[]) => void) => () => void;
}

interface Seat {
  id: number;
  available: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  subscribe: () => () => {},
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [subscribers] = useState<Map<number, Set<(seats: Seat[]) => void>>>(new Map());

  useEffect(() => {
    // Get the WebSocket URL from environment or use a default for local development
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4001';
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        setWs(null);
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        const { event: eventType, data } = JSON.parse(event.data);
        if (eventType === 'seatUpdate' && data.screenId && data.seats) {
          const callbacks = subscribers.get(data.screenId);
          if (callbacks) {
            callbacks.forEach(callback => callback(data.seats));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const subscribe = (screenId: number, callback: (seats: Seat[]) => void) => {
    if (!subscribers.has(screenId)) {
      subscribers.set(screenId, new Set());
    }
    subscribers.get(screenId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = subscribers.get(screenId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          subscribers.delete(screenId);
        }
      }
    };
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
