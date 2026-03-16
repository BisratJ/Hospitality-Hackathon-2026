import { Card, CardContent } from "../components/ui/Card"
import OrganizersShowcase from "../components/ui/OrganizersShowcase"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

// Import icons (using a simple implementation since we don't have lucide-react)
const Calendar = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
)

const Lightbulb = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
)

const Zap = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
)

const Code = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
)

const Users = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

// Additional icons for problem statements
const BookOpen = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
)

const Heart = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
)

const MessageSquare = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

const ClipboardCheck = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="m9 14 2 2 4-4"></path>
  </svg>
)

const CheckCircle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

export default function AboutUs() {
  return (
    <div className="flex min-h-screen max-w-full flex-col bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 -mt-[56px] pt-[56px] nav:-mt-[72px] nav:pt-[72px]" style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
      }}>
        {/* Subtle red accent orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="container relative py-10 md:py-20 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm text-white border border-red-500/30" style={{
              background: "rgba(220, 38, 38, 0.1)",
              backdropFilter: "blur(10px)"
            }}>
              <Calendar className="mr-2 h-4 w-4" style={{ color: "#DC2626" }} />
              <span>April 4 & 18, 2026</span>
            </div>
            <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-5xl">
              We blend <span style={{ color: "#DC2626" }}>Hospitality</span> and{" "}
              <span style={{ color: "#EF4444" }}>Innovation</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-neutral-300 md:text-xl">
              Bridging technology and hospitality innovation to transform Ethiopia's hospitality landscape
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg px-3 py-1 text-sm text-red-600 border border-red-500/30" style={{
                background: "rgba(220, 38, 38, 0.08)",
                backdropFilter: "blur(10px)"
              }}>
                <Lightbulb className="mr-1 h-4 w-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-neutral-900">Bridging Technology and Hospitality</h2>
              <p className="text-neutral-600 md:text-lg">
                The Hospitality Hackathon 2026 is Ethiopia's premier event dedicated to fostering innovation in the
                hospitality sector. We bring together tech visionaries, entrepreneurs, and hospitality leaders to
                collaborate on solutions that address the unique challenges and opportunities in Ethiopia's growing
                tourism and hospitality industry.
              </p>
              <p className="text-neutral-600 md:text-lg">
                Our mission is to catalyze digital transformation in the hospitality sector, creating a platform where
                technology meets hospitality expertise to develop innovative, scalable, and impactful solutions.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm overflow-hidden">
                <img
                  src="/assets/images/hospitality-innovation.jpg"
                  alt="Hospitality Hackathon"
                  className="object-cover w-full max-w-[600px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="w-full py-12 md:py-24 bg-neutral-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="inline-flex items-center rounded-lg px-3 py-1 text-sm text-red-600 border border-red-500/30" style={{
              background: "rgba(220, 38, 38, 0.08)",
              backdropFilter: "blur(10px)"
            }}>
              <Zap className="mr-1 h-4 w-4" />
              <span>Problem Statement</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-neutral-900">Challenges We're Addressing</h2>
            <p className="mx-auto max-w-[700px] text-neutral-600 md:text-lg">
              Ethiopia's hospitality industry faces unique challenges that require innovative solutions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                    <line x1="8" x2="16" y1="21" y2="21"></line>
                    <line x1="12" x2="12" y1="17" y2="21"></line>
                  </svg>
                ),
                title: "Infrastructure Limitations",
                desc: "Limited technological infrastructure in many hospitality establishments, creating barriers to digital transformation and modern guest experiences."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Guest Experience Gaps",
                desc: "Inconsistent guest experiences across different properties and regions, with opportunities to enhance service delivery through technology."
              },
              {
                icon: <Code className="h-8 w-8" />,
                title: "Digital Skills Shortage",
                desc: "A gap in digital skills and technology adoption among hospitality professionals, limiting the sector's ability to innovate and compete globally."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: "rgba(220, 38, 38, 0.08)", color: "#DC2626" }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 2026 Problem Statement — Consistent with Home Page */}
          <div className="mt-16">
            <div className="rounded-2xl border border-neutral-200/60 bg-white p-8 md:p-10 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="rounded-xl p-3 flex-shrink-0" style={{ background: "rgba(220, 38, 38, 0.08)", color: "#DC2626" }}>
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
                    Design and prototype an AI-powered solution that transforms how a resort operates, serves guests, or generates revenue.
                  </h3>
                </div>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-8">
                This year's challenge focuses on leveraging artificial intelligence and machine learning to create innovative solutions that address critical aspects of resort management and guest experience in Ethiopia's hospitality sector.
              </p>

              <h4 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "#DC2626" }}>Key Focus Areas</h4>

              <div className="grid gap-5 md:grid-cols-3 mb-8">
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
                          <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

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

      {/* Organizers Showcase Section */}
      <OrganizersShowcase />

      {/* Goals Section */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)"
      }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }} />
        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">Our Goals</h2>
            <p className="mt-4 text-neutral-300 md:text-xl">
              The Hospitality Hackathon 2026 aims to achieve the following outcomes:
            </p>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-start">
                <div className="mr-3 rounded-full p-1 flex-shrink-0" style={{ background: "rgba(220, 38, 38, 0.3)" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-neutral-200 md:text-lg">
                  <strong>Develop Innovative Solutions:</strong> Create practical, implementable tech solutions that
                  address real challenges in Ethiopia's hospitality sector.
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-3 rounded-full p-1 flex-shrink-0" style={{ background: "rgba(220, 38, 38, 0.3)" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-neutral-200 md:text-lg">
                  <strong>Foster Collaboration:</strong> Build lasting partnerships between tech innovators and
                  hospitality industry stakeholders.
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-3 rounded-full p-1 flex-shrink-0" style={{ background: "rgba(220, 38, 38, 0.3)" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-neutral-200 md:text-lg">
                  <strong>Enhance Digital Skills:</strong> Improve technological literacy and digital skills among
                  hospitality professionals.
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-3 rounded-full p-1 flex-shrink-0" style={{ background: "rgba(220, 38, 38, 0.3)" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-neutral-200 md:text-lg">
                  <strong>Showcase Ethiopia:</strong> Position Ethiopia's hospitality sector as innovative and
                  forward-thinking on the global stage.
                </p>
              </li>
            </ul>
            <Link
              to="/registration"
              className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 mt-8 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
              }}
            >
              Register Now
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-neutral-900">Join Us in Transforming Hospitality</h2>
            <p className="mx-auto max-w-[700px] text-neutral-600 md:text-xl">
              Be part of Ethiopia's first hospitality innovation hackathon and help shape the future of the industry.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                to="/registration"
                className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)"
                }}
              >
                Register Now
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>

              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 text-neutral-900 font-medium rounded-lg transition-all duration-300 border-2"
                style={{
                  borderColor: "#DC2626",
                  background: "rgba(220, 38, 38, 0.05)"
                }}
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

