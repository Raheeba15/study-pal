import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";

import React, { useEffect } from "react";


import Dashboard from "./screens/Dashboard";
import Timetable from "./screens/Timetable";
import Planner from "./screens/Planner";
import Notes from "./screens/Notes";
import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { AuthProvider, useAuth } from "./screens/AuthProvider";
import { supabase } from "./screens/supabaseClient";
import Reminders from "./screens/Reminders";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import { ThemeProvider } from "./screens/ThemeProvider";
import GroupChatPreview from "./screens/GroupChatPreview";


import { useSelector } from "react-redux";
import { Provider } from 'react-redux';
import { store } from './app/store'; // make sure path is correct


function PrivateRoute({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const buttonBase = {
    padding: "0.5rem 1rem",
    margin: "0.2rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    boxShadow: "0 4px 14px rgba(0,198,255,0.25)",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        padding: "0",
        margin: "0",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background:
          "radial-gradient(circle at top left, rgba(0, 115, 255, 0.2), transparent), linear-gradient(to right, rgba(15,23,42,0.8), rgba(2,6,23,0.8))",
        backdropFilter: "blur(12px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
        color: "#f5f5f5",
        textAlign: "center",
      }}
    >
      {/* ─── App Title ─── */}
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          fontFamily: "Poppins, Segoe UI, sans-serif",
          WebkitBackgroundClip: "text",
          textShadow: "0 0 10px rgba(0,229,255,0.6)",
          animation: "glow 2s ease-in-out infinite alternate",
          margin: "0",
          padding: "0.5rem",
        }}
      >
        📚 Study Pal
      </div>

      {/* ─── Links ─── */}
      {session ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.2rem 0 0.3rem",
            margin: 0,
          }}
        >
          {[
            "/dashboard",
            "/timetable",
            "/planner",
            "/notes",
            "/chat",
            "/reminders",
            "/settings",
            "/groupchatpreview", // ✅ Add Settings link here
          ].map((path) => {
            const label = path === "/dashboard" ? "Dashboard" : path.slice(1);
            return (
              <NavLink
                key={path}
                to={path}
                style={({ isActive }) => ({
                  ...buttonBase,
                  background: isActive
                    ? "linear-gradient(135deg, #0072ff, #00c6ff)"
                    : buttonBase.background,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 0 12px rgba(0,198,255,0.4)"
                    : buttonBase.boxShadow,
                })}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </NavLink>
            );
          })}
          <button
            style={{
              ...buttonBase,
              background: "linear-gradient(135deg, #e53935, #b71c1c)",
              boxShadow: "0 0 10px rgba(229,57,53,0.4)",
            }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <NavLink to="/login" style={buttonBase}>
            Login
          </NavLink>
          <NavLink to="/signup" style={buttonBase}>
            Signup
          </NavLink>
        </div>
      )}
    </nav>
  );
}



function AppRoutes() {
   const theme = useSelector((state) => state.settings.theme); 
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {[
          ["/dashboard", Dashboard],
          ["/timetable", Timetable],
          ["/planner", Planner],
          ["/notes", Notes],
          ["/chat", Chat],
          ["/reminders", Reminders],
          ["/settings", Settings],
          ["/profile", Profile],
          ["/groupchatpreview", GroupChatPreview],
        ].map(([path, Component]) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <div style={{ flex: 1, height: "100%" }}>
                  <Component />
                </div>
              </PrivateRoute>
            }
          />
        ))}

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/chat-preview" element={<GroupChatPreview />} />
        <Route
          path="*"
          element={
            <div
              style={{
                background:
                  "radial-gradient(ellipse at center, #1a237e 0%, #0f172a 100%)",
                color: "#f8f8f8",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "2rem", color: "#f44336" }}>
                ⚠️ 404 - Page Not Found
              </h2>
              <p>The page you're looking for doesn't exist.</p>
              <NavLink
                to="/dashboard"
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.4rem",
                  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                ⬅ Back to Dashboard
              </NavLink>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ThemeProvider>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                width: "100%",
              }}
            >
              <Navbar />
              <AppRoutes />
            </div>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </Provider>
  );
}
