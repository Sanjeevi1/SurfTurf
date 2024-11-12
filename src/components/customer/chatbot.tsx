'use client'
import React, { useState } from 'react'
import axios from 'axios'

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { sender: 'chatbot', text: 'Hello! How can I assist you with turf bookings today?' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false); // New state to track whether the chat is open

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;

        // Add user message
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: inputMessage },
        ]);
        setInputMessage('');

        try {
            // Call the backend to get a response
            const response = await axios.post('/api/chatbot', {
                message: inputMessage,
            });

            // Add chatbot response
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'chatbot', text: response.data.response },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const extractImageUrls = (text) => {
        // Regular expression to find URLs ending with image file extensions
        const urlRegex = /(https?:\/\/[^\s]+?(?:\.jpg|\.jpeg|\.png|\.gif))/g;
        return text.match(urlRegex);
    };

    return (
        <>
            {/* Floating icon when chat is closed */}
            {!isChatOpen && (
                <div
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-4 right-4 w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                >
                    <span>💬</span> {/* Chat icon */}
                </div>
            )}

            {/* Chat window */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg p-4 border border-gray-300">
                    <div className="h-96 overflow-y-auto space-y-4 mb-4 p-2">
                        {messages.map((msg, idx) => {
                            const imageUrls = extractImageUrls(msg.text);
                            const textWithoutImages = msg.text.replace(
                                /(https?:\/\/[^\s]+?(?:\.jpg|\.jpeg|\.png|\.gif))/g,
                                ''
                            );

                            return (
                                <div
                                    key={idx}
                                    className={`message ${msg.sender === 'chatbot' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                                        } p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'} transition-all ease-in-out duration-200`}
                                >
                                    <strong className="font-semibold">
                                        {msg.sender === 'chatbot' ? 'Bot' : 'You'}:
                                    </strong>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: textWithoutImages
                                                .replace(/\n/g, '<br />')
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                                        }}
                                    />
                                    {imageUrls && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {imageUrls.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt="Image"
                                                    className="w-full h-auto rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
                        >
                            Send
                        </button>
                    </div>

                    {/* Close button */}
                    <div
                        onClick={() => setIsChatOpen(false)}
                        className="absolute top-2 right-2 text-xl cursor-pointer text-gray-600"
                    >
                        ✖️
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
