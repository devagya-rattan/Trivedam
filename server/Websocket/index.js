import { WebSocketServer } from 'ws';
export let wss;
export const Websocket = (server) => {
    wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    console.log('WebSocket server is running');
}