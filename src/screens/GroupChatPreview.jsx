import React, { useState, useRef } from "react";
import "./GroupChatPreview.css";

const dummyChats = [
  { id: 1, name: "Study Group 📚", lastMessage: "Let’s meet at 6pm", time: "9:45 AM" },
  { id: 2, name: "React Devs 💻", lastMessage: "UseEffect fix deployed", time: "8:12 AM" },
  { id: 3, name: "Exam Prep 🔥", lastMessage: "Mock test link shared", time: "Yesterday" },
  { id: 4, name: "Math Class 🧮", lastMessage: "HW due tomorrow", time: "Yesterday" },
];

function GroupChatPreview() {
  const containerRef = useRef(null);
  const [startY, setStartY] = useState(null);
  const [showReleaseText, setShowReleaseText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const scroll = containerRef.current;

    const isAtBottom =
      scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight;

    const dragDistance = startY - currentY;

    if (isAtBottom && dragDistance > 50) {
      setShowReleaseText(true);
    } else {
      setShowReleaseText(false);
    }
  };

  const handleTouchEnd = () => {
    if (showReleaseText && !isLoading && !callStarted) {
      setShowReleaseText(false);
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setCallStarted(true);
        alert("📞 Group Call Started!");
      }, 10000);
    } else {
      setShowReleaseText(false);
    }
  };

return (
  <div
    className="chat-preview-container"
    ref={containerRef}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {dummyChats.map((chat) => (
      <div className="chat-card" key={chat.id}>
        <div className="chat-title">{chat.name}</div>
        <div className="chat-last">{chat.lastMessage}</div>
        <div className="chat-time">{chat.time}</div>
      </div>
    ))}

    {/* Bottom drag area feedback */}
    {(showReleaseText || isLoading) && (
      <div className="bottom-loader">
        {isLoading ? "⏳ Starting group call..." : "⬆ Release to start group call 📞"}
        <div className="spinner" />
      </div>
    )}
  </div>
);
}

export default GroupChatPreview;
