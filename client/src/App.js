import React, { useState } from "react";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import MyNotes from "./pages/MyNotes";
import SmartSearch from "./pages/SmartSearch";
import TagsPage from "./pages/TagsPage";
import AIAssistant from "./pages/AIAssistant";
import AddNoteModal from "./components/AddNoteModal";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showAddNote, setShowAddNote] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "notes":
        return (
          <MyNotes
            onNewNote={() => setShowAddNote(true)}
          />
        );

      case "search":
        return <SmartSearch />;

      case "tags":
        return <TagsPage />;

      case "ai":
        return <AIAssistant />;

      case "settings":
        return (
          <main className="dashboard">
            <p className="welcome-text">Personalize your workspace</p>
            <h1>Settings</h1>
            <p className="subtitle">
              Appearance, motion, profile and application preferences.
            </p>
          </main>
        );

      case "dashboard":
      default:
        return (
          <Dashboard
            onNewNote={() => setShowAddNote(true)}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return (
    <>
      <MainLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        {renderPage()}
      </MainLayout>

      {showAddNote && (
        <AddNoteModal
          onClose={() => setShowAddNote(false)}
          onNoteAdded={() => {
            setShowAddNote(false);
            setCurrentPage("notes");
          }}
        />
      )}
    </>
  );
}

export default App;