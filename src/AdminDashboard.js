import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]); // <-- Add this state

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentMobile, setStudentMobile] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ===================== Fetch summary data =====================
  const fetchDashboardData = async () => {
    try {
      const courseRes = await fetch("http://localhost:8080/api/admin/totalCourses");
      const studentRes = await fetch("http://localhost:8080/api/admin/totalStudents");
      const trainerRes = await fetch("http://localhost:8080/api/admin/totalTrainers");

      const totalCourses = await courseRes.json();
      const totalStudents = await studentRes.json();
      const totalTrainers = await trainerRes.json();

      setTotalCourses(totalCourses);
      setTotalStudents(totalStudents);
      setTotalTrainers(totalTrainers);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  // ===================== Fetch lists =====================
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/students");
      const data = await res.json();
      setStudents(data || []); // <-- Always default to array
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/courses");
      const data = await res.json();
      setCourses(data || []); // <-- Always default to array
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/trainers"); // <-- Add backend API
      const data = await res.json();
      setTrainers(data || []); // <-- Always default to array
    } catch (error) {
      console.error("Error fetching trainers", error);
    }
  };

  // ===================== Assign course =====================
  const assignCourse = async () => {
    if (!selectedStudent || !selectedCourse) return;
        const body = {
        studentName: selectedStudent,
        courseName: selectedCourse,
        mobile: studentMobile // send mobile to backend
        }; // <-- safety check
    try {
      const res = await fetch("http://localhost:8080/api/admin/assign-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });if (res.ok) {
      setMessage("Course Assigned Successfully");
      setStudentMobile("");
      setSelectedStudent("");
      setSelectedCourse("");
    } else {
      const text = await res.text();
      setMessage("Error: " + text);
    }
      
    } catch (error) {
      console.error("Error assigning course", error);
      setMessage("Error assigning course");
    }
  };

  return (
    <div className={collapsed ? "admin-container collapsed" : "admin-container"}>

      {/* ===================== SIDEBAR ===================== */}
      <div className="sidebar">
        <div className="logo-section">
          <img src="/images/companylogo.png" alt="logo" />
          {!collapsed && <h3>LearnSphere</h3>}
        </div>

        <div className="profile-section">
          <img src="/images/profile.png" alt="profile" />
          {!collapsed && <p>Admin</p>}
        </div>

        <div className="menu">
          {/* ===== DASHBOARD ===== */}
          <div className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}
               onClick={() => setActiveMenu("dashboard")}>
            Dashboard
          </div>

          {/* ===== COURSES ===== */}
          <div className={`menu-item ${activeMenu === "courses" ? "active" : ""}`}
               onClick={() => { setActiveMenu("courses"); fetchCourses(); }}>
            All Courses
          </div>

          {/* ===== STUDENTS ===== */}
          <div className={`menu-item ${activeMenu === "students" ? "active" : ""}`}
               onClick={() => { setActiveMenu("students"); fetchStudents(); }}>
            Students
          </div>

          {/* ===== ASSIGN COURSE ===== */}
          <div className={`menu-item ${activeMenu === "assign" ? "active" : ""}`}
               onClick={() => { setActiveMenu("assign"); fetchStudents(); fetchCourses(); }}>
            Assign Course
          </div>

          {/* ===== TRAINERS ===== */}
          <div className={`menu-item ${activeMenu === "trainers" ? "active" : ""}`}
               onClick={() => { setActiveMenu("trainers"); fetchTrainers(); }}> {/* <-- Added */}
            Trainers
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
          {!collapsed && <button className="logout-btn">Logout</button>}
        </div>
      </div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="main-content">

        {/* ===== DASHBOARD ===== */}
        {activeMenu === "dashboard" && (
          <>
            <h1>Admin Dashboard</h1>
            <div className="cards">
              <div className="card"><h3>Total Courses</h3><p>{totalCourses}</p></div>
              <div className="card"><h3>Total Students</h3><p>{totalStudents}</p></div>
              <div className="card"><h3>Total Trainers</h3><p>{totalTrainers}</p></div>
            </div>
          </>
        )}

        {/* ===== COURSES ===== */}
        {activeMenu === "courses" && (
          <>
            <h2>All Courses</h2>
            <table className="styled-table">
              <thead>
                <tr><th>ID</th><th>Course Name</th></tr>
              </thead>
              <tbody>
                {(courses || []).map(c => ( // <-- default empty array
                  <tr key={c.courseId}>  {/* <-- use correct key */}
                    <td>{c.courseId}</td>
                    <td>{c.courseName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ===== STUDENTS ===== */}
        {activeMenu === "students" && (
          <>
            <h2>Students</h2>
            <table className="styled-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th></tr>
              </thead>
              <tbody>
                {(students || []).map(s => (
                  <tr key={s.userId}> {/* <-- unique key */}
                    <td>{s.userId}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ===== ASSIGN COURSE ===== */}
        {activeMenu === "assign" && (
          <>
            <h2>Assign Course</h2>
            <div className="assign-box">
               <input
                 type="text"
                  placeholder="Enter Student Name"
                    value={selectedStudent}
                 onChange={(e) => setSelectedStudent(e.target.value)}
                />
                <input type="text"
               placeholder="Update Mobile Number (optional)"
               value={studentMobile}
               onChange={(e) => setStudentMobile(e.target.value)}
               />

              <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                <option value="">Select Course</option>
                {(courses || []).map(c => (
                  <option key={c.courseId} value={c.courseName}>{c.courseName}</option>
                ))}
              </select>

              <button onClick={assignCourse}>Assign</button>
            </div>
            {message && <p className="success">{message}</p>}
          </>
        )}

        {/* ===== TRAINERS ===== */}
        {activeMenu === "trainers" && (
          <>
            <h2>Trainers</h2>
            <table className="styled-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th></tr>
              </thead>
              <tbody>
                {(trainers || []).map(t => (
                  <tr key={t.userId}>
                    <td>{t.userId}</td>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;