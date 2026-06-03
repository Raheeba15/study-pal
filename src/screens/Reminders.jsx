import React, { useEffect, useState } from "react";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: "", time: "", desc: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  /* ─── Load + Persist ─── */
  useEffect(() => {
    const saved = localStorage.getItem("studyPalReminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("studyPalReminders", JSON.stringify(reminders));
  }, [reminders]);

  /* ─── Handlers ─── */
  const addReminder = () => {
    if (!form.title || !form.time) return alert("Please fill title and time.");
    const newReminder = { ...form, id: Date.now() };

    if (editingIndex !== null) {
      const updated = [...reminders];
      updated[editingIndex] = newReminder;
      setReminders(updated);
      setEditingIndex(null);
    } else {
      setReminders((r) => [...r, newReminder]);
    }
    setForm({ title: "", time: "", desc: "" });
  };

  const deleteReminder = (idx) =>
    window.confirm("Delete this reminder?") &&
    setReminders((r) => r.filter((_, i) => i !== idx));

  const editReminder = (idx) => {
    setForm(reminders[idx]);
    setEditingIndex(idx);
  };

  /* ─── UI ─── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
        color: "#f5f5f5",
        padding: "2rem 1rem",
        fontFamily: "Poppins, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",        // ⬅ wider container (was 800px)
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            marginBottom: "1.5rem",
          }}
        >
          ⏰ Reminders
        </h1>

        {/* Form */}
        <div
          style={{
            background: "#1c2b36",
            borderRadius: "10px",
            padding: "1.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          }}
        >
          <input
            placeholder="Reminder Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <input
            type="datetime-local"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            style={inputStyle}
          />
          <textarea
            placeholder="Description (optional)"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            rows={2}
            style={{ ...inputStyle, resize: "none" }}
          />
          <button onClick={addReminder} style={btnStyle}>
            {editingIndex !== null ? "Update" : "Add Reminder"}
          </button>
        </div>

        {/* Reminder List */}
        {reminders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa" }}>
            No reminders yet.
          </p>
        ) : (
          reminders
            .sort((a, b) => new Date(a.time) - new Date(b.time))
            .map((r, i) => (
              <div
                key={r.id}
                style={{
                  background: "#243544",
                  marginBottom: "1.2rem",
                  padding: "1.2rem 1.4rem",
                  borderRadius: "10px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 .25rem" }}>{r.title}</h3>
                  {r.desc && (
                    <p style={{ fontSize: ".9rem", color: "#ccc", margin: 0 }}>
                      {r.desc}
                    </p>
                  )}
                  <p style={{ fontSize: ".8rem", color: "#90caf9", margin: 0 }}>
                    📅 {new Date(r.time).toLocaleString()}
                  </p>
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => editReminder(i)}
                    style={miniBtnStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReminder(i)}
                    style={{ ...miniBtnStyle, backgroundColor: "#c62828" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const inputStyle = {
  width: "100%",
  padding: "0.9rem 1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2e3c48",
  color: "#fff",
  fontSize: "1rem",
};

const btnStyle = {
  width: "100%",
  padding: "0.9rem",
  background:
    "linear-gradient(135deg, rgba(0,198,255,0.9) 0%, rgba(0,115,255,0.9) 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  boxShadow: "0 2px 8px rgba(0,115,255,0.4)",
};

const miniBtnStyle = {
  marginRight: "0.5rem",
  padding: "0.55rem .95rem",
  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: ".9rem",
};

export default Reminders;
