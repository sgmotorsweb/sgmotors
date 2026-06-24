"use client";

import { useEffect, useState, useRef } from "react";

interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  sections: Section[];
}

export default function LegalLayout({ title, subtitle, sections }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Setup intersection observer to track which section is currently active
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that is closest to the top of the viewport
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // If there's an entry intersecting, set it as active
        // Sort by bounding client rect to find the one highest up or most visible
        const topEntry = visibleEntries.reduce((prev, current) => {
          return (prev.boundingClientRect.top < current.boundingClientRect.top && prev.boundingClientRect.top >= 0) ? prev : current;
        });
        setActiveSection(topEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-10% 0px -70% 0px", // Trigger when the section is in the upper part of screen
      threshold: 0.1,
    });

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // Offset for sticky headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-primary">
      {/* Header section with sleek gradient and styling */}
      <div 
        className="border-b px-4 py-16 text-center md:text-left transition-colors duration-300" 
        style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide" style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>
            Informations Officielles
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          <p className="text-base md:text-lg font-medium" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Navigation Sidebar (Hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 p-6 border rounded-2xl space-y-2 transition-all duration-300 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                Sommaire
              </h2>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:translate-x-1"
                      style={{
                        backgroundColor: isActive ? "var(--badge-bg)" : "transparent",
                        color: isActive ? "var(--color-sg-accent-blue)" : "var(--text-secondary)",
                      }}
                    >
                      {sec.icon && <span className="opacity-80 shrink-0">{sec.icon}</span>}
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Detailed Legal Text */}
          <article className="lg:col-span-3 space-y-8">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 border rounded-2xl p-6 md:p-8 transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
                  {sec.icon && (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)", color: "var(--color-sg-accent-blue)" }}>
                      {sec.icon}
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {sec.title}
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4" style={{ color: "var(--text-secondary)" }}>
                  {sec.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
