"use client"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Image,
  Camera,
  ArrowUpRight,
  Calendar,
  MapPin,
  ChevronLeft,
  X,
  Newspaper,
  Maximize2,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { supabase, GALLERY_BUCKET, STORAGE_BASE_URL } from "../lib/supabase"

const RED = "#DC2626"
const darkSection = "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"

const categories = [
  { key: "all", label: "All Photos", icon: <Image className="h-3.5 w-3.5" /> },
  { key: "day1", label: "Day 1", icon: <Calendar className="h-3.5 w-3.5" /> },
  { key: "day2", label: "Day 2", icon: <MapPin className="h-3.5 w-3.5" /> },
  { key: "videos", label: "Videos", icon: <Camera className="h-3.5 w-3.5" /> },
]

const videoItems = [
  {
    id: "video-1",
    category: "videos",
    title: "Day 1 Highlights",
    description: "Recap of kickoff, brainstorming, and early builds at ALX Tech Hub",
    videoUrl: "https://www.youtube.com/embed/Wa4gNLJDtck",
  },
  {
    id: "video-2",
    category: "videos",
    title: "Day 2 & Awards Ceremony",
    description: "Pitches, judging, and the awards ceremony at Kuriftu African Village",
    videoUrl: "https://www.youtube.com/embed/9ueIV8B1NlU",
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
  const [photos, setPhotos] = useState({ day1: [], day2: [] })
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ day1: 0, day2: 0 })

  // Fetch photos from Supabase storage
  useEffect(() => {
    setIsLoaded(true)
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const [day1Res, day2Res] = await Promise.all([
          supabase.storage.from(GALLERY_BUCKET).list('day1', { limit: 500, sortBy: { column: 'name', order: 'asc' } }),
          supabase.storage.from(GALLERY_BUCKET).list('day2', { limit: 500, sortBy: { column: 'name', order: 'asc' } }),
        ])

        const day1Files = (day1Res.data || [])
          .filter(f => f.name && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .map((f, i) => ({
            id: `day1-${i}`,
            category: 'day1',
            title: `Day 1 — Photo ${i + 1}`,
            description: 'ALX Tech Hub, Lideta — April 12, 2025',
            image: `${STORAGE_BASE_URL}/day1/${f.name}`,
            filename: f.name,
          }))

        const day2Files = (day2Res.data || [])
          .filter(f => f.name && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .map((f, i) => ({
            id: `day2-${i}`,
            category: 'day2',
            title: `Day 2 — Photo ${i + 1}`,
            description: 'Kuriftu African Village, Burayu — April 13, 2025',
            image: `${STORAGE_BASE_URL}/day2/${f.name}`,
            filename: f.name,
          }))

        setPhotos({ day1: day1Files, day2: day2Files })
        setCounts({ day1: day1Files.length, day2: day2Files.length })
      } catch (err) {
        console.error('Failed to load gallery:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setSelectedItem(null) }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Build filtered items
  const allPhotos = [...photos.day1, ...photos.day2]
  const getFiltered = () => {
    switch (activeFilter) {
      case "day1": return photos.day1
      case "day2": return photos.day2
      case "videos": return videoItems
      default: return allPhotos
    }
  }
  const filtered = getFiltered()

  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }))
  }

  const navigateLightbox = useCallback((direction) => {
    if (!selectedItem || !selectedItem.image) return
    const imageItems = (activeFilter === "all" ? allPhotos : activeFilter === "videos" ? [] : photos[activeFilter] || [])
    const currentIndex = imageItems.findIndex(item => item.id === selectedItem.id)
    if (currentIndex === -1) return
    const nextIndex = direction === "next"
      ? (currentIndex + 1) % imageItems.length
      : (currentIndex - 1 + imageItems.length) % imageItems.length
    setSelectedItem(imageItems[nextIndex])
  }, [selectedItem, activeFilter, allPhotos, photos])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!selectedItem) return
    const handleKey = (e) => {
      if (e.key === "ArrowRight") navigateLightbox("next")
      if (e.key === "ArrowLeft") navigateLightbox("prev")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedItem, navigateLightbox])

  const totalPhotos = counts.day1 + counts.day2

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
            {!loading && totalPhotos > 0 && (
              <p className="text-sm text-neutral-500 mt-3">{totalPhotos} photos • 2 videos</p>
            )}
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
            {categories.map((cat) => {
              const count = cat.key === "all"
                ? totalPhotos + videoItems.length
                : cat.key === "videos"
                ? videoItems.length
                : counts[cat.key] || 0
              return (
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
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY GRID ═══════════ */}
      <section className="py-10 bg-neutral-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
              <p className="text-neutral-500 text-sm">Loading gallery...</p>
            </div>
          ) : (
            <>
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
                        <div className="relative bg-neutral-100 aspect-[4/3] overflow-hidden">
                          {!imageLoaded[item.id] && (
                            <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
                              <Image className="h-8 w-8 text-neutral-300" />
                            </div>
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
                        <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && !loading && (
                <div className="text-center py-20">
                  <Image className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">No photos in this category yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════════ LIGHTBOX MODAL ═══════════ */}
      {selectedItem && selectedItem.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="h-5 w-5" />
          </button>

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

          <div
            className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-t-2xl bg-black"
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
