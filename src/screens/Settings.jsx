import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/settings/settingsSlice";

function Settings() {
  const theme = useSelector((state) => state.settings.theme); // ✅ Get theme from Redux
  const dispatch = useDispatch(); // ✅ Hook to dispatch actions

  if (!theme) {
    return <div style={{ padding: "2rem" }}>Loading theme preference...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Settings</h2>
      <div>
        <strong>Current Theme:</strong> {theme}
        <br />
        <button
          onClick={() => dispatch(toggleTheme())} // ✅ Call Redux action
          style={{ marginTop: "1rem" }}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}

export default Settings;
