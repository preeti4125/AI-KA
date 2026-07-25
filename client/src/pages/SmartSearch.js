import React, { useEffect, useState } from "react";
import { Search, StickyNote } from "lucide-react";
import { getAllNotes } from "../services/noteService";

function SmartSearch({ refreshNotes }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await getAllNotes();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }

    loadNotes();
  }, [refreshNotes]);

  const filteredNotes = notes.filter((note) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return false;
    }

    return (
      (note.title || "").toLowerCase().includes(value) ||
      (note.content || "").toLowerCase().includes(value) ||
      (note.tags || []).some((tag) =>
        tag.toLowerCase().includes(value)
      )
    );
  });

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="welcome-text">Find Knowledge Faster</p>
          <h1>Smart Search</h1>
          <p className="subtitle">
            Search your notes by title, content, or tags.
          </p>
        </div>
      </header>

      <div className="dashboard-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Try Java, AI, NLP, MongoDB..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          autoFocus
        />
      </div>

      {!search.trim() && (
        <div className="empty-notes">
          <Search size={40} />
          <h3>Start searching</h3>
          <p>Enter a title, topic, content, or tag above.</p>
        </div>
      )}

      {search.trim() && filteredNotes.length === 0 && (
        <div className="empty-notes">
          <StickyNote size={40} />
          <h3>No results found</h3>
          <p>Try searching with another keyword.</p>
        </div>
      )}

      {search.trim() && filteredNotes.length > 0 && (
        <div className="notes-page-grid">
          {filteredNotes.map((note) => (
            <article className="knowledge-note" key={note._id}>
              <span className="note-category">
                {note.tags?.[0] || "Note"}
              </span>

              <h3>{note.title}</h3>

              <p className="note-content">{note.content}</p>

              <div className="note-tags">
                {(note.tags || []).map((tag, index) => (
                  <span key={`${tag}-${index}`}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default SmartSearch;