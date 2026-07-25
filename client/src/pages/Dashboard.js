import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  StickyNote,
  Tags,
  Sparkles,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";

import { getAllNotes } from "../services/noteService";

function Dashboard({ onNewNote }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const text = `
      ${note.title || ""}
      ${note.content || ""}
      ${(note.tags || []).join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const allTags = [
    ...new Set(notes.flatMap((note) => note.tags || [])),
  ];

  const animation = {
    hidden: {
      opacity: 0,
      y: 40,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <main className="new-dashboard">

      {/* HERO */}

      <motion.section
        className="workspace-hero"
        initial="hidden"
        animate="visible"
        variants={animation}
      >
        <div className="hero-copy">

          <p className="editorial-label">
            YOUR PERSONAL KNOWLEDGE SPACE
          </p>

          <h1>
            Good evening,
            <br />
            Preethi.
          </h1>

          <p className="hero-description">
            Capture ideas, revisit what you've learned and
            discover connections across your knowledge.
          </p>

        </div>

        <div className="hero-art">

          <div className="art-circle circle-one"></div>

          <div className="art-circle circle-two"></div>

          <div className="floating-book">
            <BookOpen size={45} />
          </div>

        </div>

      </motion.section>


      {/* AI SEARCH */}

      <motion.section
        className="command-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div className="command-bar">

          <Sparkles size={22} />

          <input
            type="text"
            placeholder="Search notes, topics or ask AI anything..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button>
            <ArrowRight size={20} />
          </button>

        </div>


        <div className="prompt-chips">

          <button>Summarize my notes</button>

          <button>What did I save about Java?</button>

          <button>Show my AI notes</button>

          <button>Plan today's study</button>

        </div>

      </motion.section>


      {/* STATS */}

      <motion.section
        className="editorial-stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div className="editorial-card peach-card">

          <StickyNote size={25} />

          <p>Total Documents</p>

          <h2>{notes.length}</h2>

          <span>Your growing knowledge library</span>

        </div>


        <div className="editorial-card sage-card">

          <Tags size={25} />

          <p>Collections</p>

          <h2>{allTags.length}</h2>

          <span>Topics you've explored</span>

        </div>


        <div className="editorial-card lavender-card">

          <BrainCircuit size={25} />

          <p>AI Workspace</p>

          <h2>Ready</h2>

          <span>Ask questions from your notes</span>

        </div>

      </motion.section>


      {/* RECENT DOCUMENTS */}

      <motion.section
        className="dashboard-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div className="section-heading">

          <div>
            <p className="editorial-label">
              YOUR LIBRARY
            </p>

            <h2>Recent Documents</h2>
          </div>

          <button className="text-button">
            View all
            <ChevronRight size={18} />
          </button>

        </div>


        <div className="document-slider">

          {filteredNotes.map((note, index) => (

            <motion.article
              className="document-card"
              key={note._id}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                duration: 0.25,
              }}
            >

              <div
                className={`document-icon icon-${index % 4}`}
              >
                <StickyNote size={22} />
              </div>


              <div className="document-info">

                <h3>{note.title}</h3>

                <p>
                  {note.content?.slice(0, 110)}
                  {note.content?.length > 110
                    ? "..."
                    : ""}
                </p>

              </div>


              <div className="document-tags">

                {(note.tags || [])
                  .slice(0, 3)
                  .map((tag) => (

                    <span key={tag}>
                      {tag}
                    </span>

                  ))}

              </div>

            </motion.article>

          ))}

        </div>

      </motion.section>


      {/* CONTINUE LEARNING */}

      <motion.section
        className="dashboard-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div className="section-heading">

          <div>
            <p className="editorial-label">
              PICK UP WHERE YOU LEFT OFF
            </p>

            <h2>Continue Exploring</h2>
          </div>

        </div>


        <div className="learning-grid">

          <motion.div
            className="learning-feature"
            whileHover={{
              scale: 1.01,
            }}
          >

            <div>

              <span className="small-label">
                FEATURED TOPIC
              </span>

              <h2>
                Build connections between everything
                you've learned.
              </h2>

              <p>
                Your knowledge becomes more valuable
                when ideas connect across documents,
                topics and questions.
              </p>

              <button className="primary-action">
                Explore Knowledge

                <ArrowRight size={18} />
              </button>

            </div>


            <div className="feature-visual">

              <div className="knowledge-orbit">

                <span>AI</span>

                <span>Java</span>

                <span>DSA</span>

                <span>ML</span>

              </div>

            </div>

          </motion.div>


          <motion.div
            className="learning-small rose-panel"
            whileHover={{
              y: -6,
            }}
          >

            <Sparkles size={28} />

            <h3>Ask your knowledge</h3>

            <p>
              Find answers directly from the notes
              you've saved.
            </p>

            <button>
              Open AI Assistant
              <ArrowRight size={17} />
            </button>

          </motion.div>

        </div>

      </motion.section>


      {/* COLLECTIONS */}

      <motion.section
        className="dashboard-section collections-preview"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div className="section-heading">

          <div>

            <p className="editorial-label">
              ORGANIZE YOUR THINKING
            </p>

            <h2>Collections & Topics</h2>

          </div>

        </div>


        <div className="collection-strip">

          {allTags.slice(0, 8).map((tag, index) => (

            <motion.div
              className={`collection-tile collection-${
                index % 4
              }`}
              key={tag}
              whileHover={{
                y: -7,
              }}
            >

              <span>
                0{index + 1}
              </span>

              <h3>{tag}</h3>

              <p>
                Explore notes and ideas related to
                {` ${tag}`}.
              </p>

              <ArrowRight size={20} />

            </motion.div>

          ))}

        </div>

      </motion.section>


      {/* AI SHOWCASE */}

      <motion.section
        className="ai-showcase"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
      >

        <div>

          <p className="editorial-label">
            KNOWLEDGE-POWERED ASSISTANCE
          </p>

          <h2>
            Your notes.
            <br />
            More useful with AI.
          </h2>

          <p>
            Ask questions, revisit concepts and discover
            useful information from your personal
            knowledge base.
          </p>


          <button className="primary-action">

            <Sparkles size={18} />

            Start a Conversation

          </button>

        </div>


        <div className="assistant-preview">

          <div className="preview-message user-preview">
            What did I save about Word2Vec?
          </div>

          <div className="preview-message ai-preview">

            <Sparkles size={17} />

            <p>
              Word2Vec converts words into numerical
              vectors that capture semantic relationships.
            </p>

          </div>

        </div>

      </motion.section>


      {/* FLOATING ADD NOTE */}

      <motion.button
        className="floating-add-note"
        onClick={onNewNote}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
      >

        <Plus size={21} />

        New Note

      </motion.button>

    </main>
  );
}

export default Dashboard;