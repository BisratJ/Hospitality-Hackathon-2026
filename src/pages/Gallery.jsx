"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Image,
  Camera,
  Users,
  Trophy,
  Lightbulb,
  Code2,
  ArrowUpRight,
  Calendar,
  MapPin,
  ChevronLeft,
  X,
} from "lucide-react"

const RED = "#DC2626"
const RED_DARK = "#B91C1C"
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"
const glassCard = "rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 backdrop-blur-sm"

const galleryCategories = [
  { key: "all", label: "All" },
  { key: "featured", label: "Featured" },
  { key: "videos", label: "Videos" },
  { key: "day1", label: "Day 1" },
  { key: "day2", label: "Day 2" },
]

/* Placeholder gallery items — replace images with real photos when available */
const galleryItems = [
  { id: 1, category: "day1", featured: true, title: "Opening Ceremony", description: "Kickoff of Ethiopia's 1st Hospitality Hackathon at Capstone ALX Tech Hub", aspect: "landscape" },
  { id: 2, category: "day1", featured: true, title: "Fireside Chat", description: "An inspiring leadership conversation with Bersufekad Getachew", aspect: "landscape" },
  { id: 3, category: "day1", title: "Problem Statements Reveal", description: "Teams learn about the hospitality challenges they'll tackle", aspect: "portrait" },
  { id: 4, category: "day1", title: "Team Formation", description: "Participants coming together to form diverse teams", aspect: "landscape" },
  { id: 5, category: "day1", title: "Brainstorming Session", description: "Creative ideation and solution mapping", aspect: "landscape" },
  { id: 6, category: "day1", title: "Coding in Progress", description: "Teams building their MVPs with focus and determination", aspect: "portrait" },
  { id: 7, category: "day1", title: "Mentor Guidance", description: "Industry experts providing one-on-one support", aspect: "landscape" },
  { id: 8, category: "day1", title: "Technical Reviews", description: "Mentors reviewing code and architecture decisions", aspect: "landscape" },
  { id: 9, category: "day2", featured: true, title: "Arrival at Kuriftu", description: "Teams arrive at Kuriftu African Village for Demo Day", aspect: "landscape" },
  { id: 10, category: "day2", title: "Final Pitch Prep", description: "Teams polishing their presentations at Kuriftu", aspect: "portrait" },
  { id: 11, category: "day2", featured: true, title: "Demo Presentations", description: "Live demonstrations to the judging panel", aspect: "landscape" },
  { id: 12, category: "day2", title: "Judges Deliberation", description: "Evaluating innovation, feasibility, and impact", aspect: "landscape" },
  { id: 13, category: "day2", featured: true, title: "Awards Ceremony", description: "Celebrating the top innovators of 2025", aspect: "landscape" },
  { id: 14, category: "day2", featured: true, title: "Team Gen-IT — Grand Prize", description: "Winners of the 150,000 ETB grand prize", aspect: "landscape" },
  { id: 15, category: "day2", title: "Networking & Celebration", description: "Participants celebrating achievements at Kuriftu", aspect: "portrait" },
  { id: 16, category: "day2", title: "Group Photo", description: "All participants, mentors, judges, and organizers", aspect: "landscape" },
  { id: 17, category: "videos", title: "Day 1 Highlights", description: "Recap of kickoff, brainstorming, and early builds", aspect: "landscape", videoUrl: "https://www.youtube.com/embed/Wa4gNLJDtck" },
  { id: 18, category: "videos", title: "Day 2 & Awards", description: "Pitches, judging, and the awards ceremony", aspect: "landscape", videoUrl: "https://www.youtube.com/embed/9ueIV8B1NlU" },
]

export default function Gallery() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => { setIsLoaded(true) }, [])

  const filtered = activeFilter === "all"
    ? galleryItems
    : activeFilter === "featured"
    ? galleryItems.filter(item => item.featured)
    : galleryItems.filter(item => item.category === activeFilter)

  const iconForCategory = (cat) => {
    switch (cat) {
      case "day1": return <Calendar className="h-4 w-4" />
      case "day2": return <Trophy className="h-4 w-4" />
      case "videos": return <Camera className="h-4 w-4" />
      default: return <Image className="h-4 w-4" />
    }
  }

  return (
    <div className={`bg-neutral-50 min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>

      {/* Hero */}
      <section className="relative overflow-hidden -mt-[56px] pt-[56px] lg:-mt-[72px] lg:pt-[72px]" style={{ background: darkSection }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/past-events" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
              <ChevronLeft className="h-4 w-4" />
              Back to 2025 Edition
            </Link>
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10 ml-4">
              <Camera className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-neutral-300">Photo Gallery</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              2025 <span style={{ color: RED }}>Gallery</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Moments captured from Ethiopia's first Hospitality Hackathon — the teams, the energy, the innovation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#fafaf9">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-neutral-50 sticky top-14 lg:top-[72px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat.key
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white/80 text-neutral-600 border border-neutral-200/60 hover:bg-white hover:shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => !item.videoUrl && setSelectedItem(item)}
              >
                <div className="rounded-2xl border border-black/[0.06] bg-white/60 shadow-sm backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                  {item.videoUrl ? (
                    /* Video embed */
                    <div className="aspect-video bg-neutral-900 relative">
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-t-2xl"
                        src={item.videoUrl}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    /* Placeholder image */
                    <div className={`relative bg-neutral-200 ${item.aspect === "portrait" ? "aspect-[3/4]" : "aspect-video"} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-white/60">
                          {iconForCategory(item.category)}
                        </div>
                        <p className="text-xs text-neutral-400">Photo placeholder</p>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                        <div>
                          <p className="text-white text-sm font-semibold">{item.title}</p>
                          <p className="text-white/60 text-xs">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Caption below */}
                  <div className="p-4">
                    <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Image className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden bg-neutral-900" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className={`bg-neutral-800 ${selectedItem.aspect === "portrait" ? "aspect-[3/4] max-h-[70vh]" : "aspect-video"} flex items-center justify-center`}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/10">
                  {iconForCategory(selectedItem.category)}
                </div>
                <p className="text-white/30 text-sm">Photo coming soon</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{selectedItem.title}</h3>
              <p className="text-sm text-white/40">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="relative py-20 overflow-hidden" style={{ background: darkSection }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.05) 0%, transparent 70%)" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to Make <span style={{ color: RED }}>2026</span> History?
            </h2>
            <p className="text-base text-white/35 mb-8 max-w-xl mx-auto">
              Be part of the next chapter. Register your team and build the future of hospitality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/registration"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                Register for 2026
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/past-events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/80 font-medium rounded-xl transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Back to 2025 Edition
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
