import React from 'react';

interface SectionWireframeProps {
  blockType: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function SectionWireframe({ blockType, style, className = '' }: SectionWireframeProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    boxSizing: 'border-box',
    ...style,
  };

  switch (blockType) {
    case 'HeroSliderBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="20" y="30" width="80" height="10" rx="3" fill="#EC4B46" />
            <rect x="20" y="48" width="180" height="18" rx="3" fill="#FFFFFF" />
            <rect x="20" y="74" width="220" height="8" rx="2" fill="#94A3B8" />
            <rect x="20" y="88" width="160" height="8" rx="2" fill="#94A3B8" />
            <rect x="20" y="112" width="90" height="24" rx="3" fill="#EC4B46" />
            <circle cx="125" cy="124" r="12" fill="#334155" />
            <polygon points="122,119 130,124 122,129" fill="#FFFFFF" />
            <circle cx="270" cy="80" r="10" fill="#334155" />
            <circle cx="285" cy="80" r="4" fill="#94A3B8" />
          </svg>
        </div>
      );

    case 'PageHeroBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="70" y="35" width="160" height="8" rx="2" fill="#EC4B46" />
            <rect x="50" y="52" width="200" height="22" rx="3" fill="#FFFFFF" />
            <rect x="40" y="84" width="220" height="8" rx="2" fill="#94A3B8" />
            <rect x="60" y="98" width="180" height="8" rx="2" fill="#64748B" />
          </svg>
        </div>
      );

    case 'SplitHeroBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="25" width="60" height="8" rx="2" fill="#EC4B46" />
            <rect x="15" y="40" width="120" height="16" rx="3" fill="#FFFFFF" />
            <rect x="15" y="64" width="130" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="76" width="110" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="100" width="60" height="20" rx="3" fill="#EC4B46" />
            <rect x="82" y="100" width="60" height="20" rx="3" fill="#334155" />
            <rect x="160" y="25" width="125" height="100" rx="6" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="175" y="90" width="95" height="25" rx="4" fill="#0F172A" />
            <rect x="185" y="100" width="75" height="6" rx="2" fill="#EC4B46" />
          </svg>
        </div>
      );

    case 'VideoHeroBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#000000" />
            <circle cx="150" cy="55" r="22" fill="#EC4B46" />
            <polygon points="144,46 160,55 144,64" fill="#FFFFFF" />
            <rect x="50" y="90" width="200" height="16" rx="3" fill="#FFFFFF" />
            <rect x="70" y="114" width="160" height="7" rx="2" fill="#94A3B8" />
            <rect x="110" y="130" width="80" height="18" rx="3" fill="#EC4B46" />
          </svg>
        </div>
      );

    case 'TwoColumnStoryBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="20" width="50" height="6" rx="2" fill="#EC4B46" />
            <rect x="15" y="32" width="120" height="14" rx="2" fill="#FFFFFF" />
            <rect x="15" y="54" width="130" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="66" width="125" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="78" width="110" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="96" width="70" height="18" rx="2" fill="#EC4B46" />
            <rect x="160" y="20" width="125" height="115" rx="4" fill="#334155" />
            <circle cx="222" cy="77" r="16" fill="#475569" />
          </svg>
        </div>
      );

    case 'ThreeColumnCardsBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="100" y="15" width="100" height="8" rx="2" fill="#FFFFFF" />
            <rect x="15" y="38" width="80" height="100" rx="4" fill="#1E293B" stroke="#334155" />
            <circle cx="35" cy="55" r="8" fill="#EC4B46" />
            <rect x="25" y="70" width="60" height="6" rx="2" fill="#FFFFFF" />
            <rect x="25" y="82" width="50" height="4" rx="1" fill="#94A3B8" />
            <rect x="25" y="90" width="55" height="4" rx="1" fill="#94A3B8" />
            <rect x="110" y="38" width="80" height="100" rx="4" fill="#1E293B" stroke="#334155" />
            <circle cx="130" cy="55" r="8" fill="#EC4B46" />
            <rect x="120" y="70" width="60" height="6" rx="2" fill="#FFFFFF" />
            <rect x="120" y="82" width="50" height="4" rx="1" fill="#94A3B8" />
            <rect x="120" y="90" width="55" height="4" rx="1" fill="#94A3B8" />
            <rect x="205" y="38" width="80" height="100" rx="4" fill="#1E293B" stroke="#334155" />
            <circle cx="225" cy="55" r="8" fill="#EC4B46" />
            <rect x="215" y="70" width="60" height="6" rx="2" fill="#FFFFFF" />
            <rect x="215" y="82" width="50" height="4" rx="1" fill="#94A3B8" />
            <rect x="215" y="90" width="55" height="4" rx="1" fill="#94A3B8" />
          </svg>
        </div>
      );

    case 'CapabilitiesGridBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="100" y="10" width="100" height="8" rx="2" fill="#FFFFFF" />
            <rect x="15" y="28" width="80" height="55" rx="4" fill="#1E293B" />
            <rect x="22" y="34" width="20" height="6" rx="2" fill="#EC4B46" />
            <rect x="22" y="44" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="22" y="54" width="45" height="4" rx="1" fill="#94A3B8" />
            <rect x="110" y="28" width="80" height="55" rx="4" fill="#1E293B" />
            <rect x="117" y="34" width="20" height="6" rx="2" fill="#EC4B46" />
            <rect x="117" y="44" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="117" y="54" width="45" height="4" rx="1" fill="#94A3B8" />
            <rect x="205" y="28" width="80" height="55" rx="4" fill="#1E293B" />
            <rect x="212" y="34" width="20" height="6" rx="2" fill="#EC4B46" />
            <rect x="212" y="44" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="212" y="54" width="45" height="4" rx="1" fill="#94A3B8" />
            <rect x="15" y="92" width="80" height="55" rx="4" fill="#1E293B" />
            <rect x="110" y="92" width="80" height="55" rx="4" fill="#1E293B" />
            <rect x="205" y="92" width="80" height="55" rx="4" fill="#1E293B" />
          </svg>
        </div>
      );

    case 'ModularFrameworkBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#090D16" />
            <rect x="80" y="12" width="140" height="8" rx="2" fill="#EC4B46" />
            <rect x="15" y="32" width="80" height="65" rx="4" fill="#1E293B" stroke="#EC4B46" strokeWidth="1.5" />
            <rect x="22" y="40" width="30" height="6" rx="2" fill="#EC4B46" />
            <rect x="22" y="52" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="22" y="64" width="60" height="4" rx="1" fill="#94A3B8" />
            <rect x="110" y="32" width="80" height="65" rx="4" fill="#1E293B" stroke="#334155" />
            <rect x="117" y="40" width="30" height="6" rx="2" fill="#94A3B8" />
            <rect x="117" y="52" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="117" y="64" width="60" height="4" rx="1" fill="#94A3B8" />
            <rect x="205" y="32" width="80" height="65" rx="4" fill="#1E293B" stroke="#334155" />
            <rect x="212" y="40" width="30" height="6" rx="2" fill="#94A3B8" />
            <rect x="212" y="52" width="55" height="6" rx="2" fill="#FFFFFF" />
            <rect x="212" y="64" width="60" height="4" rx="1" fill="#94A3B8" />
            <rect x="15" y="108" width="270" height="40" rx="4" fill="#111827" stroke="#374151" />
            <rect x="30" y="124" width="140" height="6" rx="2" fill="#E2E8F0" />
            <rect x="195" y="117" width="75" height="20" rx="3" fill="#EC4B46" />
          </svg>
        </div>
      );

    case 'ProcessStepsBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="90" y="15" width="120" height="8" rx="2" fill="#FFFFFF" />
            <line x1="45" y1="55" x2="255" y2="55" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="45" cy="55" r="14" fill="#EC4B46" />
            <text x="41" y="60" fill="#FFF" fontSize="11" fontWeight="bold">1</text>
            <rect x="20" y="80" width="50" height="6" rx="2" fill="#FFFFFF" />
            <circle cx="115" cy="55" r="14" fill="#EC4B46" />
            <text x="111" y="60" fill="#FFF" fontSize="11" fontWeight="bold">2</text>
            <rect x="90" y="80" width="50" height="6" rx="2" fill="#FFFFFF" />
            <circle cx="185" cy="55" r="14" fill="#EC4B46" />
            <text x="181" y="60" fill="#FFF" fontSize="11" fontWeight="bold">3</text>
            <rect x="160" y="80" width="50" height="6" rx="2" fill="#FFFFFF" />
            <circle cx="255" cy="55" r="14" fill="#EC4B46" />
            <text x="251" y="60" fill="#FFF" fontSize="11" fontWeight="bold">4</text>
            <rect x="230" y="80" width="50" height="6" rx="2" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'ProductCatalogBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="12" width="60" height="20" rx="2" fill="#1E293B" />
            <rect x="85" y="12" width="60" height="20" rx="2" fill="#1E293B" />
            <rect x="155" y="12" width="60" height="20" rx="2" fill="#1E293B" />
            <rect x="225" y="12" width="60" height="20" rx="2" fill="#1E293B" />
            <rect x="15" y="42" width="130" height="105" rx="4" fill="#1E293B" />
            <rect x="25" y="50" width="110" height="45" rx="3" fill="#334155" />
            <rect x="25" y="104" width="70" height="6" rx="2" fill="#FFFFFF" />
            <rect x="25" y="116" width="90" height="4" rx="1" fill="#94A3B8" />
            <rect x="155" y="42" width="130" height="105" rx="4" fill="#1E293B" />
            <rect x="165" y="50" width="110" height="45" rx="3" fill="#334155" />
            <rect x="165" y="104" width="70" height="6" rx="2" fill="#FFFFFF" />
            <rect x="165" y="116" width="90" height="4" rx="1" fill="#94A3B8" />
          </svg>
        </div>
      );

    case 'FeatureComparisonBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="15" width="270" height="24" rx="2" fill="#1E293B" />
            <rect x="25" y="24" width="50" height="6" rx="2" fill="#94A3B8" />
            <rect x="100" y="24" width="40" height="6" rx="2" fill="#94A3B8" />
            <rect x="160" y="15" width="50" height="24" fill="#EC4B46" />
            <rect x="165" y="24" width="40" height="6" rx="2" fill="#FFFFFF" />
            <rect x="230" y="24" width="40" height="6" rx="2" fill="#94A3B8" />
            <rect x="15" y="45" width="270" height="20" fill="#111827" />
            <rect x="25" y="52" width="60" height="6" rx="2" fill="#E2E8F0" />
            <rect x="15" y="70" width="270" height="20" fill="#1E293B" />
            <rect x="25" y="77" width="60" height="6" rx="2" fill="#E2E8F0" />
            <rect x="15" y="95" width="270" height="20" fill="#111827" />
            <rect x="25" y="102" width="60" height="6" rx="2" fill="#E2E8F0" />
            <rect x="15" y="120" width="270" height="20" fill="#1E293B" />
          </svg>
        </div>
      );

    case 'StatsCounterBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="35" width="60" height="90" rx="4" fill="#1E293B" />
            <rect x="25" y="55" width="35" height="18" rx="2" fill="#EC4B46" />
            <rect x="22" y="85" width="45" height="6" rx="2" fill="#FFFFFF" />
            <rect x="85" y="35" width="60" height="90" rx="4" fill="#1E293B" />
            <rect x="95" y="55" width="40" height="18" rx="2" fill="#EC4B46" />
            <rect x="92" y="85" width="45" height="6" rx="2" fill="#FFFFFF" />
            <rect x="155" y="35" width="60" height="90" rx="4" fill="#1E293B" />
            <rect x="165" y="55" width="40" height="18" rx="2" fill="#EC4B46" />
            <rect x="162" y="85" width="45" height="6" rx="2" fill="#FFFFFF" />
            <rect x="225" y="35" width="60" height="90" rx="4" fill="#1E293B" />
            <rect x="235" y="55" width="35" height="18" rx="2" fill="#EC4B46" />
            <rect x="232" y="85" width="45" height="6" rx="2" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'ClientLogosBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="90" y="20" width="120" height="8" rx="2" fill="#94A3B8" />
            <rect x="15" y="45" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="85" y="45" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="155" y="45" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="225" y="45" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="15" y="95" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="85" y="95" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="155" y="95" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
            <rect x="225" y="95" width="55" height="35" rx="3" fill="#1E293B" stroke="#334155" />
          </svg>
        </div>
      );

    case 'TestimonialsCarouselBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <circle cx="90" cy="35" r="4" fill="#F59E0B" />
            <circle cx="105" cy="35" r="4" fill="#F59E0B" />
            <circle cx="120" cy="35" r="4" fill="#F59E0B" />
            <circle cx="135" cy="35" r="4" fill="#F59E0B" />
            <circle cx="150" cy="35" r="4" fill="#F59E0B" />
            <rect x="40" y="55" width="220" height="8" rx="2" fill="#FFFFFF" />
            <rect x="60" y="70" width="180" height="8" rx="2" fill="#FFFFFF" />
            <circle cx="130" cy="105" r="10" fill="#EC4B46" />
            <rect x="145" y="100" width="60" height="6" rx="2" fill="#E2E8F0" />
            <rect x="145" y="110" width="40" height="4" rx="1" fill="#94A3B8" />
            <circle cx="140" cy="138" r="4" fill="#EC4B46" />
            <circle cx="155" cy="138" r="3" fill="#475569" />
          </svg>
        </div>
      );

    case 'PortfolioGridBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="15" width="60" height="55" rx="3" fill="#334155" />
            <rect x="85" y="15" width="60" height="55" rx="3" fill="#334155" />
            <rect x="155" y="15" width="60" height="55" rx="3" fill="#334155" />
            <rect x="225" y="15" width="60" height="55" rx="3" fill="#334155" />
            <rect x="15" y="85" width="60" height="55" rx="3" fill="#334155" />
            <rect x="85" y="85" width="60" height="55" rx="3" fill="#334155" />
            <rect x="155" y="85" width="60" height="55" rx="3" fill="#334155" />
            <rect x="225" y="85" width="60" height="55" rx="3" fill="#334155" />
          </svg>
        </div>
      );

    case 'FaqAccordionBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="90" y="12" width="120" height="8" rx="2" fill="#FFFFFF" />
            <rect x="15" y="32" width="270" height="42" rx="3" fill="#1E293B" stroke="#EC4B46" />
            <rect x="25" y="42" width="120" height="6" rx="2" fill="#FFFFFF" />
            <text x="270" y="47" fill="#EC4B46" fontSize="12" fontWeight="bold">−</text>
            <rect x="25" y="56" width="200" height="4" rx="1" fill="#94A3B8" />
            <rect x="25" y="64" width="160" height="4" rx="1" fill="#94A3B8" />
            <rect x="15" y="82" width="270" height="24" rx="3" fill="#1E293B" />
            <rect x="25" y="91" width="130" height="6" rx="2" fill="#FFFFFF" />
            <text x="270" y="96" fill="#EC4B46" fontSize="12" fontWeight="bold">+</text>
            <rect x="15" y="114" width="270" height="24" rx="3" fill="#1E293B" />
            <rect x="25" y="123" width="110" height="6" rx="2" fill="#FFFFFF" />
            <text x="270" y="128" fill="#EC4B46" fontSize="12" fontWeight="bold">+</text>
          </svg>
        </div>
      );

    case 'PricingMatrixBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="20" width="80" height="120" rx="4" fill="#1E293B" />
            <rect x="25" y="30" width="40" height="6" rx="2" fill="#94A3B8" />
            <rect x="25" y="42" width="50" height="12" rx="2" fill="#FFFFFF" />
            <rect x="25" y="62" width="60" height="4" rx="1" fill="#64748B" />
            <rect x="25" y="70" width="55" height="4" rx="1" fill="#64748B" />
            <rect x="25" y="112" width="60" height="16" rx="2" fill="#334155" />
            <rect x="110" y="12" width="80" height="136" rx="4" fill="#1E293B" stroke="#EC4B46" strokeWidth="2" />
            <rect x="120" y="24" width="40" height="6" rx="2" fill="#EC4B46" />
            <rect x="120" y="36" width="55" height="14" rx="2" fill="#FFFFFF" />
            <rect x="120" y="58" width="60" height="4" rx="1" fill="#94A3B8" />
            <rect x="120" y="68" width="55" height="4" rx="1" fill="#94A3B8" />
            <rect x="120" y="78" width="60" height="4" rx="1" fill="#94A3B8" />
            <rect x="120" y="118" width="60" height="18" rx="2" fill="#EC4B46" />
            <rect x="205" y="20" width="80" height="120" rx="4" fill="#1E293B" />
            <rect x="215" y="30" width="40" height="6" rx="2" fill="#94A3B8" />
            <rect x="215" y="42" width="50" height="12" rx="2" fill="#FFFFFF" />
            <rect x="215" y="62" width="60" height="4" rx="1" fill="#64748B" />
            <rect x="215" y="70" width="55" height="4" rx="1" fill="#64748B" />
            <rect x="215" y="112" width="60" height="16" rx="2" fill="#334155" />
          </svg>
        </div>
      );

    case 'CtaBannerBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#F1F5F9" />
            <rect x="80" y="35" width="140" height="8" rx="2" fill="#EC4B46" />
            <rect x="40" y="55" width="220" height="18" rx="3" fill="#0F172A" />
            <rect x="60" y="80" width="180" height="8" rx="2" fill="#64748B" />
            <rect x="100" y="105" width="100" height="24" rx="3" fill="#EC4B46" />
          </svg>
        </div>
      );

    case 'RichTextBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
            <rect x="20" y="18" width="100" height="12" rx="2" fill="#0F172A" />
            <rect x="20" y="40" width="260" height="6" rx="2" fill="#64748B" />
            <rect x="20" y="52" width="240" height="6" rx="2" fill="#64748B" />
            <rect x="20" y="64" width="210" height="6" rx="2" fill="#64748B" />
            <circle cx="26" cy="85" r="3" fill="#EC4B46" />
            <rect x="36" y="82" width="160" height="6" rx="2" fill="#475569" />
            <circle cx="26" cy="100" r="3" fill="#EC4B46" />
            <rect x="36" y="97" width="140" height="6" rx="2" fill="#475569" />
            <rect x="20" y="118" width="180" height="22" rx="2" fill="#F1F5F9" stroke="#CBD5E1" />
          </svg>
        </div>
      );

    case 'ContactFormBlock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="15" y="25" width="50" height="6" rx="2" fill="#EC4B46" />
            <rect x="15" y="38" width="100" height="12" rx="2" fill="#FFFFFF" />
            <rect x="15" y="58" width="110" height="5" rx="2" fill="#94A3B8" />
            <rect x="15" y="80" width="80" height="8" rx="2" fill="#E2E8F0" />
            <rect x="15" y="95" width="90" height="8" rx="2" fill="#E2E8F0" />
            <rect x="15" y="110" width="100" height="8" rx="2" fill="#E2E8F0" />
            <rect x="145" y="20" width="140" height="120" rx="4" fill="#1E293B" />
            <rect x="155" y="32" width="120" height="14" rx="2" fill="#334155" />
            <rect x="155" y="52" width="120" height="14" rx="2" fill="#334155" />
            <rect x="155" y="72" width="120" height="30" rx="2" fill="#334155" />
            <rect x="155" y="108" width="120" height="18" rx="2" fill="#EC4B46" />
          </svg>
        </div>
      );

    default:
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 300 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="6" fill="#0F172A" />
            <rect x="80" y="40" width="140" height="14" rx="2" fill="#FFFFFF" />
            <rect x="50" y="65" width="200" height="8" rx="2" fill="#94A3B8" />
            <rect x="70" y="80" width="160" height="8" rx="2" fill="#94A3B8" />
            <rect x="110" y="105" width="80" height="22" rx="3" fill="#EC4B46" />
          </svg>
        </div>
      );
  }
}
