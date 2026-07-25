import React, { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAssistant = async (event) => {
    event.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-ka-backend.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get answer");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "Unable to answer right now. Check that the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="welcome-text">Knowledge-Powered Assistance</p>
          <h1>AI Assistant</h1>
          <p className="subtitle">
            Ask questions and get answers from your saved knowledge.
          </p>
        </div>
      </header>

      <section className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="ai-chat-logo">
            <Sparkles size={24} />
          </div>

          <div>
            <h2>AI-KA Assistant</h2>
            <p>Connected to your MongoDB knowledge base</p>
          </div>
        </div>

        <div className="ai-messages">
          {messages.length === 0 && (
            <div className="ai-empty-state">
              <Bot size={45} />

              <h2>Ask your knowledge base</h2>

              <p>
                Example: What is Word2Vec? What did I save about Java?
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              className={`chat-message ${message.role}`}
              key={index}
            >
              <div className="chat-avatar">
                {message.role === "user" ? (
                  <User size={19} />
                ) : (
                  <Bot size={19} />
                )}
              </div>

              <div className="chat-content">
                <p>{message.text}</p>

                {message.sources?.length > 0 && (
                  <div className="ai-sources">
                    Sources: {message.sources.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <div className="chat-avatar">
                <Bot size={19} />
              </div>

              <div className="chat-content">
                <p>Searching your knowledge...</p>
              </div>
            </div>
          )}
        </div>

        <form className="ai-input-area" onSubmit={askAssistant}>
          <input
            type="text"
            placeholder="Ask something about your saved notes..."
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            <Send size={19} />
          </button>
        </form>
      </section>
    </main>
  );
}

export default AIAssistant;