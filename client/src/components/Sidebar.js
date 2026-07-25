import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  StickyNote,
  Search,
  Tags,
  Sparkles,
  BrainCircuit,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";

function Sidebar({ currentPage, setCurrentPage }) {
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "notes",
      label: "My Notes",
      icon: StickyNote,
    },
    {
      id: "search",
      label: "Smart Search",
      icon: Search,
    },
    {
      id: "tags",
      label: "Collections",
      icon: Tags,
    },
    {
      id: "ai",
      label: "AI Assistant",
      icon: Sparkles,
    },
  ];

  const changePage = (page) => {
    setCurrentPage(page);
    setProfileOpen(false);
  };

  return (
    <>
      <motion.aside
        className={`adaptive-sidebar ${
          expanded ? "expanded" : ""
        }`}
        animate={{
          width: expanded ? 245 : 88,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="adaptive-logo">
          <div className="adaptive-logo-icon">
            <BrainCircuit size={25} />
          </div>

          {expanded && (
            <motion.div
              className="adaptive-brand-copy"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <strong>AI-KA</strong>
              <span>Knowledge Studio</span>
            </motion.div>
          )}
        </div>

        <nav className="adaptive-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;

            return (
              <button
                key={item.id}
                className={`adaptive-nav-item ${
                  active ? "active" : ""
                }`}
                onClick={() => changePage(item.id)}
              >
                {active && (
                  <motion.div
                    className="adaptive-active-pill"
                    layoutId="activeNavigationPill"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <Icon size={21} />

                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="adaptive-sidebar-bottom">
          <button
            className="profile-orb-button"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
          >
            <div className="profile-orb">P</div>

            {expanded && (
              <>
                <div className="profile-orb-copy">
                  <strong>Preethi</strong>
                  <span>Knowledge Explorer</span>
                </div>

                <ChevronRight size={17} />
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {profileOpen && (
        <motion.div
          className="utility-island"
          initial={{
            opacity: 0,
            x: -20,
            y: 20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
          }}
        >
          <div className="utility-profile">
            <div className="utility-avatar">P</div>

            <div>
              <strong>Preethi</strong>
              <p>Your personal knowledge space</p>
            </div>
          </div>

          <div className="utility-divider" />

          <button className="utility-action">
            <User size={18} />
            Profile
          </button>

          <button
            className="utility-action"
            onClick={() => changePage("settings")}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="utility-divider" />

          <div className="utility-status">
            <span className="status-dot" />

            <div>
              <strong>Knowledge Base</strong>
              <p>MongoDB connected</p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Sidebar;