import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Signup.css";// optional CSS file

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ------------------ Local Signup ------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
        role,
        provider: "local",
      });

      setMessage(response.data.message);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "host") navigate("/homes");
        else navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Google Signup/Login ------------------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);
      console.log("Google user:", decoded);

      const response = await axios.post("http://localhost:5000/google-login", {
        token,
      });

      setMessage(response.data.message);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "host") navigate("/");
        else navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessage("Google signup/login failed");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed");
  };

  // ------------------ Render ------------------
  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Account</h2>

        {message && (
          <p
            className={
              message.toLowerCase().includes("failed")
                ? "error-message"
                : "success-message"
            }
          >
            {message}
          </p>
        )}

        {/* Local Signup Form */}
        <form onSubmit={handleSignup}>
          <label>
            Full Name:
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">OR</div>

        {/* Google Signup/Login */}
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
