"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowUpRight,
  Star,
  Clock,
  Award,
  Lightbulb,
  Code2,
  Play,
  ExternalLink,
  Cpu,
  Zap,
  Hotel,
  TrendingUp,
  Image,
} from "lucide-react"

const RED = "#DC2626"
const RED_DARK = "#B91C1C"
const DARK = "#0a0a0a"
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"
const glassCard = "rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 backdrop-blur-sm"

export default function PastEvents() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => { setIsLoaded(true) }, [])

  const highlights = [
    { icon: <Users className="h-5 w-5" />, value: "350+", label: "Innovators" },
    { icon: <Code2 className="h-5 w-5" />, value: "70+", label: "Projects" },
    { icon: <Trophy className="h-5 w-5" />, value: "150K", label: "ETB Grand Prize" },
  ]

  const problemStatements = [
    {
      icon: <Hotel className="h-5 w-5" />,
      title: "Resort Efficiency",
      description: "How can AI optimize back-of-house operations to reduce waste and improve service delivery?",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Guest Experience",
      description: "Personalizing the guest journey through AI-driven insights and interactive touchpoints.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Revenue Management",
      description: "Dynamic pricing and revenue optimization models for local hospitality markets.",
    },
  ]

  const judges2025 = [
    {
      name: "Mr. Nael Hailemariam",
      role: "Co-Founder and CEO, Chapa",
      image: "/assets/images/Nael.jpeg",
    },
    {
      name: "Mr. Israel Goytom",
      role: "CTO and Co-Founder, Chapa",
      image: "/assets/images/Israel.jpeg",
    },
    {
      name: "Mr. Amaha Bekele",
      role: "Partner, Consulting Leader for East Africa at Deloitte",
      image: "/assets/images/Amaha.jpeg",
    },
  ]

  const timeline = [
    { time: "Day 1 — April 5, 2025", venue: "ALX Tech Hub, Lideta", events: ["Opening ceremony & keynotes", "Industry panel with hospitality leaders", "Team formation & brainstorming", "MVP development with mentor guidance", "Technical review sessions"] },
    { time: "Day 2 — April 19, 2025", venue: "Kuriftu African Village, Burayu", events: ["Final pitch preparation", "Demo presentations to judges", "Awards ceremony", "Networking lunch & open discussions", "Closing remarks"] },
  ]

  return (
    <div className={`bg-neutral-50 min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 py-24 sm:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10">
              <Clock className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-neutral-300">2025 Edition</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Ethiopia's 1st Ever<br />
              <span style={{ color: RED }}>Hospitality Hackathon</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              A milestone event that brought together 350+ innovators to build the future of African hospitality.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/60" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Calendar className="h-3.5 w-3.5 text-red-400" />
                April 5 & 19, 2025
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/60" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <MapPin className="h-3.5 w-3.5 text-red-400" />
                ALX Tech Hub & Kuriftu African Village
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fafaf9">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {highlights.map((stat, i) => (
              <div key={i} className={`${glassCard} p-6 text-center`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 bg-red-50 text-red-600">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EVENT RECAPS — VIDEO EMBEDS ═══════════ */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <Play className="h-3.5 w-3.5" />
              Event Recaps
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">Experience the Energy</h2>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto">
              Experience the energy and innovation of our inaugural event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Day 1 Video */}
            <div className={`${glassCard} overflow-hidden`}>
              <div className="aspect-video bg-neutral-900 relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/Wa4gNLJDtck"
                  title="Day 1 Highlights"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Day 1 Highlights</h3>
                <p className="text-sm text-neutral-500">Kickoff, brainstorming, and early builds at ALX Tech Hub.</p>
              </div>
            </div>

            {/* Day 2 Video */}
            <div className={`${glassCard} overflow-hidden`}>
              <div className="aspect-video bg-neutral-900 relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/9ueIV8B1NlU"
                  title="Final Day & Awards"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Final Day & Awards</h3>
                <p className="text-sm text-neutral-500">Pitches, judging, and the awards ceremony at Kuriftu African Village.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EVENT OVERVIEW ═══════════ */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
                <Lightbulb className="h-3.5 w-3.5" />
                Overview
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-6">A Pivotal Moment</h2>
            </div>

            <div className={`${glassCard} p-8 md:p-10 mb-10`}>
              <p className="text-neutral-600 leading-relaxed mb-5">
                The inaugural Hospitality Hackathon, held in 2025, marked a pivotal moment for Ethiopia's tech ecosystem. In partnership with Kuriftu Resorts, ALX Ethiopia, and weVentureHub, the event welcomed over 350+ innovators, entrepreneurs, and problem-solvers.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Teams collaborated over 48 hours to design AI-powered solutions that revolutionized resort operations, guest experiences, and revenue generation. The success of this first edition laid the foundation for what is now the premier hospitality innovation event in the region.
              </p>
            </div>

            {/* Event Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeline.map((day, i) => (
                <div key={i} className={`${glassCard} overflow-hidden p-1.5`}>
                  <div className="rounded-xl p-5 text-white" style={{ background: i === 0 ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)" : `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                    <h3 className="text-lg font-bold">{day.time}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-white/60 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {day.venue}
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {day.events.map((event, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-neutral-600">{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2025 PROBLEM STATEMENTS ═══════════ */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <Cpu className="h-3.5 w-3.5" />
              Challenges
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">2025 Problem Statements</h2>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto">
              The core challenges that teams tackled during the inaugural hackathon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problemStatements.map((ps, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5" style={{ borderTopWidth: "3px", borderTopColor: RED }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-red-50 text-red-600">
                  {ps.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{ps.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{ps.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 2025 JUDGES & PANELISTS ═══════════ */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <Award className="h-3.5 w-3.5" />
              2025 Jury
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">Past Judges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {judges2025.map((judge, i) => (
              <div key={i} className={`${glassCard} p-6 text-center`}>
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-neutral-100">
                  <img src={judge.image} alt={judge.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">{judge.name}</h3>
                <p className="text-sm font-medium" style={{ color: "#D4952C" }}>{judge.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WINNERS ═══════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 70%)" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase text-white/40 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Trophy className="h-3.5 w-3.5 text-red-400" />
              Champions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              2025 Hackathon Final Day
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Winner Card */}
            <div className="rounded-2xl p-8 md:p-10 text-center" style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}>
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-red-500/20">
                <img src="/assets/images/genit.jpg" alt="Team Gen-IT" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center" style="background:rgba(220,38,38,0.12)"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>' }} />
              </div>
              <div className="text-sm text-red-400 font-semibold uppercase tracking-wider mb-2">Grand Prize Winner</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Team Gen-IT</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <Trophy className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">150,000 ETB Grand Prize</span>
              </div>
              <p className="text-base text-white/40 leading-relaxed max-w-xl mx-auto mb-8">
                Recognized for an AI-powered guest assistant and resource management solution built for Kuriftu Resorts. Team Gen-IT demonstrated exceptional innovation in combining natural language processing with hospitality operations.
              </p>

              {/* Gallery CTA */}
              <Link
                to="/gallery"
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
              >
                <Image className="h-4 w-4" />
                View Event Gallery
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-20 overflow-hidden" style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 50%, #991B1B 100%)` }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Join the 2026 Edition
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
              Inspired by 2025? The 2026 Hospitality Hackathon is waiting for you. Bring your AI solutions and join the transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/registration"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-xl transition-all duration-200 hover:bg-neutral-50 shadow-lg"
              >
                Register for 2026 Now
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/90 font-medium rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Image className="h-4 w-4" />
                View 2025 Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
