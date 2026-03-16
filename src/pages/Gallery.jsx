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
  Newspaper,
  Maximize2,
  ChevronRight,
} from "lucide-react"

const RED = "#DC2626"
const RED_DARK = "#B91C1C"
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"

const galleryCategories = [
  { key: "all", label: "All", icon: <Image className="h-3.5 w-3.5" /> },
  { key: "highlights", label: "Highlights", icon: <Trophy className="h-3.5 w-3.5" /> },
  { key: "day1", label: "Day 1", icon: <Calendar className="h-3.5 w-3.5" /> },
  { key: "day2", label: "Day 2", icon: <MapPin className="h-3.5 w-3.5" /> },
  { key: "people", label: "People", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "videos", label: "Videos", icon: <Camera className="h-3.5 w-3.5" /> },
]

const galleryItems = [
  // Highlights
  {
    id: 1,
    category: "highlights",
    title: "Hospitality Hackathon 2025",
    description: "Ethiopia's 1st ever AI-Powered Hospitality Hackathon — official poster",
    image: "/assets/images/poster.png",
    aspect: "landscape",
  },
  {
    id: 2,
    category: "highlights",
    title: "Team Gen-IT — Grand Prize Winners",
    description: "Winners of the 150,000 ETB grand prize for their AI-powered guest assistant",
    image: "/assets/images/genit.jpg",
    aspect: "landscape",
  },
  {
    id: 3,
    category: "highlights",
    title: "Innovation in Hospitality",
    description: "Transforming how African hospitality leverages AI technology",
    image: "/assets/images/hospitality-innovation.jpg",
    aspect: "landscape",
  },

  // Day 1
  {
    id: 4,
    category: "day1",
    title: "ALX Tech Hub — Day 1 Venue",
    description: "The Capstone ALX Tech Hub in Lideta — where 350+ innovators kicked off the hackathon",
    image: "/assets/images/alx-hub.JPG",
    aspect: "landscape",
  },
  {
    id: 5,
    category: "day1",
    title: "Fireside Chat with Bersufekad Getachew",
    description: "An inspiring leadership conversation about tech entrepreneurship in Ethiopia",
    image: "/assets/images/Bersufekad.jpeg",
    aspect: "portrait",
  },

  // Day 2
  {
    id: 6,
    category: "day2",
    title: "Kuriftu African Village",
    description: "The stunning venue for Day 2 — demo presentations and awards at Kuriftu Resort",
    image: "/assets/images/kuriftu.png",
    aspect: "landscape",
  },

  // People — Judges
  {
    id: 7,
    category: "people",
    title: "Yasser Bagersh",
    description: "Managing Director, Cactus Communications — 2025 Judge",
    image: "/assets/images/Yasser.png",
    aspect: "portrait",
  },
  {
    id: 8,
    category: "people",
    title: "Tadios Tefera",
    description: "CTO, MMCY Tech — 2025 Judge",
    image: "/assets/images/Tadiwos.jpeg",
    aspect: "portrait",
  },
  {
    id: 9,
    category: "people",
    title: "Dr. Temesgen Gebrehiowt",
    description: "Founder & CEO, Etta Solutions — 2025 Judge",
    image: "/assets/images/temesgen.jpg",
    aspect: "portrait",
  },
  {
    id: 10,
    category: "people",
    title: "Misikir Adane",
    description: "CEO & Co-Founder, Muyalogy — 2025 Panelist",
    image: "/assets/images/Misikir.jpeg",
    aspect: "portrait",
  },
  {
    id: 11,
    category: "people",
    title: "Yoadan Tilahun",
    description: "Founder & CEO, Flawless Events — 2025 Panelist",
    image: "/assets/images/Yoadan.jpeg",
    aspect: "portrait",
  },
  {
    id: 12,
    category: "people",
    title: "Helinna Ayalew",
    description: "Panel Moderator — 2025 Edition",
    image: "/assets/images/Helinna.jpeg",
    aspect: "portrait",
  },
  {
    id: 13,
    category: "people",
    title: "Yonaiel Tadiwos Belete",
    description: "Operations Director, Boston Partners PLC — 2025 Panelist",
    image: "/assets/images/Yonaiel.jpeg",
    aspect: "portrait",
  },

  // Videos
  {
    id: 14,
    category: "videos",
    title: "Day 1 Highlights",
    description: "Recap of kickoff, brainstorming, and early builds at ALX Tech Hub",
    videoUrl: "https://www.youtube.com/embed/Wa4gNLJDtck",
    aspect: "landscape",
  },
  {
    id: 15,
    category: "videos",
    title: "Day 2 & Awards Ceremony",
    description: "Pitches, judging, and the awards ceremony at Kuriftu African Village",
    videoUrl: "https://www.youtube.com/embed/9ueIV8B1NlU",
    aspect: "landscape",
  },
]

