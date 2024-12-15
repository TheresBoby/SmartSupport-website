import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessageToLlama = async (userMessage) => {
    try {
      setIsLoading(true);
      // Replace with your actual Llama 3 backend endpoint
      const response = await axios.post('YOUR_LLAMA_3_BACKEND_URL', {
        message: userMessage
      });
      
      return response.data.reply; // Adjust based on your backend response
    } catch (error) {
      console.error('Chatbot error:', error);
      return 'Sorry, I couldn\'t process your message right now.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Add user message to chat history
      const userMessage = { sender: 'user', text: message };
      setChatHistory(prev => [...prev, userMessage]);
      
      // Clear input
      setMessage('');

      // Get bot response
      const botReply = await sendMessageToLlama(message);

      // Add bot response to chat history
      const botMessage = { sender: 'bot', text: botReply };
      setChatHistory(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot Icon */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 border-2 border-black rounded-full bg-beige shadow-lg hover:bg-gray-100 transition-all"
        >
          <MessageCircle size={24} color="black" strokeWidth={1.5} />
        </button>
      )}

      {/* Chatbot Popup */}
      {isOpen && (
        <div 
          className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-white 
          border-2 border-black rounded-t-xl shadow-2xl flex flex-col"
        >
          {/* Popup Header */}
          <div className="bg-beige p-4 flex justify-between items-center border-b border-black">
            <h3 className="font-bold text-lg">Customer Support</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-200 p-1 rounded"
            >
              <X size={24} color="black" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${
                  msg.sender === 'user' 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div 
                  className={`
                    max-w-[70%] p-3 rounded-lg
                    ${msg.sender === 'user' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-black'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500 animate-pulse">
                Typing...
              </div>
            )}
            <div ref={chatEndRef} /> {/* For auto-scrolling */}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-black flex items-center space-x-2">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-black rounded-l"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-black text-white p-2 rounded-r hover:bg-gray-800"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPopup;