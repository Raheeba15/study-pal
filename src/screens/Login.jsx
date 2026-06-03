import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;
  const userId = user?.id;

  // 🟢 Insert the user ID into preferences (if it doesn't exist)
  if (userId) {
    const { error: insertError } = await supabase
      .from("preferences")
      .upsert({ id: userId, theme: "light" })  // use upsert to avoid duplicates
      .eq("id", userId);

    if (insertError) {
      console.error("Insert error:", insertError.message);
    }
  }

  navigate("/");
};


  return (
    <div
      style={{
        minHeight: "10vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color:"darkgrey",
            marginBottom: "1rem",
            fontSize: "2rem",
            fontWeight: "bold",
        
          }}
        >
          Welcome Back 👋
        </h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2c5364")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2c5364")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              background: "linear-gradient(to right, #56ccf2, #2f80ed)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#777" }}>
          Don't have an account? <span style={{ color: "#2f80ed", cursor: "pointer" }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
