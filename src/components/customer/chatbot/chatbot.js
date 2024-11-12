'use client'
import { useState } from "react";
import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import MessageParser from "./messageparser";
import ActionProvider from "./actionprovider";
import config from "./config";

export default function TurfChatbot() {
    const [showChat, setShowChat] = useState(false)

    return (
        <div className="chatbot-container text-black">
            {showChat && <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />}
            <button onClick={() => setShowChat(!showChat)} className="chatbot-toggle  ">
                {showChat ? "Hide" : "Chat with us"}
            </button>
        </div>
    );
}
