
import React, { useState, useEffect, useRef } from "react";
import { useInterviewStore } from "../store/interviewStore";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./MessageScreen.css";

const MessageScreen: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const {
    messages,
    threadId,
    addMessage,
    addQaPair,
    interviewStarted,
    setFinalEvaluation,
    setFeedbackList
  } = useInterviewStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!interviewStarted) return <div>Please start the interview first.</div>;

  const sendMessage = async () => {
    if (!input.trim() || !threadId) return;

    const userMsg = input.trim();

    const lastAssistantQuestion =
      messages[messages.length - 1]?.role === "assistant"
        ? messages[messages.length - 1].content
        : "";

    addMessage({ role: "user", content: userMsg, threadId });
    setInput("");

    setIsTyping(true);

    try {
      const response = await api.continueInterview(userMsg, threadId);

      if (response.feedback_list) {
        setFeedbackList(response.feedback_list);
        setFinalEvaluation(response.final_evaluation);
        navigate("/feedback");
        return;
      }

      setIsTyping(false);

      addMessage({
        role: "assistant",
        content: response.message || "No response from backend",
        threadId: response.thread_id,
      });

      addQaPair({
        question: lastAssistantQuestion,
        answer: userMsg,
      });
    } catch (err) {
      setIsTyping(false);
      addMessage({
        role: "assistant",
        content: `Error: ${err}`,
        threadId,
      });
    }
  };

  return (
    <div className="message-screen">
      <h2 className="chat-header">Interview Chat</h2>

      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="message-bubble assistant typing-bubble">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageScreen;
