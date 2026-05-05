import React, { useEffect, useState } from "react";
import axios from "axios";
//import API_BASE_URL from "./config";
import "./StudentDashboard.css";

import {
  FaTachometerAlt,
  FaBook,
  FaGraduationCap,
  FaTools,
  FaCertificate,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
const API_BASE_URL = "https://learnsphere-backend-3-6nn6.onrender.com";


const userEmail = localStorage.getItem("userEmail") || "";
const userRole = localStorage.getItem("userRole") || "";
const userName = localStorage.getItem("name") || "";

function StudentDashboard() {

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ===== ADDED: lesson related states =====
  const [lessons, setLessons] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeMenu === "myCourses") {
      fetchMyCourses();
    }
  }, [activeMenu]);

  const fetchCourses = () => {
    axios
      .get(`${API_BASE_URL}/api/student/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  };

  const fetchMyCourses = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      const res = await axios.get(
        `${API_BASE_URL}/api/student/${studentId}/courses`
      );
      setMyCourses(res.data || []);
    } catch (error) {
      console.error("Error fetching my courses:", error);
    }
  };

  // ===== ADDED: fetch lessons for a course =====
  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/lessons/course/${courseId}`
      );

      setLessons((prev) => ({
        ...prev,
        [courseId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const handleBuy = (course) => {
    setMyCourses([...myCourses, { ...course, progress: 0 }]);
    alert("Course added to My Courses (UI Only)");
  };

  const handleSkillAdd = () => {
    if (!newSkill.trim()) return;

    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }

    setNewSkill("");
    setShowInput(false);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={`student-container ${collapsed ? "collapsed" : ""}`}>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="company-logo">
          <h2>CHARDHO</h2>
          <p>AMBITION, GROWTH, DREAMS</p>
        </div>

        <div className="profile-section">
          <label htmlFor="upload">
            <img
              src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="profile"
              className="profile-pic"
            />
          </label>

          <input type="file" id="upload" hidden onChange={handleImageUpload} />

          {!collapsed && (
            <>
              <h3>{userName}</h3>
              <p>{userRole}</p>
            </>
          )}
        </div>

        <ul>
          <li onClick={() => setActiveMenu("dashboard")}>
            <FaTachometerAlt /> {!collapsed && <span>Dashboard</span>}
          </li>

          <li onClick={() => setActiveMenu("viewCourses")}>
            <FaBook /> {!collapsed && <span>View Courses</span>}
          </li>

          <li onClick={() => setActiveMenu("myCourses")}>
            <FaGraduationCap /> {!collapsed && <span>My Courses</span>}
          </li>

          <li onClick={() => setActiveMenu("skills")}>
            <FaTools /> {!collapsed && <span>Skills</span>}
          </li>

          <li onClick={() => setActiveMenu("certificates")}>
            <FaCertificate /> {!collapsed && <span>Certificates</span>}
          </li>
        </ul>

        <div className="sidebar-bottom">
          <div className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> {!collapsed && <span>Logout</span>}
          </div>

          <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">

        {/* Dashboard */}
        {activeMenu === "dashboard" && (
          <>
            <h2>Student Dashboard</h2>

            <div className="summary-cards">
              <div className="card">
                <h3>{courses.length}</h3>
                <p>Available Courses</p>
              </div>

              <div className="card">
                <h3>{myCourses.length}</h3>
                <p>Enrolled Courses</p>
              </div>

              <div className="card">
                <h3>{skills.length}</h3>
                <p>Total Skills</p>
              </div>
            </div>
          </>
        )}

        {/* View Courses */}
        {activeMenu === "viewCourses" && (
          <>
            <h2>Available Courses</h2>

            {courses.length === 0 && <p>No courses available.</p>}

            <div className="course-list">
              {courses.map((course) => (
                <div key={course.courseId} className="course-card">
                  <h3>{course.courseName}</h3>
                  <p>Price: ₹{course.coursePrice}</p>

                  {course.trainer && (
                    <p>Trainer: {course.trainer.name}</p>
                  )}

                  <button onClick={() => handleBuy(course)}>
                    Buy or Enroll
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= MY COURSES ================= */}

        {activeMenu === "myCourses" && (
          <>
            <h2>My Courses</h2>

            {myCourses.length === 0 ? (
              <p>No courses assigned yet.</p>
            ) : (

              <div className="course-list">

                {myCourses.map((course) => (

                  <div key={course.courseId} className="course-card">

                    <h3>{course.courseName}</h3>
                    <p>Price: ₹{course.coursePrice}</p>

                    {course.trainer && (
                      <p>Trainer: {course.trainer.name}</p>
                    )}

                    {/* VIEW LESSON BUTTON */}

                    <button
                      onClick={() => {

                        if (expandedCourse === course.courseId) {

                          setExpandedCourse(null);
                          setSelectedVideo(null);

                        } else {

                          setExpandedCourse(course.courseId);
                          fetchLessons(course.courseId);

                        }

                      }}
                    >
                      {expandedCourse === course.courseId
                        ? "Hide Lessons"
                        : "View Lessons"}
                    </button>

                    {/* LESSON SECTION */}

                    {expandedCourse === course.courseId && (

                      <div className="lesson-section">

                        <div className="lesson-list">

                          {lessons[course.courseId]?.map((lesson) => (

                            <div
                              key={lesson.lessonId}
                              className="lesson-item"

                              onClick={() =>
                                setSelectedVideo(lesson.lessonVideoLink)
                              }
                            >

                              {lesson.lessonName}

                            </div>

                          ))}

                        </div>

                        <div className="video-player">

                          {selectedVideo ? (

                            <iframe
                              width="100%"
                              height="350"
                              src={selectedVideo? selectedVideo.replace("watch?v=", "embed/").replace("youtu.be/","youtube.com/embed/"):""}
                              title="Lesson Video"
                              frameBorder="0"
                              allowFullScreen
                            />

                          ) : (

                            <p>Select a lesson to watch</p>

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )}

          </>
        )}

        {/* Skills */}
        {activeMenu === "skills" && (
          <>
            <h2>Skills</h2>

            <div className="skills-list">
              {skills.length === 0 && <p>No skills added yet.</p>}

              {skills.map((skill, index) => (
                <span key={index} className="skill-badge custom">
                  {skill}
                  <FaTimes onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>

            {showInput ? (
              <div className="skill-input-small">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter skill"
                />
                <button onClick={handleSkillAdd}>Add</button>
              </div>
            ) : (
              <div className="add-skill-btn" onClick={() => setShowInput(true)}>
                <FaPlus /> Add Skill
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;