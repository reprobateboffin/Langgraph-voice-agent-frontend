import React, { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewStore } from "../store/interviewStore";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/MessageScreen.css";

const SpeechRecognitionConstructor =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const MessageScreenVoice: React.FC = () => {
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    threadId,
    addMessage,
    addQaPair,
    interviewStarted,
    setFinalEvaluation,
    setFeedbackList,
  } = useInterviewStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!interviewStarted || !threadId) {
      setError("Interview not started or missing thread ID");
      return;
    }

    if (!SpeechRecognitionConstructor) {
      setError(
        "Speech Recognition is not supported in your browser. Please use Chrome or Edge.",
      );
      return;
    }

    initializeSpeechRecognition();

    return () => {
      cleanupSpeechRecognition();
      cleanupSpeechSynthesis();
    };
  }, [threadId, interviewStarted]);

  const initializeSpeechRecognition = useCallback(() => {
    try {
      const recognition =
        new SpeechRecognitionConstructor() as SpeechRecognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setListening(true);
        setError(null);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);

        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          setPermissionDenied(true);
          setError(
            "Microphone permission denied. Please allow microphone access and refresh the page.",
          );
        } else if (event.error === "network") {
          setError("Network error occurred. Please check your connection.");
        } else if (event.error === "no-speech") {
          console.log("No speech detected, restarting...");
          setTimeout(() => {
            if (recognitionRef.current) {
              startListening();
            }
          }, 1000);
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        try {
          const transcript = event.results[0][0].transcript;
          console.log("Speech recognized:", transcript);
          await handleVoiceInput(transcript);
        } catch (err) {
          console.error("Error processing speech result:", err);
          setError("Error processing voice input");
        }
      };

      recognition.onnomatch = () => {
        console.log("No speech recognition match");
        // Restart listening if no match found
        setTimeout(() => {
          startListening();
        }, 500);
      };

      recognitionRef.current = recognition;
      startListening();
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setError("Failed to initialize speech recognition");
    }
  }, []);

  const cleanupSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current.onnomatch = null;

      try {
        recognitionRef.current.stop();
      } catch (err) {}
      recognitionRef.current = null;
    }
  }, []);

  const cleanupSpeechSynthesis = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (synthesisRef.current) {
      synthesisRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening || isTyping || permissionDenied) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setTimeout(() => {
        cleanupSpeechRecognition();
        initializeSpeechRecognition();
      }, 1000);
    }
  }, [
    listening,
    isTyping,
    permissionDenied,
    cleanupSpeechRecognition,
    initializeSpeechRecognition,
  ]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
  }, [listening]);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) {
        console.error("Speech synthesis not supported");
        startListening();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log("Speech synthesis started");
        stopListening();
      };

      utterance.onend = () => {
        console.log("Speech synthesis ended");
        setTimeout(() => {
          startListening();
        }, 500);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setTimeout(() => {
          startListening();
        }, 500);
      };

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [startListening, stopListening],
  );

  const handleVoiceInput = async (userMsg: string) => {
    if (!userMsg.trim() || !threadId) {
      console.error("Empty message or missing thread ID");
      startListening();
      return;
    }

    console.log("Processing voice input:", userMsg);

    stopListening();

    const lastAssistantQuestion =
      messages.length > 0 && messages[messages.length - 1]?.role === "assistant"
        ? messages[messages.length - 1].content
        : "";

    addMessage({ role: "user", content: userMsg, threadId });
    setIsTyping(true);
    setError(null);

    try {
      const response = await api.continueInterview(userMsg, threadId);
      console.log("API response:", response);

      if (response.feedback_list) {
        setFeedbackList(response.feedback_list);
        setFinalEvaluation(response.final_evaluation);
        cleanupSpeechRecognition();
        cleanupSpeechSynthesis();
        navigate("/feedback");
        return;
      }

      const assistantMsg = response.message || "No response from backend";

      addMessage({
        role: "assistant",
        content: assistantMsg,
        threadId: response.thread_id || threadId,
      });

      if (lastAssistantQuestion) {
        addQaPair({
          question: lastAssistantQuestion,
          answer: userMsg,
        });
      }

      setIsTyping(false);

      // Speak the assistant's response
      speak(assistantMsg);
    } catch (err) {
      console.error("API error:", err);
      setIsTyping(false);
      const errorMsg = "Sorry, I encountered an error. Please try again.";
      setError(errorMsg);
      addMessage({ role: "assistant", content: errorMsg, threadId });

      setTimeout(() => {
        startListening();
      }, 2000);
    }
  };

  const handleRetryMicrophone = () => {
    setPermissionDenied(false);
    setError(null);
    cleanupSpeechRecognition();
    setTimeout(() => {
      initializeSpeechRecognition();
    }, 500);
  };

  const handleManualStartListening = () => {
    if (permissionDenied) {
      handleRetryMicrophone();
    } else {
      startListening();
    }
  };

  if (!interviewStarted) {
    return (
      <div className="message-screen">
        <div className="error-message">Please start the interview first.</div>
      </div>
    );
  }

  if (!threadId) {
    return (
      <div className="message-screen">
        <div className="error-message">
          No interview session found. Please start a new interview.
        </div>
      </div>
    );
  }

  return (
    <div className="message-screen">
      <div className="chat-header">
        <h2>Interview Chat (Voice)</h2>
        <div className="controls">
          <button
            onClick={handleManualStartListening}
            disabled={listening || isTyping || permissionDenied}
            className="control-button"
          >
            🎤 Start Listening
          </button>
          <button
            onClick={stopListening}
            disabled={!listening}
            className="control-button"
          >
            ⏸️ Stop Listening
          </button>
          <button
            onClick={handleRetryMicrophone}
            className="control-button retry-button"
          >
            🔄 Retry Microphone
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`error-message ${permissionDenied ? "permission-error" : ""}`}
        >
          {error}
          {permissionDenied && (
            <div>
              <button onClick={handleRetryMicrophone} className="retry-button">
                Grant Permission & Retry
              </button>
            </div>
          )}
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="message-bubble assistant typing-bubble">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {listening && (
          <div className="listening-indicator">🎤 Listening... Speak now</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="status-bar">
        <div
          className={`status ${listening ? "listening" : ""} ${isTyping ? "typing" : ""}`}
        >
          Status:
          {listening && " 🎤 Listening"}
          {isTyping && " 💭 Processing"}
          {!listening && !isTyping && " ✅ Ready"}
        </div>
        {permissionDenied && (
          <div className="permission-warning">
            ⚠️ Microphone access required
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageScreenVoice;
