import React, { useState } from "react";
import axios from "axios";
//import API_BASE_URL from "./config"; 

import "./Login.css";
const API_BASE_URL = "https://learnsphere-backend-3-6nn6.onrender.com";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  // ===== OTP STATES =====
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ===== LOGIN WITH EMAIL/PASSWORD =====
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        { email, password }
      );

      // FIXED: use full response object, not response.data.role
      const user = response.data;

      // Save user data
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("token", user.token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userId", user.userId);

      // Redirect based on role
      if (user.role === "ADMIN") {
        window.location.href = "/admin-dashboard";
      } else if (user.role === "TRAINER") {
        window.location.href = "/trainer-dashboard";
      } else {
        window.location.href = "/student-dashboard";
      }
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  // ===== SEND OTP =====
  const sendOtp = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/send-otp`,
        null,
        { params: { mobile } }
      );

      alert("OTP sent to your mobile");
      setOtpSent(true);
    } catch (error) {
      alert("Mobile number not registered");
    }
  };

  // ===== VERIFY OTP =====
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/verify-otp`,
        null,
        { params: { mobile, otp } }
      );

      const user = response.data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("name", user.name);

      if (user.role === "TRAINER") {
        window.location.href = "/trainer-dashboard";
      } else {
        window.location.href = "/student-dashboard";
      }
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  // ===== REGISTER =====
  const handleRegister = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/register`,
        { name, email, password, role }
      );

      alert("Registration Successful. Please Login.");
      setIsRegister(false);
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="left-section">
        <div className="left-content">
          <h1>LearnSphere</h1>
          <p>Upgrade your skills with professional online courses.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <div className="login-card">
          <h2>{isRegister ? "Register" : "Sign In"}</h2>

          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="STUDENT">Student</option>
                <option value="TRAINER">Trainer</option>
              </select>
            </>
          )}

          {!isRegister && (
            <>
              {/* EMAIL/PASSWORD LOGIN */}
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>

              <p style={{ textAlign: "center" }}>OR</p>

              {/* OTP LOGIN */}
              <input
                type="text"
                placeholder="Mobile Number"
                onChange={(e) => setMobile(e.target.value)}
              />
              <button onClick={sendOtp}>Send OTP</button>

              {otpSent && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button onClick={verifyOtp}>Verify OTP</button>
                </>
              )}
            </>
          )}

          {/* TOGGLE REGISTER/LOGIN */}
          <p>
            {isRegister ? "Already have an account?" : "New User?"}{" "}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;