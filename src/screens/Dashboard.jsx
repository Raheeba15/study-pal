import React, { useEffect, useState } from 'react';
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [completed, setCompleted] = useState({});
  const [nextClass, setNextClass] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout failed: " + error.message);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const savedClasses = localStorage.getItem('timetableClasses');
    const savedCompleted = localStorage.getItem('completedClasses');
    const savedNotes = localStorage.getItem('studyPalNotes');

    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('completedClasses', JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    if (!classes.length) return;

    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayClasses = classes
      .map((cls, idx) => ({ ...cls, idx }))
      .filter(cls => cls.day.toLowerCase() === todayName && !completed[cls.idx])
      .sort((a, b) => {
        const [aH, aM] = parseTime(a.time);
        const [bH, bM] = parseTime(b.time);
        return aH * 60 + aM - (bH * 60 + bM);
      });

    const now = new Date();
    const upcoming = todayClasses.find(cls => {
      const classTime = getClassDateTime(cls.day, cls.time);
      return classTime && classTime > now;
    });

    setNextClass(upcoming || null);

    if (!upcoming) {
      setCountdown('No more classes today!');
      return;
    }

    const timer = setInterval(() => {
      const diff = getClassDateTime(upcoming.day, upcoming.time) - new Date();
      if (diff <= 0) {
        setCountdown('Starting now!');
        clearInterval(timer);
      } else {
        setCountdown(formatCountdown(diff));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [classes, completed]);

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return [hours, minutes];
  };

  const getClassDateTime = (dayName, timeStr) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const idx = dayNames.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
    if (idx === -1) return null;

    const now = new Date();
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);

    let offset = idx - date.getDay();
    if (offset < 0) offset += 7;

    const [h, m] = parseTime(timeStr);
    date.setDate(date.getDate() + offset);
    date.setHours(h, m, 0, 0);
    return date;
  };

  const formatCountdown = (ms) => {
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${hh}h ${mm}m ${ss}s`;
  };

  const toggleCompleted = (i) => {
    setCompleted(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayClasses = classes.filter(c => c.day.toLowerCase() === todayName);
  const completedCount = todayClasses.filter((c, i) => completed[i]).length;
  const progressPercent = todayClasses.length
    ? Math.round((completedCount / todayClasses.length) * 100)
    : 0;

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toDateString();

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
      color: '#f0f0f0',
      minHeight: '100vh',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '0.6rem 1.2rem',
          background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <h1 style={{ fontSize: '2rem', color: '#61dafb', margin: '.25rem 0 1rem' }}>
        Welcome ;)
      </h1>

      <div style={{
        marginBottom: '1rem',
        backgroundColor: '#1e2a38',
        padding: '0.5rem 2.5rem',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 0 16px rgba(0,0,0,0.3)',
        minWidth: '280px'
      }}>
        <h2 style={{ fontSize: '1rem', margin: '0 0 .25rem' }}>🕒 {currentTime}</h2>
        <p style={{ fontSize: '.85rem' }}>📆 {currentDate}</p>
      </div>

      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <h2 style={{ marginBottom: '1rem' }}>
          📊 Today’s Overview ({todayName.charAt(0).toUpperCase() + todayName.slice(1)})
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            height: '15px',
            backgroundColor: '#394b59',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              transition: 'width .5s ease'
            }} />
          </div>
          <p style={{ marginTop: '.5rem' }}>
            {progressPercent}% completed ({completedCount} of {todayClasses.length})
          </p>
        </div>

        {todayClasses.map((cls, i) => {
          const idx = classes.findIndex(c =>
            c.subject === cls.subject &&
            c.day === cls.day &&
            c.time === cls.time &&
            c.location === cls.location
          );
          return (
            <div key={i} style={{
              backgroundColor: '#2e3c48',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{cls.subject}</strong><br />
                <span style={{ color: '#ccc' }}>⏰ {cls.time} | 📍 {cls.location}</span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <input
                  type="checkbox"
                  checked={completed[idx] || false}
                  onChange={() => toggleCompleted(idx)}
                />
                <span>Done</span>
              </label>
            </div>
          );
        })}

        <div style={{
          fontFamily: "'Poppins', sans-serif",
          background: "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)",
          color: "#e0e0e0",
          minHeight: "1vh",
          padding: "2rem 1rem",
          backgroundAttachment: "fixed",
        }}>
          {nextClass ? (
            <>
              <h3 style={{ color: '#ffd54f' }}>⏭️ Next Class</h3>
              <p><strong>{nextClass.subject}</strong> at {nextClass.time} in {nextClass.location}</p>
              <p>⏳ Starts in: <strong>{countdown}</strong></p>
            </>
          ) : (
            <p>🎉 No more classes today!</p>
          )}
        </div>

        <div style={{
          backgroundColor: '#1f2d3d',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }}>
          <h3 style={{ color: '#90caf9', marginBottom: '1rem' }}>📝 Quick Notes</h3>
          {notes.length === 0 ? (
            <p style={{ color: '#ccc' }}>No notes added yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
              {notes.slice(0, 3).map(n => (
                <li key={n.id} style={{
                  background: '#2c3e50',
                  borderRadius: '8px',
                  padding: '.75rem',
                  marginBottom: '.5rem'
                }}>
                  <strong style={{ color: '#ffeb3b' }}>
                    {n.title || 'Untitled Note'}
                  </strong>
                  <p style={{
                    fontSize: '.9rem',
                    margin: '.25rem 0',
                    color: '#ccc'
                  }}>
                    {n.content.length > 100 ? n.content.slice(0, 100) + '…' : n.content}
                  </p>
                  {n.tag && (
                    <span style={{
                      background: '#546e7a',
                      padding: '0 .4rem',
                      borderRadius: '4px',
                      fontSize: '.75rem',
                      color: '#fff'
                    }}>
                      {n.tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
