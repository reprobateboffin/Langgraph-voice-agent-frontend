import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types/interview';

interface ChatInterfaceProps {
  candidateName: string;
  jobTitle: string;
  cvFilename: string;
  questionStyle: string;
  threadId: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onShowReport: (finalReport: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  candidateName,
  jobTitle,
  cvFilename,
  questionStyle,
  threadId,
  messages,
  onSendMessage,
  onShowReport,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Interview: {jobTitle}</h1>
        <div className="interview-info">
          <p><strong>Candidate:</strong> {candidateName || 'Not set'}</p>
          <p><strong>CV:</strong> {cvFilename}</p>
          <p><strong>Question Style:</strong> {questionStyle}</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your answer..."
          disabled={messages[messages.length - 1]?.content === '*Thinking...*'}
        />
        <button type="submit" disabled={!inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;