import React from "react"
import { Link } from "react-router-dom"
import { Terminal, Github, Linkedin, Heart, ExternalLink } from "lucide-react"

const glassStyle = {
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
}

const btnGradient = "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)"

function Footer() {
  return (
    <footer className="relative w-full border-t border-neutral-200/60">
      {/* Subtle top accent line */}
      <div className="h-[2px] w-full" style={{ background: btnGradient }} />

      <div style={glassStyle}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Top Row: Brand + CTA */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
            {/* Brand — larger logo */}
            <div className="space-y-4 max-w-sm">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <Terminal className="h-6 w-6" style={{ color: "#DC2626" }} />
                <span className="font-bold text-base text-neutral-800">
                  <span style={{ color: "#DC2626" }}>&lt;</span>
                  Hospitality
                  <span style={{ color: "#DC2626" }}>Hackathon</span>
                  <span style={{ color: "#DC2626" }}>/&gt;</span>
                </span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Innovate, build, and transform the future of hospitality in Ethiopia. April 4 & 18, 2026.
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-3 md:text-right">
              <p className="text-sm text-neutral-500 leading-relaxed">
                Ready to build the future of hospitality tech?
              </p>
              <Link
                to="/registration"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm text-white font-medium transition-all duration-200 hover:opacity-90"
                style={{ background: btnGradient, boxShadow: "0 4px 14px rgba(220, 38, 38, 0.25)" }}
              >
                Register Now
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200/60 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} Hospitality Hackathon. All rights reserved.
              </p>

              {/* Contributors */}
              <div className="flex flex-wrap items-center justify-center gap-x-1 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by
                </span>
                <a
                  href="https://www.linkedin.com/in/abrham28/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-600 hover:text-red-600 transition-colors duration-200"
                >
                  Abrham T.
                </a>
                <span className="text-neutral-300">|</span>
                <a
                  href="https://www.linkedin.com/in/sumeya-akmel-2a3b9b270/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-600 hover:text-red-600 transition-colors duration-200"
                >
                  Sumeya A.
                </a>
                <span className="text-neutral-300">|</span>
                <a
                  href="https://www.linkedin.com/in/yohana-mekuria-90607a2ab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-600 hover:text-red-600 transition-colors duration-200"
                >
                  Yohana M.
                </a>
                <span className="text-neutral-300">|</span>
                <span className="inline-flex items-center gap-1">
                  <a
                    href="https://www.linkedin.com/in/bisratgizaw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-neutral-600 hover:text-red-600 transition-colors duration-200"
                  >
                    Bisrat G.
                  </a>
                  <a
                    href="https://github.com/BisratJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-neutral-700 transition-colors duration-200"
                    aria-label="Bisrat GitHub"
                  >
                    <Github className="h-3 w-3" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/bisratgizaw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-blue-600 transition-colors duration-200"
                    aria-label="Bisrat LinkedIn"
                  >
                    <Linkedin className="h-3 w-3" />
                  </a>
                </span>
              </div>

              {/* Legal links */}
              <nav className="flex gap-4">
                <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
                  Terms
                </a>
                <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
                  Privacy
                </a>
                <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
                  Code of Conduct
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
