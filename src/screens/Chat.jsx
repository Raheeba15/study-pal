import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat, setUnreadCount } from "../features/chat/chatSlice";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabaseClient";

function Chat() {
  const { session } = useAuth();
  const user = session?.user;
  const userId = user?.id;

  const dispatch = useDispatch();
  const receiverId = useSelector((state) => state.chat.selectedReceiverId);

  const [profiles, setProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // ─── Fetch user profiles ───
  useEffect(() => {
    if (!userId) {
      setError("Please log in to see other users");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: otherProfiles, error: fetchError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .neq("id", userId);

        if (fetchError) {
          console.error("Error fetching profiles:", fetchError);
          setError("Failed to load users");
          setLoading(false);
          return;
        }

        setProfiles(otherProfiles || []);
      } catch (err) {
        console.error("Unexpected error during profile fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // ─── Fetch & Realtime messages ───
  useEffect(() => {
    if (!userId || !receiverId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
        )
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      if (data) {
        setMessages(data);
        dispatch(setUnreadCount(data.length)); // optional: update unread count
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat_${userId}_${receiverId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          const isThisChat =
            (msg.sender_id === userId && msg.receiver_id === receiverId) ||
            (msg.sender_id === receiverId && msg.receiver_id === userId);

          if (isThisChat) {
            setMessages((prev) => [...prev, msg]);
            dispatch(setUnreadCount(prev => prev + 1)); // optional logic
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getName = (id) => {
    if (id === userId) return "You";
    const userProfile = profiles.find((p) => p.id === id);
    return userProfile
      ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() ||
          userProfile.email
      : "Unknown";
  };

  const sendMessage = async () => {
    if (!input.trim() || !receiverId) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: userId,
          receiver_id: receiverId,
          text: input,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      }
    } catch (error) {
      console.error("Unexpected error sending message:", error);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentReceiver = profiles.find((p) => p.id === receiverId);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right,#0f2027,#203a43,#2c5364)",
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
        color: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#121212",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#161b22",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #333",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#90caf9" }}>
            💬 StudyPal Chat
          </h2>
          {currentReceiver && (
            <p style={{ margin: 0, color: "#bbb", fontSize: ".9rem" }}>
              Chatting with{" "}
              <strong style={{ color: "#58a6ff" }}>
                {getName(currentReceiver.id)}
              </strong>
            </p>
          )}
        </div>

        {/* Receiver Select */}
        <div style={{ padding: "1rem" }}>
          {loading ? (
            <div style={{ color: "#888", textAlign: "center" }}>
              Loading users...
            </div>
          ) : error ? (
            <div style={{ color: "#ff4444", textAlign: "center" }}>{error}</div>
          ) : profiles.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center" }}>
              No other users found
            </div>
          ) : (
            <select
              value={receiverId || ""}
              onChange={(e) => dispatch(setSelectedChat(e.target.value))}
              style={{
                width: "100%",
                padding: ".6rem",
                background: "#1e1e1e",
                color: "#f5f5f5",
                border: "1px solid #555",
                borderRadius: "6px",
              }}
            >
              <option value="">— Choose a user —</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {`${p.first_name || ""} ${p.last_name || ""}`.trim() ||
                    p.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            background: "#0e1015",
            display: "flex",
            flexDirection: "column",
            gap: ".6rem",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", marginTop: "2rem" }}>
              {!receiverId
                ? "Select a user to start chatting"
                : "No messages yet."}
            </p>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === userId;
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                  }}
                >
                  <div
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg,#1976d2,#2196f3)"
                        : "#24292f",
                      color: "#f5f5f5",
                      padding: ".6rem .8rem",
                      borderRadius: isMe
                        ? "12px 0 12px 12px"
                        : "0 12px 12px 12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,.4)",
                      wordBreak: "break-word",
                      width: "fit-content",
                    }}
                  >
                    <div style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>
                      <strong>{getName(m.sender_id)}</strong>{" "}
                      <span style={{ color: "#ccc" }}>
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={{ display: "flex", padding: "1rem", gap: ".5rem" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              background: "#1e1e1e",
              color: "#f5f5f5",
              border: "1px solid #555",
              borderRadius: "6px",
              padding: ".6rem",
              lineHeight: "1.35",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#0288d1",
              border: "none",
              color: "#fff",
              padding: "0 .9rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            title="Send"
          >
            📨
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
