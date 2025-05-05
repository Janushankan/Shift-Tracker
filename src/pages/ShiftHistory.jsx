import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FaBars, FaTimes } from "react-icons/fa";

function ShiftHistory() {
  const [history, setHistory] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/shifts/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load shift history", err);
    }
  };

  const filteredHistory = history.filter((shift) => {
    return searchDate
      ? new Date(shift.date).toLocaleDateString().includes(searchDate)
      : true;
  });

  return (
    <div className="flex h-screen w-screen">
      {/* Mobile Toggle + Sidebar */}
      <>
        <div className="md:hidden fixed top-4 left-4 z-20">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 bg-white p-2 rounded shadow-md"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Shift History</h2>
          <input
            type="text"
            placeholder="Search by date (MM/DD/YYYY)"
            className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />

          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600 min-w-[120px]">
                    Date
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 min-w-[120px]">
                    Start
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 min-w-[120px]">
                    End
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 min-w-[120px]">
                    Breaks
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 min-w-[120px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500 italic" colSpan="5">
                      No matching history.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((shift, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 min-w-[120px]">
                        {new Date(shift.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 min-w-[120px]">{shift.start}</td>
                      <td className="p-4 min-w-[120px]">{shift.end}</td>
                      <td className="p-4 min-w-[120px]">
                        {shift.breakDuration}
                      </td>
                      <td className="p-4 min-w-[120px]">{shift.totalWorked}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShiftHistory;
