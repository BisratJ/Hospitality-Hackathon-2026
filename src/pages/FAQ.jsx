"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ChevronDown,
  HelpCircle,
  Search,
  Users,
  Calendar,
  Code2,
  Award,
  MapPin,
  ArrowUpRight,
  Mail,
  Lightbulb,
} from "lucide-react"

const RED = "#DC2626"
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"
const glassCard = "rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 backdrop-blur-sm"

const faqCategories = [
  {
    name: "General",
    icon: <HelpCircle className="h-4 w-4" />,
    questions: [
      {
        q: "What is the Hospitality Hackathon 2026?",
        a: "The Hospitality Hackathon 2026 is a two-day innovation challenge bringing together developers, designers, and hospitality professionals to build AI-powered solutions for the Ethiopian hospitality industry. It takes place on April 4 and April 18, 2026.",
      },
      {
        q: "Who organizes the hackathon?",
        a: "The hackathon is jointly organized by ALX Ethiopia, Kuriftu Resorts, and weVenture Hub — combining expertise in technology education, hospitality excellence, and startup incubation.",
      },
      {
        q: "Is there a participation fee?",
        a: "No, the Hospitality Hackathon 2026 is free to participate in. Meals and workspace are provided at both venues.",
      },
      {
        q: "What dates should I block on my calendar?",
        a: (<>Day 1 is Saturday, April 4, 2026 (9 AM – 6 PM) at <a href="https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">Capstone ALX Tech Hub</a> in Lideta, and Day 2 is Saturday, April 18, 2026 (8 AM – 5:30 PM) at Kuriftu African Village in Burayu.</>),
      },
    ],
  },
  {
    name: "Registration & Teams",
    icon: <Users className="h-4 w-4" />,
    questions: [
      {
        q: "How do I register?",
        a: "Visit our Registration page and fill out the form. You can register as a team (recommended) or as an individual. Teams must have exactly 5 members (1 Team Lead + 4 members).",
      },
      {
        q: "Can I participate without a team?",
        a: "Yes! Register as an individual and we will match you with teammates based on complementary skills during the team formation session on Day 1.",
      },
      {
        q: "What is the ideal team composition?",
        a: "Successful teams typically include a mix of developers, designers, business strategists, and people with hospitality industry knowledge. Diverse skill sets lead to stronger solutions.",
      },
      {
        q: "Is there a registration deadline?",
        a: "Registration closes when all available spots are filled. We recommend registering early to secure your place.",
      },
    ],
  },
  {
    name: "Event Details",
    icon: <Calendar className="h-4 w-4" />,
    questions: [
      {
        q: "Where does the hackathon take place?",
        a: (<>Day 1 is at <a href="https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">Capstone ALX Tech Hub</a> in Lideta, Addis Ababa — a modern tech workspace ideal for collaboration. Day 2 is at Kuriftu African Village in Burayu — a stunning resort venue for final presentations and the awards ceremony.</>),
      },
      {
        q: "What should I bring?",
        a: "Bring your laptop, charger, and any design or development tools you prefer. We provide meals, snacks, reliable internet, and a comfortable workspace at both venues.",
      },
      {
        q: "Is transportation provided between venues?",
        a: "Yes, transportation from Addis Ababa to Kuriftu African Village in Burayu will be arranged for Day 2 participants.",
      },
      {
        q: "Will there be mentors during the event?",
        a: "Absolutely. Mentors from both the tech and hospitality sectors will be available throughout the hackathon to provide guidance, technical support, and industry insights.",
      },
    ],
  },
  {
    name: "Technical & Judging",
    icon: <Code2 className="h-4 w-4" />,
    questions: [
      {
        q: "What skills do I need to participate?",
        a: "We welcome participants of all skill levels — developers, designers, business minds, and hospitality experts. The strongest teams blend technical and domain expertise.",
      },
      {
        q: "What technologies can we use?",
        a: "You are free to use any programming language, framework, or AI tool. We encourage solutions that leverage AI and machine learning to solve real hospitality challenges.",
      },
      {
        q: "How are projects judged?",
        a: "Projects are evaluated on innovation, feasibility, potential impact on the hospitality industry, technical implementation quality, and presentation clarity. Our judges include leaders from both tech and hospitality sectors.",
      },
      {
        q: "Do we need a working prototype by the end?",
        a: "Teams should present a minimum viable product (MVP) or a convincing demo of their solution. A polished pitch deck alongside a functional prototype gives the strongest impression.",
      },
    ],
  },
  {
    name: "Prizes & After",
    icon: <Award className="h-4 w-4" />,
    questions: [
      {
        q: "What prizes are available?",
        a: "The Grand Prize is 150K ETB plus a 3-month weVenture Incubation program. Additional prizes include exclusive Kuriftu Resort packages and ALX Hub access with ongoing mentorship.",
      },
      {
        q: "What happens after the hackathon?",
        a: "Top teams may have opportunities to further develop their solutions with our industry partners. All participants gain valuable networking connections, real project experience, and potential career opportunities.",
      },
      {
        q: "Will there be certificates of participation?",
        a: "Yes, all participants who complete both days of the hackathon will receive certificates of participation.",
      },
    ],
  },
]

