"use client"

import { useState } from "react"
import {
  Clock,
  MapPin,
  ChevronDown,
  Star,
  BookOpen,
  Code2,
  Coffee,
  Users,
  Mic,
  Award,
  MessageCircle,
  Bus,
  Presentation,
  Sparkles,
  Flame,
} from "lucide-react"

const RED = "#DC2626"

const categoryConfig = {
  logistics: { icon: Clock, color: "#64748b", bg: "rgba(100,116,139,0.08)", label: "Logistics" },
  main: { icon: Mic, color: "#DC2626", bg: "rgba(220,38,38,0.08)", label: "Main Event" },
  keynote: { icon: Star, color: "#D4952C", bg: "rgba(212,149,44,0.08)", label: "Keynote" },
  hacking: { icon: Code2, color: "#059669", bg: "rgba(5,150,105,0.08)", label: "Hacking" },
  break: { icon: Coffee, color: "#DC2626", bg: "rgba(220,38,38,0.08)", label: "Break" },
  mentorship: { icon: BookOpen, color: "#2563eb", bg: "rgba(37,99,235,0.08)", label: "Mentorship" },
  presentation: { icon: Presentation, color: "#db2777", bg: "rgba(219,39,119,0.08)", label: "Presentation" },
  social: { icon: MessageCircle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", label: "Social" },
  travel: { icon: Bus, color: "#64748b", bg: "rgba(100,116,139,0.08)", label: "Travel" },
  fireside: { icon: Flame, color: "#DC2626", bg: "rgba(220,38,38,0.08)", label: "Fireside Chat" },
  press: { icon: Users, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", label: "Press" },
}

const schedule = {
  day1: {
    date: "Saturday, April 4, 2026",
    location: "Capstone ALX Tech Hub",
    address: "Lideta, Addis Ababa",
    events: [
      { time: "09:00 – 09:30", title: "Registration & Welcome", description: "Check-in, kit distribution, and networking.", category: "logistics" },
      { time: "09:35 – 09:50", title: "Opening Remarks", description: "Welcome addresses from Kuriftu, ALX Ethiopia, and WeVenture (5 minutes each).", category: "main" },
      { time: "09:55 – 10:25", title: "Fireside Chat", description: "An intimate conversation with Bersufekad Getachew, Founder & CEO of Eagle Lion Systems, on tech innovation in Ethiopian hospitality.", category: "fireside", speaker: "Bersufekad Getachew" },
      { time: "10:35 – 10:50", title: "Problem Statement Announcement", description: "Official challenge briefing and Q&A.", category: "keynote" },
      { time: "10:55 – 17:30", title: "Hackathon Work Blocks & Mentorship", description: "Full-day ideation, building, and mentorship sessions. Lunch served while working.", category: "hacking" },
      { time: "17:35 – 18:00", title: "End-of-Day Wrap-Up & Announcements", description: "Summary of progress, Day 2 logistics, and instructions for Kuriftu.", category: "logistics" },
    ],
  },
  day2: {
    date: "Saturday, April 18, 2026",
    location: "Kuriftu African Village",
    address: "Burayu",
    events: [
      { time: "08:00 – 09:00", title: "Transport Departure", description: (<>Departure from <a href="https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">Capstone ALX Tech Hub</a> to Kuriftu African Village.</>), category: "travel" },
      { time: "09:00 – 09:30", title: "Arrival & Setup", description: "Arrive at Kuriftu, settle in, and prepare for presentations.", category: "logistics" },
      { time: "09:35 – 12:30", title: "Final Presentations & Q&A", description: "Teams present their solutions to the judging panel, followed by Q&A.", category: "presentation" },
      { time: "12:35 – 13:30", title: "Judging Deliberation", description: "Closed judging session. Participants network and relax.", category: "main" },
      { time: "13:35 – 14:00", title: "Awards & Announcement Ceremony", description: "Winners announced and awards ceremony.", category: "main" },
      { time: "14:00 – 15:30", title: "Lunch & Networking", description: "Lunch and informal networking with participants, judges, and sponsors.", category: "social" },
      { time: "15:30 – 17:00", title: "Press Engagement", description: "Interviews and photo opportunities with winners and organizers.", category: "press" },
      { time: "17:00 – 17:30", title: "Closing Remarks & Event Close", description: "Final remarks, thank-yous, and official close of the hackathon.", category: "main" },
    ],
  },
}

export default function HackathonSchedule() {
  const [activeDay, setActiveDay] = useState("day1")
  const [expandedIndex, setExpandedIndex] = useState(null)

  const currentSchedule = schedule[activeDay]

  return (
    <div className="container mx-auto py-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium tracking-wide uppercase mb-4">
          <Clock className="h-3.5 w-3.5" />
          Event Timeline
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">
          Hackathon Schedule
        </h2>
        <p className="text-base text-neutral-500 max-w-2xl mx-auto">
          Your guide to all the exciting events, workshops, and activities planned for our two-day hackathon.
        </p>
      </div>

      {/* Day Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-neutral-100 rounded-lg p-1 border border-neutral-200">
          {[
            { key: "day1", label: "Day 1: Capstone ALX Hub", sublabel: "Apr 4" },
            { key: "day2", label: "Day 2: Kuriftu", sublabel: "Apr 18" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveDay(tab.key); setExpandedIndex(null) }}
              className={`relative py-2.5 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                activeDay === tab.key
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Info Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            background: activeDay === "day1"
              ? "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)"
              : `linear-gradient(135deg, #DC2626 0%, #991B1B 100%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{currentSchedule.date}</h3>
              <div className="flex items-center gap-1.5 text-sm text-white/70 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {activeDay === "day1" ? (
                  <><a href="https://maps.app.goo.gl/pJ1T5Qtf4Tev8yBM9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/30">{currentSchedule.location}</a> — {currentSchedule.address}</>
                ) : (
                  <span>{currentSchedule.location} — {currentSchedule.address}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(activeDay === "day1" ? ["Fireside Chat", "Hacking", "Mentorship"] : ["Presentations", "Awards", "Networking"]).map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline — centered vertical line */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Centered vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-neutral-200 hidden md:block"></div>

          <div className="space-y-3">
            {currentSchedule.events.map((event, index) => {
              const config = categoryConfig[event.category] || categoryConfig.logistics
              const Icon = config.icon
              const isOpen = expandedIndex === index
              const isLeft = index % 2 === 0

              return (
                <div key={index} className="relative">
                  {/* Timeline dot — centered */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[22px] hidden md:flex items-center justify-center z-10">
                    <div
                      className="w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: config.color }}
                    ></div>
                  </div>

                  {/* Card — alternating sides on desktop, full-width on mobile */}
                  <div className={`md:w-[calc(50%-24px)] ${isLeft ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"}`}>
                    <div
                      className="rounded-2xl border border-white/60 bg-white/50 shadow-sm hover:shadow-md hover:bg-white/70 transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className="p-2 rounded-xl flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: config.bg, color: config.color }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-neutral-900">{event.title}</h4>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                                  style={{ backgroundColor: config.bg, color: config.color }}
                                >
                                  {config.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                <Clock className="h-3 w-3" />
                                {event.time}
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-neutral-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>

                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-neutral-100">
                            <p className="text-sm text-neutral-500 leading-relaxed">{event.description}</p>
                            {event.speaker && (
                              <div className="mt-3 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-neutral-50 border border-neutral-100">
                                  <Users className="h-3 w-3 text-neutral-400" />
                                </div>
                                <span className="text-xs font-medium text-neutral-600">{event.speaker}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
