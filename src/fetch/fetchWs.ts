import io from 'socket.io-client';

export const fetchWs = async () => {
    const socket = io('http://localhost:3000', {
        path: '/api/ws',
        addTrailingSlash: false,
        transports: ['websocket']
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            resolve(socket);
        });

        socket.on('connect_error', (error) => {
            reject(error);
        });
    });
};