const featuredArticles = [
  {
    title: "A New Era for African Hospitality Innovation — Hospitality Hackathon Recap",
    source: "What's Out Addis",
    excerpt: "An in-depth recap of the inaugural Hospitality Hackathon and what it means for the future of African hospitality innovation.",
    url: "https://www.whatsoutaddis.com/a-new-era-for-african-hospitality-innovation-hospitality-hackathon-recap/",
  },
  {
    title: "Hospitality Meets Tech: Ethiopia's First Hospitality Hackathon Held at Kuriftu and ALX",
    source: "Loline Magazine",
    excerpt: "The two-day event saw 350+ innovators gathered to solve real problems in the hospitality industry.",
    url: "https://www.lolinemag.com/articles/hospitality-meets-tech-ethiopias-first-hospitality-hackathon-held-at-kuriftu-and-alx",
  },
]

export default function Gallery() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [imageLoaded, setImageLoaded] = useState({})

  useEffect(() => { setIsLoaded(true) }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setSelectedItem(null) }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const filtered = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter)

  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }))
  }

  const navigateLightbox = (direction) => {
    if (!selectedItem) return
    const currentIndex = filtered.findIndex(item => item.id === selectedItem.id)
    const imageItems = filtered.filter(item => item.image)
    const currentImageIndex = imageItems.findIndex(item => item.id === selectedItem.id)
    if (currentImageIndex === -1) return
    const nextIndex = direction === "next"
      ? (currentImageIndex + 1) % imageItems.length
      : (currentImageIndex - 1 + imageItems.length) % imageItems.length
    setSelectedItem(imageItems[nextIndex])
  }

  return (
    <div className={`bg-neutral-50 min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]" style={{ background: darkSection }}>
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

      {/* ═══════════ FILTER TABS ═══════════ */}
      <section className="py-6 bg-neutral-50 sticky top-14 lg:top-[72px] z-30 border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat.key
                    ? "text-white shadow-sm"
                    : "bg-white/80 text-neutral-600 border border-neutral-200/60 hover:bg-white hover:shadow-sm"
                }`}
                style={activeFilter === cat.key ? { background: btnGradient, boxShadow: btnShadow } : {}}
              >
                {cat.icon}
                {cat.label}
                <span className={`text-xs ml-0.5 ${activeFilter === cat.key ? "text-white/70" : "text-neutral-400"}`}>
                  ({cat.key === "all" ? galleryItems.length : galleryItems.filter(i => i.category === cat.key).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY GRID ═══════════ */}
      <section className="py-10 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => item.image && setSelectedItem(item)}
              >
                <div className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm overflow-hidden hover:shadow-lg hover:border-neutral-300/60 transition-all duration-300">
                  {item.videoUrl ? (
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
                    <div className={`relative bg-neutral-100 ${item.aspect === "portrait" ? "aspect-[3/4]" : "aspect-video"} overflow-hidden`}>
                      {/* Skeleton loader */}
                      {!imageLoaded[item.id] && (
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => handleImageLoad(item.id)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          imageLoaded[item.id] ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                        <div className="flex items-end justify-between w-full">
                          <div>
                            <p className="text-white text-sm font-semibold">{item.title}</p>
                            <p className="text-white/60 text-xs mt-0.5">{item.description}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ml-3">
                            <Maximize2 className="h-3.5 w-3.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Caption */}
                  <div className="p-4">
                    <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{item.description}</p>
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

      {/* ═══════════ LIGHTBOX MODAL ═══════════ */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev") }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next") }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-full object-contain max-h-[75vh] rounded-t-2xl bg-black"
            />
            <div className="bg-neutral-900/95 backdrop-blur-sm p-5 rounded-b-2xl">
              <h3 className="text-lg font-semibold text-white mb-1">{selectedItem.title}</h3>
              <p className="text-sm text-white/50">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ PRESS COVERAGE ═══════════ */}
      <section className="py-16 bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-medium mb-4">
                <Newspaper className="h-3.5 w-3.5" />
                Press Coverage
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Featured In</h2>
              <p className="text-neutral-500 text-sm max-w-xl mx-auto">
                Read what the media had to say about Ethiopia's first Hospitality Hackathon.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-200/60 bg-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 backdrop-blur-sm group p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Newspaper className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-red-600">{article.source}</span>
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 mb-2 leading-snug group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-600 group-hover:gap-2 transition-all">
                    Read article
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
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
