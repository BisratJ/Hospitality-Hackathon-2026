import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://alx-hackathon-api.bisrojc60.workers.dev";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Hospitality Hackathon 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white p-2.5 text-sm focus:border-red-500 focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white p-2.5 text-sm focus:border-red-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)", boxShadow: "0 4px 14px rgba(220,38,38,0.35)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
