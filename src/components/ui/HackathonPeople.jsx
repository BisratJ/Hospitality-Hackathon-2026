"use client"

import { useState } from "react"
import Otto from '../../../public/assets/images/otto.jpg'
import Mahlet from '../../../public/assets/images/mahlet.jpg'

const PersonPlaceholder = ({ size = "w-20 h-20", ringClass = "ring-2 ring-neutral-100" }) => (
  <div className={`${size} rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center ${ringClass}`}>
    <svg className="w-1/2 h-1/2 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
)

const DarkPersonPlaceholder = ({ size = "w-28 h-28" }) => (
  <div className={`${size} rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center`}>
    <svg className="w-1/2 h-1/2 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
)

export default function HackathonPeople() {
  const [activeTab, setActiveTab] = useState("fireside")

  const judges = [
    {
      name: "TBD",
      role: "To Be Announced",
      description: "Judge details will be announced once confirmed. Stay tuned for updates!",
    },
    {
      name: "TBD",
      role: "To Be Announced",
      description: "Judge details will be announced once confirmed. Stay tuned for updates!",
    },
    {
      name: "TBD",
      role: "To Be Announced",
      description: "Judge details will be announced once confirmed. Stay tuned for updates!",
    },
  ]

  const firesideChat = {
    title: "AI's Role in Modern Hospitality",
    guest: {
      name: "Otto Kurzendorfer",
      role: "General Manager, Hyatt Regency Addis Ababa",
      description: "Otto Kurzendorfer is a global hospitality leader with over 30 years of experience managing luxury hotels across Europe, Asia, and the Middle East. Currently the General Manager of Hyatt Regency Addis Ababa, he is a specialist in operational excellence and delivering world-class guest experiences.",
      image: Otto,
    },
    moderator: {
      name: "Mahlet Tadiwos Salu",
      role: "Commercial Strategist, Kuriftu Resorts & Spa",
      description: "Mahlet Tadiwos Salu is a leading hospitality professional and commercial strategist at Ethiopia's renowned Kuriftu Resorts & Spa. With deep expertise in marketing and growth, she is a key figure in driving excellence for the region's premier luxury resort group.",
      image: Mahlet,
    },
  }

  const tabs = [
    { key: "fireside", label: "Fireside Chat" },
    { key: "judges", label: "Judges" },
  ]

  return (
    <div className="container mx-auto py-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium tracking-wide uppercase mb-4">
          <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Industry Leaders
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">
          Judges & Featured Fireside Chat
        </h2>
        <p className="text-base text-neutral-500 max-w-2xl mx-auto">
          Our esteemed judges bring deep expertise to evaluate your solutions, and our fireside chat features an intimate 1-on-1 conversation with an industry leader.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-neutral-100 rounded-lg p-1 border border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "judges" ? (
        /* 2026 Judges Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {judges.map((person, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-neutral-200/60 hover:border-neutral-300 bg-white/60 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">
                <PersonPlaceholder />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">{person.name}</h3>
              <p className="text-sm font-medium mb-3" style={{ color: "#D4952C" }}>{person.role}</p>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-4">{person.description}</p>
            </div>
          ))}
        </div>
      ) : (
        /* Fireside Chat Layout */
        <div className="max-w-4xl mx-auto">
          {/* Chat visual */}
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 35%, #1a1a1a 70%, #111111 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)" }}></div>

            <div className="relative z-10 p-8 md:p-12">
              {/* Label */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c.9 0 1.8.3 2.5.9l6 5.5c.8.7 1.3 1.7 1.5 2.8l.5 5.3c.2 1.6-.4 3.2-1.5 4.3l-.8.8c-1.1 1.1-2.7 1.6-4.3 1.5l-5.3-.5c-1.1-.2-2.1-.7-2.8-1.5l-5.5-6A3.5 3.5 0 0 1 2 12c0-.9.3-1.8.9-2.5l6-5.5c.7-.6 1.6-.9 2.5-1Z"/><circle cx="10" cy="10" r="1.5"/></svg>
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Fireside Chat</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{firesideChat.title}</h3>
                <p className="text-sm text-white/30 max-w-xl mx-auto">
                  A 1-on-1 fireside conversation exploring the intersection of AI, technology, and hospitality innovation in Ethiopia.
                </p>
              </div>

              {/* Two people — side by side */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                {/* Guest — Otto */}
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-red-500/20 mx-auto">
                      <img src={firesideChat.guest.image} alt={firesideChat.guest.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)", color: "white" }}>
                      Guest
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-2">{firesideChat.guest.name}</h4>
                  <p className="text-sm text-white/40 mt-1">{firesideChat.guest.role}</p>
                </div>

                {/* Divider flame */}
                <div className="hidden md:flex flex-col items-center gap-2">
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.2)" }}>
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 3.5-7.5-2 3.5 1.5 5 1 7.5-.5 2.5-1.5 3.5-1.5 5.5a3 3 0 1 0 6 0c0-1.5-.5-3-1-4-1.5-3 0-6 2-8-3.5 2.5-4 5.5-3.5 7.5.5 2 0 3.5-.5 4.5s-1 2-1 3c0 .5 0 1 .5 1.5"/></svg>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                </div>

                {/* Moderator — Mahlet */}
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-28 h-28 rounded-full ring-4 ring-white/10 mx-auto overflow-hidden">
                      <img src={firesideChat.moderator.image} alt={firesideChat.moderator.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Moderator
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-2">{firesideChat.moderator.name}</h4>
                  <p className="text-sm text-white/40 mt-1">{firesideChat.moderator.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bios below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-200/60 bg-white/60 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={firesideChat.guest.image} alt={firesideChat.guest.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{firesideChat.guest.name}</div>
                  <div className="text-xs text-neutral-400">{firesideChat.guest.role}</div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">{firesideChat.guest.description}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/60 bg-white/60 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={firesideChat.moderator.image} alt={firesideChat.moderator.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{firesideChat.moderator.name}</div>
                  <div className="text-xs text-neutral-400">{firesideChat.moderator.role}</div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">{firesideChat.moderator.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
