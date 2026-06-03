import React from "react";
import { NavLink } from "react-router-dom";

const BottomTabs = () => {
  const tabs = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div style={styles.container}>
      {tabs.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#1976d2" : "#1e1e1e",
          })}
        >
          <div style={{ fontSize: "1.5rem" }}>{icon}</div>
          <div>{label}</div>
        </NavLink>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #444",
    zIndex: 1000,
  },
  link: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    padding: "0.5rem",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
};

export default BottomTabs;
