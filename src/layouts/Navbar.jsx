"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Terminal, X } from "lucide-react"

const routes = [
  { path: "/", label: "Home" },
  { path: "/about-us", label: "About Us" },
  { path: "/resources", label: "Resources" },
  { path: "/past-events", label: "2025 Edition" },
  { path: "/gallery", label: "Gallery" },
  { path: "/faq", label: "FAQ" },
  { path: "/registration", label: "Registration" },
  { path: "/contact-us", label: "Contact Us" },
]

const cn = (...classes) => classes.filter(Boolean).join(" ")

// Shared gradient for all CTA buttons (red brand)
const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"
const btnShadow = "0 4px 14px rgba(220, 38, 38, 0.35)"

// Frosted glass styles
const glassStyle = {
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Mobile: flush to edges | Desktop (lg+): floating pill */}
      <div className="nav:mx-auto nav:px-4">
        <div
          className={cn(
            "mx-auto px-4 sm:px-6",
            "border-b border-white/20",
            "nav:border nav:border-white/30 nav:mt-3 nav:max-w-6xl nav:rounded-2xl nav:shadow-sm"
          )}
          style={glassStyle}
        >
          <div className="flex h-14 items-center justify-between">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Terminal className="h-5 w-5" style={{ color: "#DC2626" }} />
              <span className="hidden font-bold text-sm sm:inline-block text-slate-800">
                <span style={{ color: "#DC2626" }}>&lt;</span>
                Hospitality
                <span style={{ color: "#DC2626" }}>Hackathon</span>
                <span style={{ color: "#DC2626" }}>/&gt;</span>
              </span>
            </Link>

            {/* Desktop Navigation — visible at lg (1024px+) */}
            <nav className="hidden nav:flex nav:gap-1">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === route.path
                      ? "text-slate-900 bg-white/60 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40",
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA — visible at lg+ */}
            <div className="hidden nav:block">
              <Link
                to="/registration"
                className="rounded-xl px-5 py-2 text-sm text-white font-medium transition-all duration-200 hover:opacity-90"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                Register Now
              </Link>
            </div>

            {/* Mobile/Tablet Menu Button — visible below lg */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="nav:hidden inline-flex items-center justify-center rounded-lg w-9 h-9 text-slate-600 hover:bg-white/50 transition-colors"
              aria-label="Toggle menu"
            >
              <span className="relative w-5 h-5">
                <Menu className={cn("h-5 w-5 absolute inset-0 transition-all duration-300", isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100")} />
                <X className={cn("h-5 w-5 absolute inset-0 transition-all duration-300", isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75")} />
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown (overlays content) ── */}
        <div
          className={cn(
            "nav:hidden absolute left-0 right-0 z-40 transition-all duration-300 ease-in-out",
            "nav:left-auto nav:right-auto",
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          )}
        >
          <div
            className="mx-0 nav:mx-auto nav:max-w-6xl border-b border-white/20 shadow-lg px-4 sm:px-6 pb-5 pt-3"
            style={glassStyle}
          >
            <nav className="flex flex-col gap-0.5">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    pathname === route.path
                      ? "text-slate-900 bg-white/70 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 px-1">
              <Link
                to="/registration"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-xl px-4 py-3 text-center text-white font-semibold text-sm transition-all duration-200"
                style={{ background: btnGradient, boxShadow: btnShadow }}
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay when mobile menu is open */}
      <div
        className={cn(
          "fixed inset-0 -z-10 nav:hidden transition-opacity duration-300",
          isOpen ? "bg-black/30 opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
    </header>
  )
}
