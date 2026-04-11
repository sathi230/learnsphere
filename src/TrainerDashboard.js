import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, Collapse, List } from "antd";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import "antd/dist/reset.css";
import "./TrainerDashboard.css";

const { Panel } = Collapse;

function TrainerDashboard() {
  const userEmail = localStorage.getItem("userEmail");

  const [collapsed, setCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [newCourse, setNewCourse] = useState({ courseName: "", coursePrice: "" });
  const [newLessons, setNewLessons] = useState({});

  useEffect(() => {
    if (userEmail) fetchCourses();
  }, [userEmail]);

  const fetchCourses = () => {
    axios
      .get(`http://localhost:8080/api/trainer/my-courses?email=${userEmail}`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  const handleAddCourse = () => {
    if (!newCourse.courseName || !newCourse.coursePrice) return;

    axios.post("http://localhost:8080/api/trainer/add-course", {
      courseName: newCourse.courseName,
      coursePrice: newCourse.coursePrice,
      trainerEmail: userEmail
    }).then(() => {
      setNewCourse({ courseName: "", coursePrice: "" });
      fetchCourses();
    });
  };

  const fetchLessons = (courseId) => {
    axios
      .get(`http://localhost:8080/api/trainer/lessons/${courseId}`)
      .then(res => setLessons(prev => ({ ...prev, [courseId]: res.data })))
      .catch(err => console.error(err));
  };

  const handleAddLesson = async (courseId) => {
    const lessonData = newLessons[courseId];
    if (!lessonData?.lessonName || !lessonData?.lessonTopic) return;

    try {
      const res = await axios.post("http://localhost:8080/api/trainer/add-lesson", {
        lessonName: lessonData.lessonName,
        lessonTopic: lessonData.lessonTopic,
        lessonVideoLink: lessonData.lessonVideoLink,
        courseId: courseId
      });

      setLessons(prev => ({
        ...prev,
        [courseId]: [...(prev[courseId] || []), res.data]
      }));

      setNewLessons(prev => ({
        ...prev,
        [courseId]: {}
      }));

    } catch (err) {
      console.error(err);
    }
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    try {
      let videoId = "";
      if (url.includes("youtube.com")) {
        const params = new URLSearchParams(url.split("?")[1]);
        videoId = params.get("v");
      } else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  };

  const getDriveEmbed = (url) => {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      return url.replace("/view", "/preview");
    }
    return null;
  };

  return (
    <div className="dashboard-container">

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <h2>{collapsed ? "TP" : "Trainer Panel"}</h2>
        <div className="menu-item active">Dashboard</div>

        <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </div>
      </div>

      <div className="main-content">

        <div className="summary-cards">
          <div className="summary-card">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
          <div className="summary-card">
            <h3>{Object.values(lessons).flat().length}</h3>
            <p>Total Lessons</p>
          </div>
        </div>

        <Card className="add-course-card" title="Add Course">
          <Input
            placeholder="Course Name"
            value={newCourse.courseName}
            onChange={e => setNewCourse({ ...newCourse, courseName: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="number"
            placeholder="Course Price"
            value={newCourse.coursePrice}
            onChange={e => setNewCourse({ ...newCourse, coursePrice: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" block onClick={handleAddCourse}>
            Save Course
          </Button>
        </Card>

        <Collapse accordion onChange={key => fetchLessons(key)} style={{ marginTop: 20 }}>
          {courses.map(course => (
            <Panel header={`${course.courseName} - ₹${course.coursePrice}`} key={course.courseId}>

              <div className="lesson-section">

                <Input
                  placeholder="Lesson Name"
                  value={newLessons[course.courseId]?.lessonName || ""}
                  onChange={e =>
                    setNewLessons(prev => ({
                      ...prev,
                      [course.courseId]: {
                        ...prev[course.courseId],
                        lessonName: e.target.value
                      }
                    }))
                  }
                  style={{ marginBottom: 8 }}
                />

                <Input
                  placeholder="Lesson Topic"
                  value={newLessons[course.courseId]?.lessonTopic || ""}
                  onChange={e =>
                    setNewLessons(prev => ({
                      ...prev,
                      [course.courseId]: {
                        ...prev[course.courseId],
                        lessonTopic: e.target.value
                      }
                    }))
                  }
                  style={{ marginBottom: 8 }}
                />

                <Input
                  placeholder="Video Link (YouTube / Google Drive)"
                  value={newLessons[course.courseId]?.lessonVideoLink || ""}
                  onChange={e =>
                    setNewLessons(prev => ({
                      ...prev,
                      [course.courseId]: {
                        ...prev[course.courseId],
                        lessonVideoLink: e.target.value
                      }
                    }))
                  }
                  style={{ marginBottom: 8 }}
                />

                <Button type="primary" block onClick={() => handleAddLesson(course.courseId)}>
                  Add Lesson
                </Button>

              </div>

              <List
                dataSource={lessons[course.courseId]}
                renderItem={lesson => (
                  <List.Item>
                    <div style={{ width: "100%" }}>
                      <h3>{lesson.lessonName}</h3>
                      <p>{lesson.lessonTopic}</p>

                      {getYoutubeEmbed(lesson.lessonVideoLink) && (
                        <iframe
                          width="420"
                          height="236"
                          src={getYoutubeEmbed(lesson.lessonVideoLink)}
                          title="Lesson Video"
                          allowFullScreen
                        />
                      )}

                      {getDriveEmbed(lesson.lessonVideoLink) && (
                        <iframe
                          width="420"
                          height="236"
                          src={getDriveEmbed(lesson.lessonVideoLink)}
                          title="Drive Video"
                          allow="autoplay"
                        />
                      )}

                    </div>
                  </List.Item>
                )}
              />

            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

export default TrainerDashboard;