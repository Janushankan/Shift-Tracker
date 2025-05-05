import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FaBars, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ShiftHistory() {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // fetchHistory();
    const mockData = [
      {
        date: "2025-05-01",
        start: "09:00 AM",
        end: "05:00 PM",
        breakDuration: "1h 00m",
        totalWorked: "7h 00m",
      },
      {
        date: "2025-05-02",
        start: "10:00 AM",
        end: "06:30 PM",
        breakDuration: "30m",
        totalWorked: "8h 00m",
      },
      {
        date: "2025-05-04",
        start: "08:30 AM",
        end: "04:30 PM",
        breakDuration: "1h 15m",
        totalWorked: "7h 45m",
      },
      {
        date: "2025-05-01",
        start: "09:00 AM",
        end: "05:00 PM",
        breakDuration: "1h 00m",
        totalWorked: "7h 00m",
      },
      {
        date: "2025-05-02",
        start: "10:00 AM",
        end: "06:30 PM",
        breakDuration: "30m",
        totalWorked: "8h 00m",
      },
      {
        date: "2025-05-04",
        start: "08:30 AM",
        end: "04:30 PM",
        breakDuration: "1h 15m",
        totalWorked: "7h 45m",
      },
      {
        date: "2025-05-01",
        start: "09:00 AM",
        end: "05:00 PM",
        breakDuration: "1h 00m",
        totalWorked: "7h 00m",
      },
      {
        date: "2025-05-02",
        start: "10:00 AM",
        end: "06:30 PM",
        breakDuration: "30m",
        totalWorked: "8h 00m",
      },
      {
        date: "2025-05-04",
        start: "08:30 AM",
        end: "04:30 PM",
        breakDuration: "1h 15m",
        totalWorked: "7h 45m",
      },
      {
        date: "2025-05-01",
        start: "09:00 AM",
        end: "05:00 PM",
        breakDuration: "1h 00m",
        totalWorked: "7h 00m",
      },
      {
        date: "2025-05-02",
        start: "10:00 AM",
        end: "06:30 PM",
        breakDuration: "30m",
        totalWorked: "8h 00m",
      },
      {
        date: "2025-05-04",
        start: "08:30 AM",
        end: "04:30 PM",
        breakDuration: "1h 15m",
        totalWorked: "7h 45m",
      },
    ];
    setHistory(mockData);
    setFiltered(mockData);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/shifts/history");
      setHistory(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to load shift history", err);
    }
  };

  const handleSearch = () => {
    if (!startDate && !endDate) {
      setFiltered(history);
      return;
    }

    const results = history.filter((shift) => {
      const shiftDate = new Date(shift.date);
      if (startDate && endDate) {
        return shiftDate >= startDate && shiftDate <= endDate;
      } else if (startDate) {
        return shiftDate >= startDate;
      } else if (endDate) {
        return shiftDate <= endDate;
      }
      return true;
    });

    setFiltered(results);
  };

  return (
    <div className="flex h-screen w-screen">
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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Shift History</h2>

          {/* 🔍 Date Range Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start date"
              className="p-2 border border-gray-300 rounded w-full sm:w-auto"
              dateFormat="MM/dd/yyyy"
              maxDate={endDate}
              isClearable
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End date"
              className="p-2 border border-gray-300 rounded w-full sm:w-auto"
              dateFormat="MM/dd/yyyy"
              minDate={startDate}
              isClearable
            />
            <button
              onClick={handleSearch}
              disabled={!startDate && !endDate}
              className={`px-4 py-2 rounded !text-white ${
                startDate || endDate
                  ? "!bg-blue-600 hover:!bg-blue-700"
                  : "!bg-gray-400 cursor-not-allowed"
              } transition`}
            >
              Search
            </button>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setFiltered(history);
                }}
                className="px-4 py-2 rounded !bg-gray-300 hover:!bg-gray-400 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* 📊 Table */}
          <div className="w-full max-h-[70vh] overflow-y-auto overflow-x-auto bg-white rounded-xl shadow-md relative">
            <table className="min-w-full min-h-[100px] text-left border-separate border-spacing-0">
              <thead className="sticky top-0 bg-gray-50 z-10">
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
                {filtered.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500 italic" colSpan="5">
                      No matching history.
                    </td>
                  </tr>
                ) : (
                  filtered.map((shift, index) => (
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
