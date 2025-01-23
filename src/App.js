import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update to Render backend URL after deployment

function App() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        socket.on('load messages', (msgs) => {
            setMessages(msgs);
        });

        socket.on('chat message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off();
    }, []);

    const sendMessage = () => {
        if (message) {
            const msgData = { username, message };
            socket.emit('chat message', msgData);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat Application</h2>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.username}:</strong> {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
s