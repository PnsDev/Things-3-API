console.log("Hello via Bun!");// Create WebSocket connection.


const socket = new WebSocket('https://0dc8-24-241-230-78.ngrok.io');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
    socket.close();
});