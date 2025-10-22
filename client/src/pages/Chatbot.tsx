import React from 'react';
import Chatbot from '../components/customer/chatbot';

const ChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Chat with our AI Assistant
        </h1>
        <div className="text-center">
          <p className="text-gray-600 mb-8">
            Get instant help with turf bookings, availability, and any questions you might have.
          </p>
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
