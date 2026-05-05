import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();   // VERY IMPORTANT (prevents page reload)

    try {

      await axios.post(`${API_BASE_URL}/api/register`, {
        username: name,
        email: email,
        password: password,
        role: role
      });

      alert("Registered Successfully");
      navigate("/login");

    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>

        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="STUDENT">Student</option>
          <option value="TRAINER">Trainer</option>
        </select>

        <button type="submit">Register</button>

      </form>

      <p>
        Already registered?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
