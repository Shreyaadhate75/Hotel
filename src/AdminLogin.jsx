import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setError("Please enter your email.");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Please enter your password.");
        setLoading(false);
        return;
      }

      // Login with Supabase Auth
      const loginResult =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (loginResult.error) {
        console.error(
          "Supabase login error:",
          loginResult.error
        );

        setError(loginResult.error.message);
        setLoading(false);
        return;
      }

      const user = loginResult.data?.user;

      if (!user) {
        setError("Login failed. User was not found.");
        setLoading(false);
        return;
      }

      console.log("Logged in user:", user.id);

      // Check admin profile
      const profileResult = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileResult.error) {
        console.error(
          "Profile error:",
          profileResult.error
        );

        await supabase.auth.signOut();

        setError(
          `Profile Error: ${profileResult.error.message}`
        );

        setLoading(false);
        return;
      }

      const profile = profileResult.data;

      if (!profile) {
        await supabase.auth.signOut();

        setError(
          "No profile found for this account."
        );

        setLoading(false);
        return;
      }

      console.log("Profile:", profile);

      if (profile.role !== "admin") {
        await supabase.auth.signOut();

        setError(
          `Access denied. Current role: ${profile.role}`
        );

        setLoading(false);
        return;
      }

      console.log("ADMIN LOGIN SUCCESS");

      // Tell App.jsx that admin login succeeded
      if (typeof onLogin === "function") {
        onLogin(user);
      } else {
        console.error(
          "onLogin is not a function:",
          onLogin
        );

        setError(
          "Login succeeded, but admin page could not be opened."
        );
      }
    } catch (err) {
      console.error(
        "Unexpected login error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while signing in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-background">
        <div className="admin-login-glow admin-glow-one"></div>
        <div className="admin-login-glow admin-glow-two"></div>
      </div>

      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span>HR</span>
        </div>

        <div className="admin-login-heading">
          <p className="admin-login-label">
            HOTEL RAJWADA
          </p>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage your hotel menu,
            orders and reservations.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="admin-login-form"
        >
          <div className="admin-input-group">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <div className="admin-login-footer">
          <span>🔒</span>
          <span>Secure Admin Access</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;