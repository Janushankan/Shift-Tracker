import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaPlay,
  FaPause,
  FaRedo,
  FaStop,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [status, setStatus] = useState("Not Started");
  const [totalHours, setTotalHours] = useState("0h 00m");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [shiftHistory, setShiftHistory] = useState([]);
  //   const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const [timerInterval, setTimerInterval] = useState(null);
  const [breaks, setBreaks] = useState([]); // stores array of { start, end }
  const [breakStartTime, setBreakStartTime] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Get location
  const captureLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          console.log("Captured location:", latitude, longitude);
        },
        (err) => {
          console.error("Location error:", err.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handlers for shift actions
  const handleStart = async () => {
    captureLocation();
    setStatus("Working");
    localStorage.setItem("shiftStatus", "Working");
    const startTime = Date.now();
    localStorage.setItem("shiftStartTime", startTime.toString());
    setTimer(0);
    startTimer();

    try {
      await api.post("/shifts/start", {
        timestamp: new Date().toISOString(),
        location,
      });
      console.log("Shift started");
    } catch (err) {
      console.error("Start shift error:", err);
    }
  };

  const handleBreak = async () => {
    captureLocation();
    setStatus("On Break");
    localStorage.setItem("shiftStatus", "On Break");
    pauseTimer();

    const now = Date.now();
    setBreakStartTime(now);
    console.log("Break started at:", new Date(now));

    try {
      await api.post("/shifts/break", {
        timestamp: new Date().toISOString(),
        location,
      });
    } catch (err) {
      console.error("Break error:", err);
    }
  };

  const handleResume = async () => {
    captureLocation();
    setStatus("Working");
    localStorage.setItem("shiftStatus", "Working");
    startTimer();

    const now = Date.now();
    if (breakStartTime) {
      const newBreak = {
        start: breakStartTime,
        end: now,
      };
      setBreaks((prev) => [...prev, newBreak]);
      setBreakStartTime(null);
      console.log("Break ended at:", new Date(now));
    }

    try {
      await api.post("/shifts/resume", {
        timestamp: new Date().toISOString(),
        location,
      });
    } catch (err) {
      console.error("Resume error:", err);
    }
  };

  const handleEnd = async () => {
    captureLocation();
    setStatus("Ended");
    localStorage.setItem("shiftStatus", "Ended");
    pauseTimer();
    localStorage.removeItem("shiftStartTime");
    localStorage.removeItem("shiftStatus");

    try {
      const res = await api.post("/shifts/end", {
        timestamp: new Date().toISOString(),
        location,
      });
      const total = res.data.totalWorked || "0h 00m";
      setTotalHours(total);
      console.log("Shift ended");
      localStorage.removeItem("shiftBreaks");
    } catch (err) {
      console.error("End shift error:", err);
    }
  };

  const getTotalBreakTime = () => {
    const totalSeconds = breaks.reduce((acc, brk) => {
      return acc + Math.floor((brk.end - brk.start) / 1000);
    }, 0);
    return formatTime(totalSeconds);
  };

  const startTimer = () => {
    if (!timerInterval) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

  const resetTimer = () => {
    clearInterval(timerInterval);
    setTimer(0);
    setTimerInterval(null);
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleLogout = () => {
    // TEMP: Remove user session from storage if used
    localStorage.clear(); // optional
    navigate("/");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/shifts/history");
        setShiftHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch shift history:", err);
      }
    };

    fetchHistory();

    // Restore status and timer if previously active
    const storedStatus = localStorage.getItem("shiftStatus");
    const storedStartTime = localStorage.getItem("shiftStartTime");

    if (storedStatus) {
      setStatus(storedStatus);
    }

    if (storedStatus === "Working" && storedStartTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(storedStartTime)) / 1000
      );
      setTimer(elapsed);
      startTimer();
    }
  }, []);

  useEffect(() => {
    const storedBreaks = JSON.parse(
      localStorage.getItem("shiftBreaks") || "[]"
    );
    setBreaks(storedBreaks);
  }, []);

  useEffect(() => {
    localStorage.setItem("shiftBreaks", JSON.stringify(breaks));
  }, [breaks]);

  return (
    <div className="flex h-screen w-screen">
      <>
        {/* Mobile menu toggle */}
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">
          Welcome
          {/* Welcome{user?.name ? `, ${user.name}` : ""}! */}
        </h1>
        {/* Shift Controls, Work Summary, and History will go here */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Start Shift */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Start Shift</h2>
            <button
              onClick={handleStart}
              className="!bg-green-500 !text-white !px-6 !py-2 flex items-center gap-2 hover:!bg-green-600 !transition !hover:outline-none !focus:outline-none !border-none !outline-none"
            >
              <FaPlay /> Start
            </button>
          </div>

          {/* Break */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Take a Break</h2>
            <button
              onClick={handleBreak}
              className="!bg-yellow-500 !text-white !px-6 !py-2 flex items-center gap-2 hover:!bg-yellow-600 !transition !hover:outline-none !focus:outline-none !border-none !outline-none"
            >
              <FaPause /> Break
            </button>
          </div>

          {/* Resume */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Resume Shift</h2>
            <button
              onClick={handleResume}
              className="!bg-blue-500 !text-white !px-6 !py-2 flex items-center gap-2 hover:!bg-blue-600 !transition !hover:outline-none !focus:outline-none !border-none !outline-none"
            >
              <FaRedo /> Resume
            </button>
          </div>

          {/* End Shift */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">End Shift</h2>
            <button
              onClick={handleEnd}
              className="!bg-red-500 !text-white !px-6 !py-2 flex items-center gap-2 hover:!bg-red-600 !transition !hover:outline-none !focus:outline-none !border-none !outline-none"
            >
              <FaStop /> End
            </button>
          </div>
        </div>
        {/* Today’s Summary */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Today's Summary</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                Current Status:
              </p>
              <p className="text-lg font-medium text-green-600">{status}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                Total Hours Worked:
              </p>
              <p className="text-lg font-medium text-blue-600">
                {status === "Working" ? formatTime(timer) : totalHours}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                Total Break Time:
              </p>
              <p className="text-lg font-medium text-yellow-600">
                {getTotalBreakTime()}
              </p>
            </div>
          </div>
        </div>

        {/* Shift History Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Shift History</h2>
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
                {shiftHistory.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500 italic" colSpan="5">
                      No shift history available.
                    </td>
                  </tr>
                ) : (
                  shiftHistory.map((shift, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 min-w-[120px]">
                        {new Date(shift.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 min-w-[120px]">{shift.start}</td>
                      <td className="p-4 min-w-[120px]">{shift.end}</td>
                      <td className="p-4 min-w-[120px]">
                        {index === 0 && status !== "Ended"
                          ? getTotalBreakTime()
                          : shift.breakDuration}
                      </td>
                      <td className="p-4 font-medium min-w-[120px]">
                        {shift.totalWorked}
                      </td>
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

export default Dashboard;
