import React, { useEffect, useMemo, useState } from "react";

import {
  Archive,
  ArchiveRestore,
  CheckSquare,
  Clock3,
  Columns3,
  Copy,
  Edit3,
  Eye,
  FileText,
  Grid2X2,
  Heart,
  LayoutList,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  Sparkles,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";

import {
  getAllNotes,
  updateNote,
  toggleFavorite,
  togglePin,
  toggleArchive,
  duplicateNote,
  increaseViewCount,
  bulkArchiveNotes,
  bulkDeleteNotes,
  deleteNote,
} from "../services/noteService";

function MyNotes({ onNewNote, refreshNotes }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("updated");

  const [selectedIds, setSelectedIds] = useState([]);

  const [previewNote, setPreviewNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isDeckCompact, setIsDeckCompact] = useState(false);

  // =====================================================
  // LOAD NOTES
  // =====================================================

  const loadNotes = async () => {
    try {
      setLoading(true);

      const data = await getAllNotes();

      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [refreshNotes]);

  // =====================================================
  // SAFE SCROLL DETECTION
  // FIXES FAST BLINKING / FLICKERING
  // =====================================================

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsDeckCompact((previous) => {
        // Collapse only after scrolling sufficiently down.
        if (!previous && scrollY > 260) {
          return true;
        }

        // Expand only after returning near the top.
        if (previous && scrollY < 80) {
          return false;
        }

        // Keep current state between 80px and 260px.
        return previous;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =====================================================
  // COUNTS
  // =====================================================

  const counts = useMemo(() => {
    const sevenDaysAgo =
      Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      all: notes.filter((note) => !note.archived).length,

      favorite: notes.filter(
        (note) => note.favorite && !note.archived
      ).length,

      pinned: notes.filter(
        (note) => note.pinned && !note.archived
      ).length,

      recent: notes.filter((note) => {
        if (note.archived) return false;

        const date = new Date(
          note.updatedAt || note.createdAt
        );

        return date.getTime() >= sevenDaysAgo;
      }).length,

      archived: notes.filter((note) => note.archived).length,
    };
  }, [notes]);

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredNotes = useMemo(() => {
    const value = search.trim().toLowerCase();

    let result = notes.filter((note) => {
      if (activeFilter === "archived") {
        return note.archived;
      }

      if (note.archived) {
        return false;
      }

      if (activeFilter === "favorite") {
        return note.favorite;
      }

      if (activeFilter === "pinned") {
        return note.pinned;
      }

      if (activeFilter === "recent") {
        const sevenDaysAgo =
          Date.now() - 7 * 24 * 60 * 60 * 1000;

        const date = new Date(
          note.updatedAt || note.createdAt
        );

        return date.getTime() >= sevenDaysAgo;
      }

      return true;
    });

    if (value) {
      result = result.filter((note) => {
        const searchableText = [
          note.title || "",
          note.content || "",
          ...(note.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(value);
      });
    }

    return [...result].sort((a, b) => {
      if (sortMode === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortMode === "created") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sortMode === "views") {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }

      return (
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
      );
    });
  }, [notes, search, activeFilter, sortMode]);

  // =====================================================
  // REPLACE UPDATED NOTE
  // =====================================================

  const replaceNote = (updatedNote) => {
    setNotes((previous) =>
      previous.map((note) =>
        note._id === updatedNote._id
          ? updatedNote
          : note
      )
    );

    setPreviewNote((current) =>
      current?._id === updatedNote._id
        ? updatedNote
        : current
    );
  };

  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = async (id) => {
    try {
      const updatedNote = await toggleFavorite(id);

      replaceNote(updatedNote);
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  // =====================================================
  // PIN
  // =====================================================

  const handlePin = async (id) => {
    try {
      const updatedNote = await togglePin(id);

      replaceNote(updatedNote);
    } catch (error) {
      console.error("Pin error:", error);
    }
  };

  // =====================================================
  // ARCHIVE / RESTORE
  // =====================================================

  const handleArchive = async (id) => {
    try {
      const updatedNote = await toggleArchive(id);

      replaceNote(updatedNote);

      if (previewNote?._id === id) {
        setPreviewNote(null);
      }
    } catch (error) {
      console.error("Archive error:", error);
    }
  };

  // =====================================================
  // DUPLICATE
  // =====================================================

  const handleDuplicate = async (id) => {
    try {
      const copiedNote = await duplicateNote(id);

      setNotes((previous) => [
        copiedNote,
        ...previous,
      ]);
    } catch (error) {
      console.error("Duplicate error:", error);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Permanently delete this note?"
    );

    if (!confirmed) return;

    try {
      await deleteNote(id);

      setNotes((previous) =>
        previous.filter((note) => note._id !== id)
      );

      setSelectedIds((previous) =>
        previous.filter(
          (selectedId) => selectedId !== id
        )
      );

      if (previewNote?._id === id) {
        setPreviewNote(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const openPreview = async (note) => {
    setPreviewNote(note);

    try {
      const updatedNote = await increaseViewCount(note._id);

      replaceNote(updatedNote);

      setPreviewNote(updatedNote);
    } catch (error) {
      console.error("View count error:", error);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const openEdit = (note) => {
    setEditingNote(note);

    setEditTitle(note.title || "");
    setEditContent(note.content || "");
    setEditTags((note.tags || []).join(", "));
  };

  const closeEdit = () => {
    setEditingNote(null);

    setEditTitle("");
    setEditContent("");
    setEditTags("");
  };

  const saveEdit = async (event) => {
    event.preventDefault();

    if (!editingNote || !editTitle.trim()) {
      return;
    }

    try {
      setActionLoading(true);

      const updatedNote = await updateNote(
        editingNote._id,
        {
          title: editTitle.trim(),

          content: editContent.trim(),

          tags: editTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),

          color:
            editingNote.color || "lavender",
        }
      );

      replaceNote(updatedNote);

      closeEdit();
    } catch (error) {
      console.error("Edit error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // SELECTION
  // =====================================================

  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter(
            (selectedId) => selectedId !== id
          )
        : [...previous, id]
    );
  };

  const selectVisibleNotes = () => {
    const visibleIds = filteredNotes.map(
      (note) => note._id
    );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedIds.includes(id)
      );

    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !visibleIds.includes(id)
        )
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...visibleIds,
        ]),
      ]);
    }
  };

  // =====================================================
  // BULK ARCHIVE
  // =====================================================

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      setActionLoading(true);

      await bulkArchiveNotes(selectedIds);

      setNotes((previous) =>
        previous.map((note) =>
          selectedIds.includes(note._id)
            ? {
                ...note,
                archived: true,
              }
            : note
        )
      );

      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk archive error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // BULK DELETE
  // =====================================================

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Permanently delete ${selectedIds.length} selected notes?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await bulkDeleteNotes(selectedIds);

      setNotes((previous) =>
        previous.filter(
          (note) =>
            !selectedIds.includes(note._id)
        )
      );

      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getWordCount = (content = "") => {
    return content.trim()
      ? content.trim().split(/\s+/).length
      : 0;
  };

  const getReadingTime = (content = "") => {
    return Math.max(
      1,
      Math.ceil(getWordCount(content) / 200)
    );
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const filterItems = [
    {
      key: "all",
      label: "All Documents",
      icon: FileText,
      count: counts.all,
    },
    {
      key: "favorite",
      label: "Favorites",
      icon: Heart,
      count: counts.favorite,
    },
    {
      key: "pinned",
      label: "Pinned",
      icon: Pin,
      count: counts.pinned,
    },
    {
      key: "recent",
      label: "Recent",
      icon: Clock3,
      count: counts.recent,
    },
    {
      key: "archived",
      label: "Archived",
      icon: Archive,
      count: counts.archived,
    },
  ];

  return (
    <main className="document-studio document-studio-top-layout">

      <section className="document-workspace">

        {/* =================================================
            TOP DOCUMENT CONTROL DECK
        ================================================= */}

        <section
          className={`document-control-deck ${
            isDeckCompact ? "compact" : ""
          }`}
        >

          <div className="document-control-top">

            <div className="document-control-title">

              <span>
                Personal Knowledge Workspace
              </span>

              <h1>Documents</h1>

              <p>
                Capture ideas, organize knowledge,
                and rediscover what matters.
              </p>

            </div>


            <div className="document-control-actions">

              <div className="document-health-pill">

                <Sparkles size={17} />

                <div>
                  <span>Knowledge Health</span>

                  <strong>
                    {notes.length} documents
                  </strong>
                </div>

              </div>


              <button
                type="button"
                className="document-deck-new-note"
                onClick={onNewNote}
              >
                <Plus size={18} />

                <span>New Note</span>
              </button>

            </div>

          </div>


          {/* SEARCH + SORT + VIEW */}

          <div className="document-control-tools">

            <div className="document-search">

              <Search size={19} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search documents, ideas, and tags..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}

            </div>


            <select
              className="document-sort"
              value={sortMode}
              onChange={(event) =>
                setSortMode(event.target.value)
              }
            >
              <option value="updated">
                Recently updated
              </option>

              <option value="created">
                Recently created
              </option>

              <option value="title">
                Title A-Z
              </option>

              <option value="views">
                Most viewed
              </option>
            </select>


            <div className="document-view-switcher">

              <button
                type="button"
                className={
                  viewMode === "grid"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("grid")
                }
                title="Grid view"
              >
                <Grid2X2 size={18} />
              </button>


              <button
                type="button"
                className={
                  viewMode === "list"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("list")
                }
                title="List view"
              >
                <LayoutList size={19} />
              </button>


              <button
                type="button"
                className={
                  viewMode === "masonry"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("masonry")
                }
                title="Masonry view"
              >
                <Columns3 size={18} />
              </button>

            </div>

          </div>


          {/* FILTERS */}

          <div className="document-filter-strip">

            <div className="document-filter-tabs">

              {filterItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    key={item.key}
                    className={
                      activeFilter === item.key
                        ? "document-filter-tab active"
                        : "document-filter-tab"
                    }
                    onClick={() => {
                      setActiveFilter(item.key);

                      setSelectedIds([]);
                    }}
                  >
                    <Icon size={16} />

                    <span>{item.label}</span>

                    <strong>{item.count}</strong>

                  </button>
                );
              })}

            </div>

          </div>

        </section>


        {/* =================================================
            RESULTS BAR
        ================================================= */}

        <section className="document-results-bar">

          <div>
            <strong>
              {filteredNotes.length}
            </strong>

            <span>
              {filteredNotes.length === 1
                ? " document"
                : " documents"}
            </span>
          </div>


          <button
            type="button"
            onClick={selectVisibleNotes}
          >
            <CheckSquare size={17} />

            Select visible
          </button>

        </section>


        {/* =================================================
            BULK ACTIONS
        ================================================= */}

        {selectedIds.length > 0 && (
          <section className="document-bulk-bar">

            <strong>
              {selectedIds.length} selected
            </strong>

            <div>

              <button
                type="button"
                onClick={handleBulkArchive}
                disabled={actionLoading}
              >
                <Archive size={17} />
                Archive
              </button>


              <button
                type="button"
                className="danger"
                onClick={handleBulkDelete}
                disabled={actionLoading}
              >
                <Trash2 size={17} />
                Delete
              </button>


              <button
                type="button"
                onClick={() =>
                  setSelectedIds([])
                }
              >
                Clear
              </button>

            </div>

          </section>
        )}


        {/* =================================================
            DOCUMENT COLLECTION
        ================================================= */}

        {loading ? (

          <div className="document-loading">

            <StickyNote size={35} />

            <p>Preparing your workspace...</p>

          </div>

        ) : filteredNotes.length === 0 ? (

          <div className="document-empty-state">

            <div className="document-empty-icon">
              <StickyNote size={32} />
            </div>

            <h2>No documents here yet</h2>

            <p>
              Create a new note or choose another
              workspace filter.
            </p>

            <button
              type="button"
              onClick={onNewNote}
            >
              <Plus size={18} />

              Create Document
            </button>

          </div>

        ) : (

          <section
            className={`document-collection ${viewMode}`}
          >

            {filteredNotes.map((note) => {
              const selected =
                selectedIds.includes(note._id);

              return (
                <article
                  key={note._id}
                  className={`document-card ${
                    note.color || "lavender"
                  } ${
                    selected ? "selected" : ""
                  }`}
                >

                  <div className="document-card-top">

                    <button
                      type="button"
                      className={
                        selected
                          ? "document-select selected"
                          : "document-select"
                      }
                      onClick={() =>
                        toggleSelection(note._id)
                      }
                    >
                      {selected ? "✓" : ""}
                    </button>


                    <div className="document-card-status">

                      {note.pinned && (
                        <span title="Pinned">
                          <Pin size={14} />
                        </span>
                      )}

                      {note.favorite && (
                        <span title="Favorite">
                          <Heart size={14} />
                        </span>
                      )}

                    </div>


                    <button
                      type="button"
                      className="document-more-button"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                  </div>


                  <button
                    type="button"
                    className="document-card-body"
                    onClick={() => openPreview(note)}
                  >

                    <div className="document-primary-tag">
                      {note.tags?.[0] || "Document"}
                    </div>

                    <h3>{note.title}</h3>

                    <p>
                      {note.content || "No content yet."}
                    </p>

                  </button>


                  <div className="document-tag-row">

                    {(note.tags || [])
                      .slice(0, 3)
                      .map((tag, index) => (
                        <span key={`${tag}-${index}`}>
                          {tag}
                        </span>
                      ))}

                  </div>


                  <div className="document-card-meta">

                    <span>
                      {getWordCount(note.content)} words
                    </span>

                    <span>
                      {getReadingTime(note.content)} min read
                    </span>

                    <span>
                      <Eye size={14} />
                      {note.viewCount || 0}
                    </span>

                  </div>


                  <div className="document-card-footer">

                    <span>
                      Updated{" "}
                      {formatDate(
                        note.updatedAt ||
                          note.createdAt
                      )}
                    </span>


                    <div className="document-quick-actions">

                      <button
                        type="button"
                        className={
                          note.favorite ? "active" : ""
                        }
                        onClick={() =>
                          handleFavorite(note._id)
                        }
                        title="Favorite"
                      >
                        <Heart size={16} />
                      </button>


                      <button
                        type="button"
                        className={
                          note.pinned ? "active" : ""
                        }
                        onClick={() =>
                          handlePin(note._id)
                        }
                        title="Pin"
                      >
                        <Pin size={16} />
                      </button>


                      <button
                        type="button"
                        onClick={() => openEdit(note)}
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDuplicate(note._id)
                        }
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleArchive(note._id)
                        }
                        title={
                          note.archived
                            ? "Restore"
                            : "Archive"
                        }
                      >
                        {note.archived ? (
                          <ArchiveRestore size={16} />
                        ) : (
                          <Archive size={16} />
                        )}
                      </button>


                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          handleDelete(note._id)
                        }
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>
        )}

      </section>


      {/* =================================================
          PREVIEW DRAWER
      ================================================= */}

      {previewNote && (
        <>

          <button
            type="button"
            className="document-drawer-backdrop"
            onClick={() => setPreviewNote(null)}
            aria-label="Close preview"
          />


          <aside className="document-preview-drawer">

            <header className="preview-drawer-header">

              <div>
                <span>Document Preview</span>

                <strong>
                  {previewNote.title}
                </strong>
              </div>


              <button
                type="button"
                onClick={() =>
                  setPreviewNote(null)
                }
              >
                <X size={20} />
              </button>

            </header>


            <div className="preview-drawer-content">

              <div className="preview-document-badges">

                {previewNote.pinned && (
                  <span>
                    <Pin size={14} />
                    Pinned
                  </span>
                )}

                {previewNote.favorite && (
                  <span>
                    <Heart size={14} />
                    Favorite
                  </span>
                )}

              </div>


              <h1>{previewNote.title}</h1>


              <div className="preview-document-info">

                <span>
                  {getWordCount(
                    previewNote.content
                  )}{" "}
                  words
                </span>

                <span>
                  {getReadingTime(
                    previewNote.content
                  )}{" "}
                  min read
                </span>

                <span>
                  {previewNote.viewCount || 0} views
                </span>

              </div>


              <p className="preview-document-text">
                {previewNote.content ||
                  "No content yet."}
              </p>


              <div className="preview-document-tags">

                {(previewNote.tags || []).map(
                  (tag, index) => (
                    <span key={`${tag}-${index}`}>
                      {tag}
                    </span>
                  )
                )}

              </div>

            </div>


            <footer className="preview-drawer-footer">

              <button
                type="button"
                onClick={() =>
                  openEdit(previewNote)
                }
              >
                <Edit3 size={17} />
                Edit
              </button>


              <button
                type="button"
                onClick={() =>
                  handleFavorite(previewNote._id)
                }
              >
                <Heart size={17} />
                Favorite
              </button>


              <button
                type="button"
                onClick={() =>
                  handlePin(previewNote._id)
                }
              >
                <Pin size={17} />
                Pin
              </button>


              <button
                type="button"
                onClick={() =>
                  handleArchive(previewNote._id)
                }
              >
                <Archive size={17} />
                Archive
              </button>

            </footer>

          </aside>

        </>
      )}


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingNote && (
        <div className="document-modal-backdrop">

          <form
            className="document-edit-modal"
            onSubmit={saveEdit}
          >

            <header>

              <div>
                <span>Document Studio</span>

                <h2>Edit Document</h2>
              </div>


              <button
                type="button"
                onClick={closeEdit}
              >
                <X size={20} />
              </button>

            </header>


            <label>
              Title

              <input
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(event.target.value)
                }
                placeholder="Document title"
              />
            </label>


            <label>
              Content

              <textarea
                value={editContent}
                onChange={(event) =>
                  setEditContent(event.target.value)
                }
                placeholder="Write your knowledge..."
                rows={10}
              />
            </label>


            <label>
              Tags

              <input
                value={editTags}
                onChange={(event) =>
                  setEditTags(event.target.value)
                }
                placeholder="Java, AI, MongoDB"
              />
            </label>


            <footer>

              <button
                type="button"
                onClick={closeEdit}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="primary"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </footer>

          </form>

        </div>
      )}

    </main>
  );
}

export default MyNotes;