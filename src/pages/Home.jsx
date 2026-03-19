"use client"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import alxl from '../../public/assets/images/alxl-clean.png'
import wev from '../../public/assets/images/wev-clean.png'
import kuri from '../../public/assets/images/kuri-clean.png'
import voa from '../../public/assets/images/voa-logo.png'
import {
  Calendar,
  MapPin,
  Award,
  Users,
  ChevronRight,
  Clock,
  Hotel,
  Lightbulb,
  Trophy,
  ArrowRight,
  Star,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  Cpu,
  Zap,
  ArrowUpRight,
  Code2,
  Terminal,
  Braces,
} from "lucide-react"
import HackathonPeople from "../components/ui/HackathonPeople"
import HackathonSchedule from "../components/ui/HackathonSchedule"

function useInView() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, isInView]
}

/* ── Brand Color System (from branding materials) ── */
const RED = "#DC2626"
const RED_DARK = "#B91C1C"
const RED_LIGHT = "#EF4444"
const DARK = "#0a0a0a"
const DARK_CHARCOAL = "#171717"
const WARM_GREY = "#F5F3F3"

/* Shared button gradient (red) */
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"

/* Shared glassy card style */
const glassCard = "rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 backdrop-blur-sm"

/* Dark section background */
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const [activitiesRef, activitiesInView] = useInView()
  const [organizersRef, organizersInView] = useInView()
  const [prizesRef, prizesInView] = useInView()
  const [participateRef, participateInView] = useInView()

  useEffect(() => {
    const targetDate = new Date("2026-04-04T09:00:00+03:00").getTime()
    const update = () => {
      const diff = targetDate - Date.now()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        })
      }
    }
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => { setIsLoaded(true) }, [])

  const prizes = [
    { title: "Grand Prize", value: "150k ETB", description: "Cash prize plus 3-month weVenture Incubation program", icon: <Trophy className="h-6 w-6" /> },
    { title: "Exclusive Packages", value: "Kuriftu Packages", description: "Luxury stays and experiences at Kuriftu Resorts", icon: <Hotel className="h-6 w-6" /> },
    { title: "Hub Access", value: "ALX Hub Access", description: "Workspace and resources for continued development", icon: <Briefcase className="h-6 w-6" /> },
  ]

  const organizers = [
    { name: "ALX Ethiopia", description: "Empowering young Ethiopians through premier technology training and entrepreneurship, driving the digital economy forward.", icon: alxl },
    { name: "Kuriftu Resorts", description: "Setting hospitality standards with luxury service and inspiring venues, perfect for sparking creativity.", icon: kuri },
    { name: "weVenture Hub", description: "Fostering startup growth and innovation, providing resources and support to entrepreneurs.", icon: wev },
    { name: "Voice of Africa", description: "Amplifying African narratives and connecting communities through media, culture, and creative storytelling across the continent.", icon: voa },
  ]

  const steps = [
    { number: "01", title: "Register", description: "Sign up at our official registration site and secure your team's spot.", icon: <Calendar className="h-5 w-5" />, link: "/registration", linkText: "Register now" },
    { number: "02", title: "Build Your Team", description: "Open to individual innovators and teams. Need a team? Register and we'll connect you.", icon: <Users className="h-5 w-5" />, link: "/about-us", linkText: "Learn more" },
    { number: "03", title: "Compete & Win", description: "Present your solution to judges and compete for prizes, incubation, and recognition.", icon: <Trophy className="h-5 w-5" />, link: "/resources", linkText: "View resources" },
  ]

  return (
    <div className={`bg-neutral-50 min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO — Dark premium with red accents                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[82vh] flex items-center -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]" style={{ background: darkSection }}>

        {/* Subtle cross pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Red accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 60%)" }}></div>

        {/* Top accent line — red */}
        <div className="absolute top-0 left-0 right-0 h-[2px] animate-gradient" style={{ background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.7), rgba(239,68,68,0.5), transparent)", backgroundSize: "200% 100%" }}></div>

        {/* Floating tech icons — very faint */}
        <div className="absolute top-28 left-[8%] text-white/[0.03] animate-float hidden lg:block"><Braces className="h-16 w-16" /></div>
        <div className="absolute top-44 right-[10%] text-white/[0.03] hidden lg:block" style={{ animation: "float 6s ease-in-out 2s infinite" }}><Terminal className="h-12 w-12" /></div>
        <div className="absolute bottom-48 left-[12%] text-white/[0.03] hidden lg:block" style={{ animation: "float 7s ease-in-out 1s infinite" }}><Code2 className="h-14 w-14" /></div>
        <div className="absolute bottom-40 right-[7%] text-white/[0.04] hidden lg:block" style={{ animation: "float 5s ease-in-out 3s infinite" }}><Cpu className="h-10 w-10" /></div>

        <div className="container mx-auto px-4 pt-16 pb-28 sm:pt-20 sm:pb-32 md:pt-24 md:pb-40 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge — dark glass pill */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8" style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <Cpu className="h-3.5 w-3.5 text-red-400" />
              <span className="text-xs font-medium tracking-wide text-white/50 uppercase">AI-Powered Hospitality Hackathon</span>
            </div>

            {/* Title — white with red "Hackathon" */}
            <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 leading-[1.08] tracking-tight text-white">
              <span className="sm:whitespace-nowrap">
                Hospitality{" "}
                <span className="animate-gradient bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${RED}, ${RED_DARK}, ${RED})`, backgroundSize: "200% 200%" }}>
                  Hackathon
                </span>
              </span>{" "}
              <span className="text-white/30">2026</span>
            </h1>

            {/* Tagline */}
            <p className="animate-fade-in-up-delay-2 text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-white/30 mb-7">
              Solve &middot; Create &middot; Disrupt
            </p>

            {/* Date & Venue — dark glass pills */}
            <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-3 mb-9">
              {[
                { icon: <Calendar className="h-3.5 w-3.5 text-red-400" />, text: "April 4 & 18, 2026" },
                { icon: <MapPin className="h-3.5 w-3.5 text-red-400" />, text: "Capstone ALX Tech Hub & Kuriftu African Village", link: "https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" },
              ].map((pill, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}>
                  {pill.icon}
                  {pill.link ? (
                    <a href={pill.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors">{pill.text}</a>
                  ) : (
                    <span className="text-sm font-medium text-white/60">{pill.text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Countdown — dark glass cards */}
            <div className="animate-fade-in-up-delay-3 grid grid-cols-4 gap-3 sm:gap-4 max-w-xs mx-auto mb-10">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ].map((item, i) => (
                <div key={i} className="animate-count-pulse rounded-2xl p-2.5 sm:p-3" style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}>
                  <div className="text-xl sm:text-2xl font-bold tabular-nums font-mono text-white">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/30 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            {/* CTA — red primary, dark outline secondary */}
            <div className="animate-fade-in-up-delay-4 flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
              <Link
                to="/registration"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all duration-200 text-white text-sm"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                Register Your Team
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-medium rounded-xl text-sm text-white/80 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Explore Resources
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fafaf9">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ACTIVITIES & VENUES                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section ref={activitiesRef} className="relative py-24 bg-neutral-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-14 ${activitiesInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              Two Venues, Two Days
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">Activities & Venues</h2>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto">Two days across two iconic Ethiopian venues — innovation meets hospitality.</p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14 ${activitiesInView ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
            {/* Day 1 */}
            <div className="group rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)" }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-0.5">Day 1</div>
                  <h3 className="text-base font-semibold text-neutral-900">Saturday, April 4, 2026</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm text-neutral-500">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                <a href="https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-700 hover:text-red-600 transition-colors">Capstone ALX Tech Hub</a>
                <span className="text-neutral-300">·</span>
                <span>Lideta, Addis Ababa</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Fireside Chat", "Hacking", "Mentorship", "Workshops"].map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-full bg-neutral-50 text-[11px] font-medium text-neutral-500 border border-neutral-100">{item}</span>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div className="group rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-0.5">Day 2</div>
                  <h3 className="text-base font-semibold text-neutral-900">Saturday, April 18, 2026</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm text-neutral-500">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-700">Kuriftu African Village</span>
                <span className="text-neutral-300">·</span>
                <span>Burayu</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Presentations", "Awards", "Networking", "Press"].map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-full bg-neutral-50 text-[11px] font-medium text-neutral-500 border border-neutral-100">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 2025 AI Highlights Flashback */}
          <div className={`max-w-4xl mx-auto ${activitiesInView ? "animate-fade-in-up-delay-3" : "opacity-0"}`}>
            <div className="relative rounded-2xl overflow-hidden" style={{ background: darkSection }}>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }}></div>

              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-4" style={{ background: "rgba(220,38,38,0.12)", color: "#f87171", border: "1px solid rgba(220,38,38,0.2)" }}>
                    <Star className="h-3 w-3" />
                    Flashback
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">2025 Highlights</h3>
                  <p className="text-sm text-white/35 leading-relaxed mb-6 max-w-lg">
                    Our inaugural event brought together innovators, industry leaders, and passionate technologists to reimagine hospitality.
                  </p>
                  <Link
                    to="/gallery"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
                    style={{ background: btnGradient, boxShadow: btnShadow }}
                  >
                    View 2025 Gallery
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                  {[
                    { value: "350+", label: "Innovators" },
                    { value: "70+", label: "Projects" },
                    { value: "150K", label: "ETB Prizes" },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-xl font-bold text-white mb-0.5">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/30">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2026 PROBLEM STATEMENT                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden bg-white border-t border-neutral-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 60%)" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-medium tracking-wide uppercase mb-4">
              <Cpu className="h-3.5 w-3.5" />
              Hackathon 2026
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">Problem Statement</h2>
          </div>

          {/* Main Challenge Card */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className={`${glassCard} p-8 md:p-10`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 text-red-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
                    Design and prototype an AI-powered solution that transforms how a resort operates, serves guests, or generates revenue.
                  </h3>
                </div>
              </div>
              <p className="text-base text-neutral-500 leading-relaxed mb-8">
                This year's challenge focuses on leveraging artificial intelligence and machine learning to create innovative solutions that address critical aspects of resort management and guest experience in Ethiopia's hospitality sector.
              </p>

              {/* Key Focus Areas Header */}
              <div className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-5">Key Focus Areas</div>

              {/* Three Focus Area Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {[
                  {
                    emoji: "🏢",
                    title: "Resort Operations",
                    color: "bg-red-50 border-red-100",
                    items: [
                      "AI-powered staff scheduling and resource optimization",
                      "Predictive maintenance for resort facilities",
                      "Smart inventory management and supply chain optimization",
                    ],
                  },
                  {
                    emoji: "👥",
                    title: "Guest Experience",
                    color: "bg-blue-50 border-blue-100",
                    items: [
                      "Personalized AI concierge and recommendation systems",
                      "Intelligent room automation and smart controls",
                      "AI-driven sentiment analysis for real-time service improvements",
                    ],
                  },
                  {
                    emoji: "💰",
                    title: "Revenue Generation",
                    color: "bg-emerald-50 border-emerald-100",
                    items: [
                      "Dynamic pricing algorithms for rooms and services",
                      "AI-powered marketing automation and customer segmentation",
                      "Predictive analytics for revenue optimization",
                    ],
                  },
                ].map((area, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${area.color}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">{area.emoji}</span>
                      <h4 className="text-base font-semibold text-neutral-900">{area.title}</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {area.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-neutral-600 leading-relaxed">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Think Beyond Banner */}
              <div className="rounded-xl p-5 border" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(37,99,235,0.04) 100%)", borderColor: "rgba(220,38,38,0.1)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">💡</span>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900">Think Beyond: </span>
                    <span className="text-sm text-neutral-600 leading-relaxed">
                      Your solution should demonstrate practical AI implementation, scalability, and measurable impact on resort operations, guest satisfaction, or revenue growth.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-white border-t border-neutral-100">
        <HackathonSchedule />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ORGANIZERS                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section ref={organizersRef} className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-14 ${organizersInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <Users className="h-3.5 w-3.5" />
              Partners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Jointly Organized By</h2>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto ${organizersInView ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
            {organizers.map((org, i) => (
              <div key={i} className={`${glassCard} p-6 text-center group`}>
                <div className="h-16 w-full mb-5 flex items-center justify-center">
                  <img className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${org.icon === alxl ? 'max-h-14 min-w-[120px] max-w-[140px]' : org.icon === voa ? 'max-h-14 w-14' : 'max-h-14 max-w-[160px]'}`} src={org.icon} alt={org.name} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{org.name}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{org.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People */}
      <section className="bg-white">
        <HackathonPeople />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PRIZES — Dark section                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section ref={prizesRef} className="relative py-24 overflow-hidden" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Subtle red accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 70%)" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-14 ${prizesInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase text-white/40 mb-4" style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <Award className="h-3.5 w-3.5 text-red-400" />
              Prizes & Opportunities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Compete & Win</h2>
            <p className="text-base text-white/35 max-w-2xl mx-auto">
              The 2026 Hospitality Hackathon offers impressive prizes, direct engagement with industry leaders, and hands-on skill development.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 max-w-5xl mx-auto ${prizesInView ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
            {prizes.map((prize, i) => (
              <div key={i} className="group rounded-2xl p-6 transition-all duration-300" style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-red-400" style={{ background: "rgba(220,38,38,0.12)" }}>
                  {prize.icon}
                </div>
                <div className="text-sm text-white/35 mb-1">{prize.title}</div>
                <div className="text-2xl font-bold text-white mb-2">{prize.value}</div>
                <p className="text-sm text-white/35 leading-relaxed">{prize.description}</p>
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 ${prizesInView ? "animate-fade-in-up-delay-3" : "opacity-0"}`}>
            {[
              { icon: <Trophy className="h-4 w-4" />, title: "Win Big", desc: "150k ETB, Kuriftu packages, ALX hub access" },
              { icon: <Lightbulb className="h-4 w-4" />, title: "Incubation", desc: "3-month weVenture program to launch your solution" },
              { icon: <Users className="h-4 w-4" />, title: "Network", desc: "Connect with industry leaders and investors" },
              { icon: <Star className="h-4 w-4" />, title: "Recognition", desc: "Showcase to an esteemed panel of judges" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div className="p-1.5 rounded-lg mt-0.5 text-red-400" style={{ background: "rgba(220,38,38,0.1)" }}>{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-white/30">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/registration"
              className="group inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
              style={{ background: btnGradient, boxShadow: btnShadow }}
            >
              Register to Compete
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HOW TO PARTICIPATE                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section ref={participateRef} className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-14 ${participateInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-500 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              Get Started
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">How to Participate</h2>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto ${participateInView ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
            {steps.map((step, i) => (
              <div key={i} className={`${glassCard} p-6 relative overflow-hidden group`}>
                <div className="absolute -top-2 -right-2 text-7xl font-bold text-neutral-100/50 select-none group-hover:text-neutral-200/50 transition-colors duration-300">{step.number}</div>
                <div className="relative z-10">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-neutral-200/60 text-neutral-500 inline-flex mb-4 shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4 leading-relaxed">{step.description}</p>
                  <Link to={step.link} className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: RED }}>
                    {step.linkText}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 ${participateInView ? "animate-fade-in-up-delay-3" : "opacity-0"}`}>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Mail className="h-4 w-4 text-neutral-400" />
              info@hospitalityhackathon.et
            </div>
            <div className="hidden sm:block w-1 h-1 bg-neutral-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Phone className="h-4 w-4 text-neutral-400" />
              +251 977 464 570
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CTA — Dark section                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.05) 0%, transparent 70%)" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to build the future of hospitality?
            </h2>
            <p className="text-lg text-white/35 mb-8 max-w-xl mx-auto">
              Join innovators, developers, and industry leaders for two days of creation, competition, and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/registration"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                Register Your Team
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/80 font-medium rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
