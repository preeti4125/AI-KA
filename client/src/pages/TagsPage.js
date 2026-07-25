import React, { useEffect, useState } from "react";
import { Tags } from "lucide-react";
import { getAllNotes } from "../services/noteService";

function TagsPage({ refreshNotes }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);

        const data = await getAllNotes();

        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load tags:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [refreshNotes]);

  const tagCounts = {};

  notes.forEach((note) => {
    (note.tags || []).forEach((tag) => {
      const cleanTag = tag.trim();

      if (cleanTag) {
        tagCounts[cleanTag] =
          (tagCounts[cleanTag] || 0) + 1;
      }
    });
  });

  const tags = Object.entries(tagCounts);

  return (
    <main className="dashboard">

      <header className="dashboard-header">

        <div>

          <p className="welcome-text">
            Organize Your Knowledge
          </p>

          <h1>Tags</h1>

          <p className="subtitle">
            Explore topics from your saved knowledge.
          </p>

        </div>

      </header>


      {loading && (

        <div className="empty-notes">

          <Tags size={40} />

          <h3>Loading tags...</h3>

        </div>

      )}


      {!loading && tags.length === 0 && (

        <div className="empty-notes">

          <Tags size={40} />

          <h3>No tags found</h3>

          <p>
            Add tags when creating notes.
          </p>

        </div>

      )}


      {!loading && tags.length > 0 && (

        <div className="notes-page-grid">

          {tags.map(([tag, count]) => (

            <article
              className="knowledge-note"
              key={tag}
            >

              <span className="note-category">
                Topic
              </span>

              <h3>
                #{tag}
              </h3>

              <p className="note-content">

                {count}{" "}

                {count === 1
                  ? "note"
                  : "notes"}

                {" "}saved with this tag.

              </p>

            </article>

          ))}

        </div>

      )}

    </main>
  );
}

export default TagsPage;