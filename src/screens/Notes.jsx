import React, { useState, useEffect } from 'react';

function Notes() {
  const [notes,  setNotes]  = useState([]);
  const [title,  setTitle]  = useState('');
  const [content,setContent]= useState('');
  const [tag,    setTag]    = useState('');
  const [file,   setFile]   = useState(null);
  const [search, setSearch] = useState('');
  const [filterTag,setFilterTag] = useState('');
  const [editId, setEditId] = useState(null);

  /* ─── Load + persist ─── */
  useEffect(() => {
    const saved = localStorage.getItem('studyPalNotes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('studyPalNotes', JSON.stringify(notes));
  }, [notes]);

  /* ─── Add or update ─── */
  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const newNote = {
      id      : editId || Date.now(),
      title,
      content,
      tag,
      file    : file ? URL.createObjectURL(file) : null,
      fileName: file ? file.name : null
    };

    setNotes(prev =>
      editId ? prev.map(n => n.id === editId ? newNote : n)
             : [newNote, ...prev]
    );

    /* reset form */
    setEditId(null); setTitle(''); setContent('');
    setTag(''); setFile(null);
  };

  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editId === id) {
      setEditId(null); setTitle(''); setContent('');
      setTag(''); setFile(null);
    }
  };

  /* ─── Filtering helpers ─── */
  const filtered = notes
    .filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter(n => (filterTag ? n.tag === filterTag : true));

  const uniqueTags = [...new Set(notes.map(n => n.tag).filter(Boolean))];

  /* ─── UI ─── */
  return (
    <div style={{
      background:'linear-gradient(to bottom right,#141e30,#243b55)',
      minHeight:'100vh',
      padding:'1rem',
      color:'#f5f5f5',
      fontFamily:'Segoe UI, sans-serif'
    }}>

      <h2 style={{ color:'#64b5f6', textAlign:'center', marginBottom:'1rem' }}>
        📝 StudyPal Notes
      </h2>

      {/* Form */}
      <div style={{
        background:'#1e1e1e',
        borderRadius:'12px',
        padding:'1rem',
        boxShadow:'0 4px 12px rgba(0,0,0,0.6)',
        maxWidth:'800px',
        margin:'auto',
        marginBottom:'1.5rem',
        display:'flex',
        flexDirection:'column',
        gap:'.75rem'
      }}>
        <input
          placeholder='Note Title'
          value={title}
          onChange={e=>setTitle(e.target.value)}
          style={fieldStyle}
        />
        <textarea
          placeholder='Write your note here…'
          value={content}
          onChange={e=>setContent(e.target.value)}
          rows={4}
          style={{ ...fieldStyle, resize:'vertical' }}
        />
        <input
          placeholder='Tag (e.g. midterm, important)'
          value={tag}
          onChange={e=>setTag(e.target.value)}
          style={fieldStyle}
        />
        <input
          type='file'
          onChange={e=>setFile(e.target.files[0])}
          style={fieldStyle}
        />
        <div style={{ display:'flex', gap:'.5rem' }}>
          <button onClick={handleSave} style={primaryBtn}>
            {editId ? '💾 Save Changes' : '➕ Add Note'}
          </button>
          {editId && (
            <button
              onClick={()=>{ setEditId(null); setTitle(''); setContent(''); setTag(''); setFile(null); }}
              style={secondaryBtn}
            >
              ✖ Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{
        maxWidth:'800px',
        margin:'auto',
        display:'flex',
        gap:'.5rem',
        marginBottom:'1.5rem'
      }}>
        <input
          placeholder='🔍 Search notes'
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ ...fieldStyle, flex:1 }}
        />
        <select
          value={filterTag}
          onChange={e=>setFilterTag(e.target.value)}
          style={{ ...fieldStyle, width:'150px' }}
        >
          <option value=''>All Tags</option>
          {uniqueTags.map(t=>(
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Notes List */}
      <div style={{
        maxWidth:'800px',
        margin:'auto',
        display:'grid',
        gap:'1rem',
        gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))'
      }}>
        {filtered.length === 0 ? (
          <p style={{ color:'#ccc', gridColumn:'1/-1', textAlign:'center' }}>
            No notes found.
          </p>
        ) : (
          filtered.map(note=>(
            <div key={note.id} style={{
              background:'#1e1e1e',
              padding:'1rem',
              borderRadius:'10px',
              boxShadow:'0 2px 8px rgba(0,0,0,0.5)',
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-between'
            }}>
              <div>
                <h3 style={{ color:'#ffeb3b', margin:'0 0 .5rem' }}>
                  {note.title || 'Untitled Note'}
                </h3>
                <p style={{ whiteSpace:'pre-wrap' }}>{note.content}</p>
              </div>

              <div style={{ marginTop:'1rem' }}>
                {note.tag && (
                  <span style={{
                    background:'#546e7a',
                    color:'#fff',
                    padding:'0 .4rem',
                    borderRadius:'4px',
                    fontSize:'.75rem'
                  }}>
                    {note.tag}
                  </span>
                )}
                {note.file && (
                  <p style={{ marginTop:'.5rem' }}>
                    <strong>Attachment:</strong>{' '}
                    <a href={note.file} target='_blank' rel='noopener noreferrer'
                       style={{ color:'#64b5f6' }}>
                      {note.fileName}
                    </a>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ marginTop:'1rem', display:'flex', gap:'.5rem' }}>
                <button
                  onClick={()=>{
                    setEditId(note.id); setTitle(note.title);
                    setContent(note.content); setTag(note.tag);
                    setFile(null);
                  }}
                  style={smallBtn}
                >✏️ Edit</button>
                <button
                  onClick={()=>handleDelete(note.id)}
                  style={{ ...smallBtn, background:'#d32f2f' }}
                >🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Shared styles ─── */
const fieldStyle = {
  background:'#262626',
  color:'#f5f5f5',
  border:'1px solid #555',
  padding:'.6rem .7rem',
  borderRadius:'6px',
  outline:'none'
};

const primaryBtn = {
  background:'linear-gradient(to right,#00c6ff,#0072ff)',
  border:'none',
  padding:'.6rem 1.2rem',
  color:'#fff',
  cursor:'pointer',
  borderRadius:'6px',
  flex:'none'
};

const secondaryBtn = {
  background:'#757575',
  border:'none',
  padding:'.6rem 1.2rem',
  color:'#fff',
  cursor:'pointer',
  borderRadius:'6px'
};

const smallBtn = {
  background:'#0288d1',
  border:'none',
  padding:'.35rem .8rem',
  color:'#fff',
  cursor:'pointer',
  borderRadius:'4px',
  flex:'1'
};

export default Notes;
