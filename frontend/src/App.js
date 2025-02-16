import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
    const [query, setQuery] = useState("");
    const [history, setHistory] = useState([]);

    // Send the user message to the backend
    const sendMessage = async () => {
        if (!query.trim()) return;

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/chat/", {
                query,
                history
            });
            setHistory(response.data.history);
            setQuery("");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Styling for the overall chat container
    const chatContainerStyle = {
        border: "1px solid gray",
        padding: "10px",
        height: "400px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
    };

    // Bubble styling
    const userBubbleStyle = {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px",
        borderRadius: "10px",
        margin: "5px 0",
        maxWidth: "60%",
        whiteSpace: "pre-wrap"
    };

    const aiBubbleStyle = {
        backgroundColor: "#e0e0e0",
        color: "#000",
        padding: "10px",
        borderRadius: "10px",
        margin: "5px 0",
        maxWidth: "60%",
        whiteSpace: "pre-wrap"
    };

    return (
        <div style={{ width: "50%", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
            <h2>AI-Powered Q&A Chat</h2>

            {/* Chat History */}
            <div style={chatContainerStyle}>
                {history.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: isUser ? "flex-end" : "flex-start"
                            }}
                        >
                            <div style={isUser ? userBubbleStyle : aiBubbleStyle}>
                                <strong>{isUser ? "You: " : "AI: "}</strong>{" "}
                                {/* Render Markdown content (including code blocks) */}
                                <ReactMarkdown
                                    children={msg.content}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return !inline ? (
                                                <SyntaxHighlighter
                                                    style={duotoneDark}
                                                    language={match ? match[1] : "bash"}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input & Send Button */}
            <div style={{ display: "flex", marginTop: "10px" }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: "10px" }}
                />
                <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "10px" }}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default App;
