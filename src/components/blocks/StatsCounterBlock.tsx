'use client';

import React, { useEffect, useState, useRef } from 'react';

interface StatItem {
  target: string;
  suffix?: string;
  label: string;
}

interface StatsCounterProps {
  stats?: StatItem[];
}

export default function StatsCounterBlock({ content }: { content: StatsCounterProps }) {
  const stats = content.stats || [];
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <h2>
                <span className="stat-number">
                  {stat.target}
                  {stat.suffix}
                </span>
              </h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
