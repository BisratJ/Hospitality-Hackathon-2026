import { useState, useEffect, useCallback, useRef } from "react";
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
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [checkingIn, setCheckingIn] = useState({});
  const [activeSection, setActiveSection] = useState("registrations"); // "registrations" | "contacts"
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollRef = useRef(null);

  const token = sessionStorage.getItem("admin_token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = useCallback(async () => {
    if (!token) { navigate("/admin"); return; }
    setLoading(true);
    try {
      const [statsRes, regRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/registrations`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers }),
      ]);
      if (statsRes.status === 401 || regRes.status === 401) {
        sessionStorage.removeItem("admin_token");
        navigate("/admin");
        return;
      }
      setStats(await statsRes.json());
      setRegistrations(await regRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
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

  // Silent poll — refreshes data without showing loading spinner
  const silentFetch = useCallback(async () => {
    if (!token) return;
    try {
      const [statsRes, regRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/registrations`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (regRes.ok) setRegistrations(await regRes.json());
      setLastUpdated(new Date());
      setIsLive(true);
    } catch {
      setIsLive(false);
    }
  }, [token]);

  // Auto-polling every 5 seconds, pauses when tab is hidden
  useEffect(() => {
    if (!token || loading) return;

    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(silentFetch, 5000);
      setIsLive(true);
    };
    const stopPolling = () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      setIsLive(false);
    };

    const handleVisibility = () => {
      if (document.hidden) { stopPolling(); }
      else { silentFetch(); startPolling(); }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [token, loading, silentFetch]);

  const logout = () => { sessionStorage.removeItem("admin_token"); navigate("/admin"); };

  const handleManualCheckIn = async (e, reg) => {
    e.stopPropagation();
    const ticketNumber = reg.ticketNumber;
    if (!ticketNumber) return;
    setCheckingIn(prev => ({ ...prev, [ticketNumber]: true }));
    try {
      let res;
      if (!reg.checkInStatus) {
        res = await fetch(`${API_URL}/api/checkin/${ticketNumber}`, { method: "POST", headers });
      } else {
        res = await fetch(`${API_URL}/api/admin/undo-checkin/${ticketNumber}`, { method: "PUT", headers });
      }
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.ticketNumber === ticketNumber ? { ...r, checkInStatus: !reg.checkInStatus } : r));
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
    const matchesSearch = !q || [r.fullName, r.email, r.teamName, r.ticketNumber, r.alxAffiliation].some(f => (f || "").toLowerCase().includes(q));
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

  const typeBadge = (r) => {
    if (r.participantType === "member") return <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Member</span>;
    if (r.registrationType === "team") return <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Team Lead</span>;
    return <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Individual</span>;
  };

  const statusBadge = (r) => {
    if (r.checkInStatus) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Checked In
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-500 border border-neutral-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" /> Not Checked In
      </span>
    );
  };

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
            {/* Live indicator */}
            {isLive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20" title={lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Live'}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
            )}
            <button onClick={fetchData} className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition min-h-[40px] min-w-[40px] flex items-center justify-center" title="Refresh">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition min-h-[40px]">Logout</button>
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

        {/* Section toggle */}
        <div className="flex gap-2">
          <button onClick={() => setActiveSection("registrations")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeSection === "registrations" ? "bg-white/10 text-white border border-white/20" : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"}`}>
            Registrations
          </button>
          <button onClick={() => setActiveSection("contacts")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeSection === "contacts" ? "bg-white/10 text-white border border-white/20" : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"}`}>
            Contact Submissions {contacts.length > 0 && <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">{contacts.length}</span>}
          </button>
        </div>

        {/* ═══ REGISTRATIONS SECTION ═══ */}
        {activeSection === "registrations" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
                {[
                  { key: "all", label: `All (${registrations.length})` },
                  { key: "teams", label: "Teams" },
                  { key: "individuals", label: "Individuals" },
                  { key: "checkedin", label: "Checked In" },
                ].map((t) => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition min-h-[36px] ${activeTab === t.key ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input type="text" placeholder="Search name, email, ticket..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 sm:w-64 rounded-lg border border-white/10 bg-white/5 text-white text-sm p-2 placeholder-neutral-500 focus:border-red-500 focus:outline-none" style={{ colorScheme: "dark" }} />
                <div className="flex gap-1.5">
                  <button onClick={() => downloadCSV("registrations")} className="px-3 py-2 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 transition whitespace-nowrap min-h-[40px]" title="Export all">↓ CSV</button>
                  <button onClick={() => downloadCSV("checkins")} className="px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition whitespace-nowrap min-h-[40px]" title="Export checked-in">↓ Check-ins</button>
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
                      <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">ALX Affiliation</th>
                      <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Team</th>
                      <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Ticket</th>
                      <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="text-left p-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="9" className="p-8 text-center text-neutral-500">No registrations found</td></tr>
                    ) : filtered.map((r, i) => (
                      <tr key={r.ticketNumber || i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                        <td className="p-3">
                          <div className="font-medium text-white">{r.fullName}</div>
                          <div className="text-xs text-neutral-500 md:hidden">{r.email}</div>
                        </td>
                        <td className="p-3 text-neutral-400 hidden md:table-cell">{r.email}</td>
                        <td className="p-3 text-neutral-400 hidden lg:table-cell">{r.phoneNumber}</td>
                        <td className="p-3">{typeBadge(r)}</td>
                        <td className="p-3 text-neutral-400 hidden md:table-cell">
                          {r.alxAffiliation ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">{r.alxAffiliation}</span>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="p-3 text-neutral-400 hidden md:table-cell">{r.teamName || "—"}</td>
                        <td className="p-3 font-mono text-xs text-neutral-500 hidden lg:table-cell">{r.ticketNumber}</td>
                        <td className="p-3">{statusBadge(r)}</td>
                        <td className="p-3">
                          {checkingIn[r.ticketNumber] ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-neutral-400">
                              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            </span>
                          ) : r.checkInStatus ? (
                            <button onClick={(e) => handleManualCheckIn(e, r)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-neutral-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition" title="Undo check-in">Undo</button>
                          ) : (
                            <button onClick={(e) => handleManualCheckIn(e, r)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition" title="Check in">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                              Check In
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center text-xs text-neutral-600 pt-2 pb-4">
              Showing {filtered.length} of {registrations.length} participants
            </div>
          </>
        )}

        {/* ═══ CONTACT SUBMISSIONS SECTION ═══ */}
        {activeSection === "contacts" && (
          <>
            <h2 className="text-lg font-bold text-white">Contact Submissions</h2>
            {contacts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-12 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <svg className="w-10 h-10 text-neutral-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <p className="text-neutral-500 text-sm">No contact submissions yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((c, i) => (
                  <div key={c.id || i} className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-sm">{c.name}</h3>
                        <p className="text-neutral-500 text-xs">{c.email}</p>
                      </div>
                      {c.created_at && (
                        <span className="text-neutral-600 text-[10px] whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-neutral-400 border border-white/10">{c.subject}</span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
