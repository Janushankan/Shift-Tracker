import React, { useContext, useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaHistory,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, setIsDark } = useContext(ThemeContext);

  // Get collapse state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState.toString());
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `
      flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"}
      py-2 rounded-lg transition-all duration-200 ease-in-out
      text-sm ${isCollapsed ? "text-xl" : "text-base font-medium"}
      ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "text-gray-700 dark:text-gray-300"
      }
      hover:scale-[1.03] hover:!bg-blue-100 dark:hover:!bg-blue-900
      hover:!text-blue-600 dark:hover:!text-blue-400
      focus:outline-none hover:outline-none
    `;
  };

  // Automatically keep sidebar collapsed across navigation
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed") === "true";
    setIsCollapsed(stored);
  }, [location.pathname]);

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
          ${isCollapsed ? "w-20 px-2 py-4" : "w-64 p-4"}
          bg-white dark:bg-gray-800 shadow-md 
        `}
      >
        {/* Header with toggle collapse button */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } mb-6`}
        >
          {!isCollapsed && (
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Shift Tracker
            </h2>
          )}
          <button
            onClick={handleToggleCollapse}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-3">
          <button
            className={navLinkClasses("/dashboard")}
            onClick={() => {
              navigate("/dashboard");
              if (window.innerWidth < 768) toggleSidebar();
            }}
          >
            <FaTachometerAlt />
            {!isCollapsed && "Dashboard"}
          </button>

          <button
            className={navLinkClasses("/shift-history")}
            onClick={() => {
              navigate("/shift-history");
              if (window.innerWidth < 768) toggleSidebar();
            }}
          >
            <FaHistory />
            {!isCollapsed && "Shift History"}
          </button>

          <button
            className={`
                flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                }
                py-2 rounded-lg text-sm ${
                  isCollapsed ? "text-xl" : "text-base font-medium"
                }
                text-gray-700 dark:text-gray-300 hover:scale-[1.03]
                hover:!bg-red-100 dark:hover:!bg-red-900 hover:!text-red-600 dark:hover:!text-red-400
                focus:outline-none hover:outline-none transition-all duration-200 ease-in-out
              `}
            onClick={() => {
              handleLogout();
              if (window.innerWidth < 768) toggleSidebar();
            }}
          >
            <FaSignOutAlt />
            {!isCollapsed && "Logout"}
          </button>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="mt-8 border-t pt-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`
                flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                }
                py-2 rounded-lg transition-all duration-200 ease-in-out
                text-sm ${isCollapsed ? "text-xl" : "text-base font-medium"}
                text-gray-700 dark:text-gray-300
                hover:scale-[1.03] hover:!bg-yellow-100 dark:hover:!bg-yellow-800
                hover:!text-yellow-600 dark:hover:!text-yellow-400
                w-full
            `}
          >
            {isDark ? <FaSun /> : <FaMoon />}
            {!isCollapsed && (isDark ? "Light Mode" : "Dark Mode")}
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
