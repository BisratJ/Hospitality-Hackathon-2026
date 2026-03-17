import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://alx-hackathon-api.bisrojc60.workers.dev";

const StatCard = ({ label, value, sub, color }) => (
  <div className="rounded-2xl border border-white/10 p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: color || "#a3a3a3" }}>{label}</div>
    <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{value}</div>
    {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [checkingIn, setCheckingIn] = useState({}); // track per-row loading state

  const token = sessionStorage.getItem("admin_token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = useCallback(async () => {
    if (!token) { navigate("/admin"); return; }
    setLoading(true);
    try {
      const [statsRes, regRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/registrations`, { headers }),
      ]);
      if (statsRes.status === 401 || regRes.status === 401) {
        sessionStorage.removeItem("admin_token");
        navigate("/admin");
        return;
      }
      setStats(await statsRes.json());
      setRegistrations(await regRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { headers });
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = () => { sessionStorage.removeItem("admin_token"); navigate("/admin"); };

  // Manual check-in / undo for a single registration row
  const handleManualCheckIn = async (e, reg) => {
    e.stopPropagation(); // prevent row expansion
    const ticketNumber = reg.ticketNumber;
    if (!ticketNumber) return;

    setCheckingIn(prev => ({ ...prev, [ticketNumber]: true }));

    try {
      let res;
      if (!reg.checkInStatus) {
        // Check IN
        res = await fetch(`${API_URL}/api/checkin/${ticketNumber}`, {
          method: "POST",
          headers,
        });
      } else {
        // Undo check-in
        res = await fetch(`${API_URL}/api/admin/undo-checkin/${ticketNumber}`, {
          method: "PUT",
          headers,
        });
      }

      if (res.ok) {
        // Optimistically update the row in local state
        setRegistrations(prev => prev.map(r => {
          if (r.ticketNumber === ticketNumber) {
            return { ...r, checkInStatus: !reg.checkInStatus };
          }
          return r;
        }));
        // Refresh stats quietly
        fetchStats();
      }
    } catch (err) {
      console.error("Check-in action failed:", err);
    } finally {
      setCheckingIn(prev => ({ ...prev, [ticketNumber]: false }));
    }
  };

  const downloadCSV = async (type) => {
    const url = type === "checkins" ? `${API_URL}/api/admin/export/checkins` : `${API_URL}/api/admin/export/registrations`;
    try {
      const res = await fetch(url, { headers });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = type === "checkins" ? "checkins.csv" : "registrations.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || [r.fullName, r.email, r.teamName, r.ticketNumber].some(f => (f || "").toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (activeTab === "teams") return r.registrationType === "team";
    if (activeTab === "individuals") return r.registrationType === "individual";
    if (activeTab === "checkedin") return r.checkInStatus;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)" }}>
        <div className="flex items-center gap-3 text-neutral-400">
          <svg className="animate-spin h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)" }}>
      {/* Header */}
      <div className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-neutral-500">Hospitality Hackathon 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={fetchData} className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition min-h-[40px] min-w-[40px] flex items-center justify-center" title="Refresh">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition min-h-[40px]">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Teams" value={stats.totalTeams} sub={`${stats.totalTeamMembers} team members`} color="#DC2626" />
            <StatCard label="Individuals" value={stats.totalIndividuals} color="#2563eb" />
            <StatCard label="Participants" value={stats.totalParticipants} sub={`${stats.totalRegistrations} registrations`} color="#059669" />
            <StatCard label="Checked In" value={stats.totalCheckedIn} sub={`${stats.totalParticipants > 0 ? Math.round((stats.totalCheckedIn / stats.totalParticipants) * 100) : 0}% rate`} color="#D4952C" />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {[
              { key: "all", label: "All" },
              { key: "teams", label: "Teams" },
              { key: "individuals", label: "Individuals" },
              { key: "checkedin", label: "Checked In" },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition min-h-[36px] ${activeTab === t.key ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"}`}>
                {t.label} {t.key === "all" ? `(${registrations.length})` : ""}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search name, email, ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:w-64 rounded-lg border border-white/10 bg-white/5 text-white text-sm p-2 placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              style={{ colorScheme: "dark" }}
            />
            <div className="flex gap-1.5">
              <button onClick={() => downloadCSV("registrations")} className="px-3 py-2 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 transition whitespace-nowrap min-h-[40px]" title="Export all registrations">
                ↓ CSV
              </button>
              <button onClick={() => downloadCSV("checkins")} className="px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition whitespace-nowrap min-h-[40px]" title="Export checked-in only">
                ↓ Check-ins
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Team</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Ticket</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" className="p-8 text-center text-neutral-500">No registrations found</td></tr>
                ) : filtered.map((r, i) => (
                  <>
                    <tr key={r.id || i} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                      <td className="p-3">
                        <div className="font-medium text-white">{r.fullName}</div>
                        <div className="text-xs text-neutral-500 md:hidden">{r.email}</div>
                      </td>
                      <td className="p-3 text-neutral-400 hidden md:table-cell">{r.email}</td>
                      <td className="p-3 text-neutral-400 hidden lg:table-cell">{r.phoneNumber}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${r.registrationType === "team" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                          {r.registrationType === "team" ? "Team" : "Individual"}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400 hidden md:table-cell">{r.teamName || "—"}</td>
                      <td className="p-3 font-mono text-xs text-neutral-500 hidden lg:table-cell">{r.ticketNumber}</td>
                      <td className="p-3">
                        {r.checkInStatus ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-neutral-500 border border-white/10">—</span>
                        )}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        {checkingIn[r.ticketNumber] ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-neutral-400">
                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          </span>
                        ) : r.checkInStatus ? (
                          <button
                            onClick={(e) => handleManualCheckIn(e, r)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-neutral-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition"
                            title="Undo check-in"
                          >
                            Undo
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleManualCheckIn(e, r)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition"
                            title="Check in this participant"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                    {/* Expanded team members row */}
                    {expandedRow === r.id && r.teamMembers && r.teamMembers.length > 0 && (
                      <tr key={`exp-${r.id}`} className="bg-white/[0.02]">
                        <td colSpan="8" className="p-0">
                          <div className="px-6 py-3 border-l-2 border-red-500/40 ml-4">
                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Team Members ({r.teamMembers.length})</div>
                            <div className="space-y-1.5">
                              {r.teamMembers.map((m, mi) => (
                                <div key={mi} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                  <span className="text-white font-medium min-w-[140px]">{m.fullName}</span>
                                  <span className="text-neutral-500">{m.email}</span>
                                  <span className="text-neutral-600 text-xs">{m.phoneNumber}</span>
                                  <span className="text-neutral-600 text-xs">{m.roleType}</span>
                                  <span className="font-mono text-xs text-neutral-600">{m.ticketNumber}</span>
                                  {m.checkInStatus ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">✓ In</span>
                                  ) : (
                                    <span className="text-[10px] text-neutral-600">—</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-600 pt-2 pb-4">
          Showing {filtered.length} of {registrations.length} registrations
        </div>
      </div>
    </div>
  );
}
