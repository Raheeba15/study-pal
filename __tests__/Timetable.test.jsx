import React, { useState, useEffect, useRef } from 'react';

function Timetable() {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('timetableClasses');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ subject: '', day: '', time: '', location: '' });
  const [editIndex, setEditIndex] = useState(null);
  const notificationTimeouts = useRef([]);

  const clearAllTimeouts = () => {
    notificationTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    notificationTimeouts.current = [];
  };

  const scheduleAllNotifications = () => {
    clearAllTimeouts();
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    classes.forEach((cls) => {
      if (cls.day.toLowerCase() !== todayName) return;

      const classDateTime = getClassDateTime(cls.day, cls.time);
      if (!classDateTime) return;

      const now = new Date();
      const notifTime = new Date(classDateTime.getTime() - 10 * 60 * 1000);
      const delay = notifTime.getTime() - now.getTime();

      if (delay <= 0) return;

      const timeoutId = setTimeout(() => {
        new Notification(`Upcoming class: ${cls.subject}`, {
          body: `Your class at ${cls.time} in ${cls.location} starts in 10 minutes!`,
        });
      }, delay);

      notificationTimeouts.current.push(timeoutId);
    });
  };

  const getClassDateTime = (dayName, timeStr) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = dayNames.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
    if (dayIndex === -1) return null;

    const now = new Date();
    const classDate = new Date(now);
    classDate.setHours(0, 0, 0, 0);

    let daysUntilClass = dayIndex - classDate.getDay();
    if (daysUntilClass < 0) daysUntilClass += 7;

    const [hour, minute] = parseTime(timeStr);
    const classTimeToday = new Date(classDate);
    classTimeToday.setHours(hour, minute, 0, 0);

    if (daysUntilClass === 0 && now > classTimeToday) {
      daysUntilClass = 7;
    }

    classDate.setDate(classDate.getDate() + daysUntilClass);
    classDate.setHours(hour, minute, 0, 0);

    return classDate;
  };

  const parseTime = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    return [parseInt(hourStr), parseInt(minuteStr)];
  };

  useEffect(() => {
    localStorage.setItem('timetableClasses', JSON.stringify(classes));
    if (Notification.permission === 'granted') {
      scheduleAllNotifications();
    }
    return () => clearAllTimeouts();
  }, [classes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedClasses = [...classes];
      updatedClasses[editIndex] = form;
      setClasses(updatedClasses);
      setEditIndex(null);
    } else {
      setClasses([...classes, form]);
    }
    setForm({ subject: '', day: '', time: '', location: '' });
  };

  const handleEdit = (index) => {
    setForm(classes[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setClasses(classes.filter((_, i) => i !== index));
    if (editIndex === index) {
      setForm({ subject: '', day: '', time: '', location: '' });
      setEditIndex(null);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div
      style={{
        padding: '1rem',
        background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
        color: '#f5f5f5',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
        overflowX: 'hidden',
      }}
    >
      <h1 style={{
        textAlign: 'center',
        fontSize: '1.8rem',
        marginBottom: '2rem',
        fontWeight: 600,
      }}>
        📅 Timetable Manager
      </h1>

{('Notification' in window) && (
 <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem',
    gap: '1rem',
  }}
>
  <h1
    style={{
      fontSize: '1.8rem',
      fontWeight: 600,
      margin: 0,
    }}
  >
    📅 Timetable Manager
  </h1>

  {('Notification' in window) && (
    <button
      onClick={() => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            scheduleAllNotifications();
            alert('🔔 Notifications enabled!');
          } else {
            alert('❌ Notifications not allowed.');
          }
        });
      }}
      style={{
        backgroundColor: '#00bcd4',
        color: '#fff',
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      🔔 {Notification.permission === 'granted' ? 'Recheck Notifications' : 'Enable Notifications'}
    </button>
  )}
</div>

)}


      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '1rem',
          borderRadius: '12px',
          margin: '0 auto 2rem',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required style={inputStyle} />
        <select name="day" value={form.day} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Day</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input name="time" type="time" value={form.time} onChange={handleChange} required style={inputStyle} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={primaryBtn}>
          {editIndex !== null ? '💾 Save Changes' : '➕ Add Class'}
        </button>
        {editIndex !== null && (
          <button type="button" onClick={() => { setForm({ subject: '', day: '', time: '', location: '' }); setEditIndex(null); }} style={secondaryBtn}>✖ Cancel</button>
        )}
      </form>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
          📌 Today's Classes ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
        </h2>
        {classes.filter(cls => cls.day.toLowerCase() === today).length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc' }}>No classes scheduled for today.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {classes.filter(cls => cls.day.toLowerCase() === today).map((cls, index) => (
              <li
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <strong style={{ fontSize: '1.1rem' }}>{cls.subject}</strong>
                <p style={{ margin: '.3rem 0', color: '#eee' }}>🕒 {cls.time} | 📍 {cls.location}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleEdit(index)} style={smallBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(index)} style={{ ...smallBtn, backgroundColor: '#d32f2f' }}>🗑️ Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#1e293b',
  color: '#fff',
  border: 'none',
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '1rem',
};

const primaryBtn = {
  backgroundColor: '#00c6ff',
  color: '#fff',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const secondaryBtn = {
  backgroundColor: '#6b7280',
  color: '#fff',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const smallBtn = {
  backgroundColor: '#0072ff',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Timetable;
