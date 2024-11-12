import axios from 'axios';

class ActionProvider {
    constructor(createChatbotMessage, setStateFunc) {
        this.createChatbotMessage = createChatbotMessage;
        this.setState = setStateFunc;
    }

    async handleUserMessage(message) {
        // Call the API to process the user message
        try {
            const response = await axios.post("/api/chatbot", { message });

            const botMessage = this.createChatbotMessage(response.data.response);
            this.updateChatbotState(botMessage);
        } catch (error) {
            console.error("Error fetching bot response", error);
        }
    }

    updateChatbotState(message) {
        this.setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message],
        }));
    }
}

export default ActionProvider;
