import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // optional CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ------------------ Local Login ------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
        provider: "local",
      });

      setMessage(response.data.message);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        // Redirect based on user email
        if (response.data.user.email === "sathya271305@gmail.com") {
          navigate("/admin");
        } else if (response.data.user.role === "host") {
          navigate("/homes");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Google Login ------------------
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

        // Redirect based on user email for Google login too
        if (response.data.user.email === "sathya271305@gmail.com") {
          navigate("/admin");
        } else if (response.data.user.role === "host") {
          navigate("/homes");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed");
  };

  // ------------------ Render ------------------
  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login</h2>

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

        {/* Local Login Form */}
        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        {/* Google Login */}
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;