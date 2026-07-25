import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { addNote } from "../services/noteService";

function AddNoteModal({ onClose, onNoteAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const newNote = {
        title: title,
        content: content,

        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };

      const savedNote = await addNote(newNote);

      console.log("Saved note:", savedNote);

      if (onNoteAdded) {
        onNoteAdded(savedNote);
      }

      onClose();
    } catch (error) {
      console.error(error);

      setError("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="add-note-modal">

        <div className="modal-header">

          <div>
            <h2>Create New Note</h2>

            <p>
              Add a new note to your knowledge collection.
            </p>
          </div>

          <button
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Title</label>

            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Content</label>

            <textarea
              placeholder="Write your knowledge here..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Tags</label>

            <input
              type="text"
              placeholder="Java, AI, MongoDB..."
              value={tags}
              onChange={(event) =>
                setTags(event.target.value)
              }
            />

          </div>

          {error && (
            <p className="modal-error">
              {error}
            </p>
          )}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-note-button"
              disabled={loading}
            >
              <Plus size={18} />

              {loading ? "Creating..." : "Create Note"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddNoteModal;