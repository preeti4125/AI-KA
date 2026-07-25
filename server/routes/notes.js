const express = require("express");
const router = express.Router();

const Note = require("../models/Note");


// =====================================================
// ADD NOTE
// =====================================================

router.post("/add", async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || [],
      color: req.body.color || "lavender",
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("ADD NOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to add note",
    });
  }
});


// =====================================================
// GET ALL NOTES
// =====================================================

router.get("/all", async (req, res) => {
  try {
    const notes = await Note.find().sort({
      pinned: -1,
      updatedAt: -1,
      createdAt: -1,
    });

    res.json(notes);
  } catch (error) {
    console.error("GET NOTES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});


// =====================================================
// GET ONE NOTE
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error("GET NOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
});


// =====================================================
// UPDATE NOTE
// =====================================================

router.put("/update/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags || [],
        color: req.body.color || "lavender",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
});


// =====================================================
// TOGGLE FAVORITE
// =====================================================

router.patch("/favorite/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.favorite = !note.favorite;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error("FAVORITE ERROR:", error);

    res.status(500).json({
      message: "Failed to update favorite",
    });
  }
});


// =====================================================
// TOGGLE PIN
// =====================================================

router.patch("/pin/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.pinned = !note.pinned;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error("PIN ERROR:", error);

    res.status(500).json({
      message: "Failed to update pin",
    });
  }
});


// =====================================================
// TOGGLE ARCHIVE
// =====================================================

router.patch("/archive/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.archived = !note.archived;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error("ARCHIVE ERROR:", error);

    res.status(500).json({
      message: "Failed to update archive",
    });
  }
});


// =====================================================
// DUPLICATE NOTE
// =====================================================

router.post("/duplicate/:id", async (req, res) => {
  try {
    const originalNote = await Note.findById(req.params.id);

    if (!originalNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const duplicatedNote = new Note({
      title: `${originalNote.title} Copy`,
      content: originalNote.content,
      tags: originalNote.tags,
      color: originalNote.color,
    });

    const savedNote = await duplicatedNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("DUPLICATE ERROR:", error);

    res.status(500).json({
      message: "Failed to duplicate note",
    });
  }
});


// =====================================================
// INCREASE VIEW COUNT
// =====================================================

router.patch("/view/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          viewCount: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.error("VIEW COUNT ERROR:", error);

    res.status(500).json({
      message: "Failed to update view count",
    });
  }
});


// =====================================================
// BULK ARCHIVE
// =====================================================

router.patch("/bulk/archive", async (req, res) => {
  try {
    const ids = req.body.ids || [];

    await Note.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        archived: true,
      }
    );

    res.json({
      message: "Notes archived successfully",
    });
  } catch (error) {
    console.error("BULK ARCHIVE ERROR:", error);

    res.status(500).json({
      message: "Failed to archive notes",
    });
  }
});


// =====================================================
// BULK DELETE
// =====================================================

router.delete("/bulk/delete", async (req, res) => {
  try {
    const ids = req.body.ids || [];

    await Note.deleteMany({
      _id: {
        $in: ids,
      },
    });

    res.json({
      message: "Notes deleted successfully",
    });
  } catch (error) {
    console.error("BULK DELETE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete notes",
    });
  }
});


// =====================================================
// DELETE NOTE
// =====================================================

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(
      req.params.id
    );

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
});


module.exports = router;