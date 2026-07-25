const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

router.post("/ask", async (req, res) => {
  try {
    const question = (req.body.question || "").trim();

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const words = question
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2);

    const notes = await Note.find();

    const matchingNotes = notes.filter((note) => {
      const searchableText = [
        note.title || "",
        note.content || "",
        ...(note.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return words.some((word) => searchableText.includes(word));
    });

    if (matchingNotes.length === 0) {
      return res.json({
        answer:
          "I couldn't find relevant information in your saved knowledge.",
        sources: [],
      });
    }

    const bestMatches = matchingNotes.slice(0, 3);

    const answer = bestMatches
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n\n");

    res.json({
      answer,
      sources: bestMatches.map((note) => note.title),
    });
  } catch (error) {
    console.error("AI ASK ERROR:", error);

    res.status(500).json({
      message: "Failed to search knowledge",
    });
  }
});

module.exports = router;