export default function FAQ() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openIndex, setOpenIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => { setIsLoaded(true) }, [])

  const allQuestions = faqCategories.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, category: cat.name }))
  )

  const filtered = allQuestions.filter((item) => {
    const matchesSearch = !searchTerm ||
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={`bg-neutral-50 min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>

      {/* Hero */}
      <section className="relative overflow-hidden -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 py-24 sm:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10">
              <HelpCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-neutral-300">Got Questions?</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Frequently Asked <span style={{ color: RED }}>Questions</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
              Everything you need to know about the Hospitality Hackathon 2026. Can't find your answer? Reach out to us directly.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-white/10 rounded-full bg-white/5 text-white placeholder-neutral-500 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setOpenIndex(null) }}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fafaf9">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => { setActiveCategory("all"); setOpenIndex(null) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white/80 text-neutral-600 border border-neutral-200/60 hover:bg-white hover:shadow-sm"
              }`}
            >
              All Questions
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setOpenIndex(null) }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.name
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white/80 text-neutral-600 border border-neutral-200/60 hover:bg-white hover:shadow-sm"
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="max-w-3xl mx-auto">
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((item, i) => {
                  const isOpen = openIndex === i
                  return (
                    <div key={i} className="rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                      <button
                        className="flex items-start justify-between w-full p-5 text-left"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                      >
                        <div className="flex-1 pr-4">
                          <span className="text-sm font-semibold text-neutral-900">{item.q}</span>
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide bg-neutral-100 text-neutral-500">{item.category}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-neutral-100 pt-4">
                            <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-2">No questions match your search.</p>
                <button onClick={() => { setSearchTerm(""); setActiveCategory("all") }} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-16 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Calendar className="h-5 w-5" />, title: "Event Dates", desc: "April 4 & 18, 2026", sub: "Two Saturdays, two venues" },
              { icon: <MapPin className="h-5 w-5" />, title: "Venues", desc: "Capstone ALX Hub & Kuriftu", sub: "Lideta & Burayu" },
              { icon: <Award className="h-5 w-5" />, title: "Grand Prize", desc: "150K ETB", sub: "+ weVenture Incubation" },
            ].map((card, i) => (
              <div key={i} className={`${glassCard} p-6 text-center`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 bg-red-50 text-red-600">{card.icon}</div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{card.title}</div>
                <div className="text-lg font-bold text-neutral-900 mb-0.5">{card.desc}</div>
                <div className="text-sm text-neutral-400">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden" style={{ background: darkSection }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.05) 0%, transparent 70%)" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Still have questions?</h2>
            <p className="text-base text-white/35 mb-8 max-w-xl mx-auto">
              Our team is happy to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact-us"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
              <Link
                to="/registration"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/80 font-medium rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Register Now
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
