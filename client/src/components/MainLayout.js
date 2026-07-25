import React from "react";
import Sidebar from "./Sidebar";

function MainLayout({
  children,
  currentPage,
  setCurrentPage,
}) {
  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;