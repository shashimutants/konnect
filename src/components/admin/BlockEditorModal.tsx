import React, { useState, useEffect } from 'react';
import MediaPickerModal from './MediaPickerModal';
import RichTextEditor from './RichTextEditor';
import SectionWireframe from './SectionWireframe';
import SchemaPreviewModal from './SchemaPreviewModal';
import { getSectionTemplates } from '@/actions/schemas';

interface BlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  initialBlock?: {
    id?: string;
    blockType: string;
    orderIndex: number;
    contentJson: string;
    isVisible: boolean;
    animationType?: string | null;
    animationDuration?: string | null;
    animationDelay?: number | null;
  } | null;
  onSave: (data: {
    id?: string;
    pageId: string;
    blockType: string;
    orderIndex: number;
    contentJson: string;
    isVisible: boolean;
    animationType?: string | null;
    animationDuration?: string | null;
    animationDelay?: number | null;
  }) => Promise<void>;
}

const AVAILABLE_BLOCK_TYPES = [
  { type: 'HeroSliderBlock', label: 'Hero Slider (Rotating Multi-Slide Banner)' },
  { type: 'PageHeroBlock', label: 'Page Hero Banner (Inner Page Header)' },
  { type: 'SplitHeroBlock', label: '50/50 Split Hero with Dual CTAs' },
  { type: 'VideoHeroBlock', label: 'Full-Width Video Hero Banner' },
  { type: 'TwoColumnStoryBlock', label: '2-Column Story / Narrative with Media' },
  { type: 'ThreeColumnCardsBlock', label: '3-Column Feature Cards' },
  { type: 'RichTextBlock', label: 'WordPress WYSIWYG Rich Text' },
  { type: 'BlockquoteHighlightBlock', label: 'Editorial Pull-Quote Highlight' },
  { type: 'CapabilitiesGridBlock', label: 'Capabilities / Service Cards Grid' },
  { type: 'ModularFrameworkBlock', label: 'Modular 3-Step Framework' },
  { type: 'ProcessStepsBlock', label: 'Process Steps Roadmap (1-4)' },
  { type: 'ProductCatalogBlock', label: 'Product Catalog & Specs Strip' },
  { type: 'FeatureComparisonBlock', label: 'Feature & Specification Comparison Matrix' },
  { type: 'StatsCounterBlock', label: 'Animated Stats Counter Bar' },
  { type: 'ClientLogosBlock', label: 'Client Logo Showcase' },
  { type: 'TestimonialsCarouselBlock', label: 'Customer Reviews & Testimonials Carousel' },
  { type: 'PortfolioGridBlock', label: '8-Box Portfolio Gallery' },
  { type: 'FaqAccordionBlock', label: 'Interactive Expandable FAQ Accordion' },
  { type: 'PricingMatrixBlock', label: 'Tiered Pricing & Campaign Matrix' },
  { type: 'CtaBannerBlock', label: 'Call To Action (CTA) Banner' },
  { type: 'ContactFormBlock', label: 'Contact Info & Inquiry Form' },
];

export default function BlockEditorModal({
  isOpen,
  onClose,
  pageId,
  initialBlock,
  onSave,
}: BlockEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'animation'>('content');
  const [blockType, setBlockType] = useState('TwoColumnStoryBlock');
  const [content, setContent] = useState<any>({});
  const [isVisible, setIsVisible] = useState(true);
  const [animationType, setAnimationType] = useState('fade-in');
  const [animationDuration, setAnimationDuration] = useState('normal');
  const [animationDelay, setAnimationDelay] = useState(0);

  const [saving, setSaving] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<((url: string) => void) | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Schema Template Inserter
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [availableSchemas, setAvailableSchemas] = useState<any[]>([]);
  const [previewSchema, setPreviewSchema] = useState<any | null>(null);

  useEffect(() => {
    if (initialBlock) {
      setBlockType(initialBlock.blockType);
      try {
        setContent(JSON.parse(initialBlock.contentJson));
      } catch {
        setContent({});
      }
      setIsVisible(initialBlock.isVisible);
      setAnimationType(initialBlock.animationType || 'fade-in');
      setAnimationDuration(initialBlock.animationDuration || 'normal');
      setAnimationDelay(initialBlock.animationDelay || 0);
    } else {
      setBlockType('TwoColumnStoryBlock');
      setContent({
        subtitle: 'Our Strategic Narrative',
        title: 'One Partner. Every Channel. Every State.',
        paragraphs: ['We unite performance marketing and physical display infrastructure under one contract.'],
        btnText: 'Learn More',
        btnLink: '/about',
        sideType: 'image',
        sideContent: '/images/about-001-free-img.jpg',
      });
      setIsVisible(true);
      setAnimationType('slide-up');
      setAnimationDuration('normal');
      setAnimationDelay(0);
    }
  }, [initialBlock, isOpen]);

  useEffect(() => {
    if (schemaModalOpen) {
      getSectionTemplates().then((templates) => setAvailableSchemas(templates));
    }
  }, [schemaModalOpen]);

  function handleTypeChange(newType: string) {
    setBlockType(newType);
    let sampleContent = {};

    switch (newType) {
      case 'HeroSliderBlock':
        sampleContent = {
          slides: [
            {
              badge: 'CAMPAIGN HEADLINE',
              title: 'Transforming Brand Growth.',
              subtitle: 'OUTDOOR • DIGITAL • HARDWARE',
              ctaText: 'GET STARTED NOW',
              ctaLink: '/contact',
              showPlayBtn: true,
              bgImage: '/images/bg-01-free-img.jpg',
            },
          ],
        };
        break;
      case 'PageHeroBlock':
        sampleContent = {
          subtitle: 'Category Subtitle',
          title: 'Page Header Title',
          description: 'Overview description of this page section.',
          bgImage: '/images/bg-14-free-img.jpg',
        };
        break;
      case 'SplitHeroBlock':
        sampleContent = {
          badge: 'Enterprise Performance',
          title: 'Architecting National Brand Presence',
          subtitle: 'Uniting high-traffic outdoor billboard inventory and digital performance marketing.',
          primaryBtnText: 'Launch Campaign',
          primaryBtnLink: '/contact',
          secondaryBtnText: 'Explore Capabilities',
          secondaryBtnLink: '/services',
          image: '/images/about-001-free-img.jpg',
          highlightText: '50 States Nationwide Coverage',
        };
        break;
      case 'VideoHeroBlock':
        sampleContent = {
          badge: 'High Impact Media',
          title: 'Where Creative Scale Meets Precision Delivery',
          subtitle: 'Transform urban skylines with iconic high-bright display engineering.',
          posterImage: '/images/bg-01-free-img.jpg',
          ctaText: 'View Our Portfolio',
          ctaLink: '/portfolio',
        };
        break;
      case 'TwoColumnStoryBlock':
        sampleContent = {
          subtitle: 'Who We Are',
          title: 'Strategic Narrative Headline',
          paragraphs: ['Add your detailed copy here.'],
          btnText: 'Learn More',
          btnLink: '/about',
          sideType: 'image',
          sideContent: '/images/about-001-free-img.jpg',
        };
        break;
      case 'ThreeColumnCardsBlock':
        sampleContent = {
          subtitle: 'Core Pillars',
          title: 'Built For Enterprise Reliability',
          intro: 'Engineered from the ground up to deliver uncompromising media performance.',
          cards: [
            { icon: '🚀', title: 'High-Traffic Inventory', description: 'Exclusive highway billboard placements.', linkText: 'Explore Media', linkUrl: '/services' },
            { icon: '⚡', title: 'Commercial Hardware', description: 'Tier-1 SMD diodes and high-refresh video walls.', linkText: 'View Specs', linkUrl: '/products' },
            { icon: '📊', title: 'Attribution Tracking', description: 'Foot-traffic lift metrics and cross-channel retargeting.', linkText: 'See Analytics', linkUrl: '/services' },
          ],
        };
        break;
      case 'BlockquoteHighlightBlock':
        sampleContent = {
          quote: 'Konnect Marketing transformed how our retail brand engages metropolitan foot-traffic.',
          authorName: 'Marcus Vance',
          authorTitle: 'Chief Marketing Officer',
          company: 'Apex Retail Group',
          backgroundColor: 'light',
        };
        break;
      case 'CapabilitiesGridBlock':
        sampleContent = {
          subtitle: 'Our Services',
          title: 'Six Integrated Channels',
          cards: [
            { number: '01', title: 'Digital Marketing & Demand Gen', description: 'Paid search, social, and SEO.', btnText: 'Explore', btnLink: '/services' },
            { number: '02', title: 'Outdoor & Transit Advertising', description: 'Static and digital billboards.', btnText: 'Explore', btnLink: '/services' },
            { number: '03', title: 'Video Display & Digital Signage', description: 'LED video walls & cloud CMS.', btnText: 'Explore', btnLink: '/products' },
          ],
        };
        break;
      case 'ModularFrameworkBlock':
        sampleContent = {
          subtitle: 'Our Scalable Model',
          title: 'Start Regional. Scale National.',
          introText: 'Our modular framework allows enterprise brands to test and scale.',
          steps: [
            { stepNum: 'PHASE 01', title: 'Regional Pilot & Proof', description: 'Deploy targeted outdoor and digital ads in focus markets.' },
            { stepNum: 'PHASE 02', title: 'Corridor Expansion', description: 'Scale media inventory along primary transit corridors.' },
            { stepNum: 'PHASE 03', title: 'National Dominance', description: 'Synchronize nationwide billboard flights and screens.' },
          ],
          quoteText: 'Konnect Marketing delivers creative ambition with logistical precision.',
          ctaText: 'Start Your Regional Pilot',
          ctaLink: '/contact',
        };
        break;
      case 'ProcessStepsBlock':
        sampleContent = {
          subtitle: 'How We Work',
          title: 'Our Proven 4-Step Execution Model',
          description: 'From initial site survey to hardware commissioning and flight monitoring.',
          steps: [
            { step: '01', title: 'Market Audit', description: 'Comprehensive analysis of traffic patterns and zoning.' },
            { step: '02', title: 'Engineering', description: 'Custom structural engineering and electrical load calculations.' },
            { step: '03', title: 'Calibration', description: 'High-contrast content optimization for daylight readability.' },
            { step: '04', title: 'Optimization', description: 'Continuous uptime monitoring and real-time impression telemetry.' },
          ],
        };
        break;
      case 'FeatureComparisonBlock':
        sampleContent = {
          subtitle: 'Tier Comparison',
          title: 'Compare Hardware & Flight Specifications',
          description: 'Choose the optimal package tailored for your footprint.',
          columnHeaders: ['Specification', 'Standard Flight', 'Regional Synergy', 'National Network'],
          rows: [
            { feature: 'Pixel Pitch Options', plan1: 'P10 Outdoor', plan2: 'P6 - P8 SMD', plan3: 'P2.5 - P4 Ultra Fine' },
            { feature: 'Brightness Output', plan1: '5,500 Nits', plan2: '7,500 Nits', plan3: '10,000+ Nits HDR' },
            { feature: 'Cloud CMS Scheduling', plan1: 'Single Site', plan2: 'Multi-Branch', plan3: 'API Automated' },
          ],
        };
        break;
      case 'TestimonialsCarouselBlock':
        sampleContent = {
          subtitle: 'Client Testimonials',
          title: 'What Enterprise Partners Say',
          items: [
            { quote: 'Konnect Marketing delivered our multi-market DOOH expansion flawlessly.', author: 'Elena Rostova', role: 'VP of Growth', company: 'Solstice Tech', stars: 5 },
            { quote: 'The indoor video wall installation is breathtaking. Flawless pixel clarity.', author: 'David Chen', role: 'Director of Facilities', company: 'Horizon Retail', stars: 5 },
          ],
        };
        break;
      case 'FaqAccordionBlock':
        sampleContent = {
          subtitle: 'Got Questions?',
          title: 'Frequently Asked Questions',
          description: 'Find answers regarding hardware lead times and campaign flight management.',
          faqs: [
            { question: 'What is the typical lead time for custom LED wall installations?', answer: 'Standard modular LED panels typically ship within 2 to 3 weeks, with complete structural installation taking 3-5 days.' },
            { question: 'Do you handle municipal billboard permits and zoning approvals?', answer: 'Yes, our specialized compliance team manages all structural engineering stamps and municipal permits.' },
          ],
        };
        break;
      case 'PricingMatrixBlock':
        sampleContent = {
          subtitle: 'Campaign Packages',
          title: 'Flexible Campaign Flight Tiers',
          description: 'Scalable media solutions for regional rollouts and nationwide brand saturation.',
          plans: [
            { name: 'Regional Launch', price: '$4,500', period: 'month', description: 'Ideal for local market awareness.', features: ['2 Billboard Flights', '150k Impressions'], isPopular: false, ctaText: 'Start Regional', ctaLink: '/contact' },
            { name: 'Corridor Expansion', price: '$12,500', period: 'month', description: 'Multi-city corridor dominance.', features: ['8 DOOH Locations', '650k Impressions', 'Geo-Fencing Retargeting'], isPopular: true, ctaText: 'Scale Corridor', ctaLink: '/contact' },
            { name: 'National Network', price: '$35,000+', period: 'month', description: 'Omnichannel nationwide saturation.', features: ['25+ National Locations', '3.5M+ Impressions', '24/7 Priority Support'], isPopular: false, ctaText: 'Contact Enterprise', ctaLink: '/contact' },
          ],
        };
        break;
      case 'StatsCounterBlock':
        sampleContent = {
          stats: [
            { target: '50', suffix: '', label: 'States Covered' },
            { target: '500', suffix: '+', label: 'Displays Managed' },
            { target: '2.5', suffix: 'M+', label: 'Monthly Impressions' },
            { target: '94', suffix: '%', label: 'Client Retention' },
          ],
        };
        break;
      case 'ClientLogosBlock':
        sampleContent = {
          subtitle: 'Trusted Partnerships',
          title: 'Powering Leading Brands Nationwide',
          logos: [
            { name: 'Client 1', image: '/images/logo-1.png' },
            { name: 'Client 2', image: '/images/logo-2.png' },
            { name: 'Client 3', image: '/images/logo-3.png' },
            { name: 'Client 5', image: '/images/logo-5.png' },
          ],
        };
        break;
      case 'PortfolioGridBlock':
        sampleContent = {
          items: [
            { category: 'DOOH Media', title: 'Times Square Spectacular', image: '/images/portfolio-0001-free-img.jpg', link: '/portfolio' },
            { category: 'Commercial LED', title: 'Flagship Store Video Wall', image: '/images/portfolio-00002-free-img.jpg', link: '/portfolio' },
          ],
        };
        break;
      case 'CtaBannerBlock':
        sampleContent = {
          variant: 'light',
          subtitle: 'Vision & Partnership',
          title: 'Ready to launch your next high-impact campaign?',
          btnText: 'Start a Conversation',
          btnLink: '/contact',
        };
        break;
      case 'RichTextBlock':
        sampleContent = {
          title: 'Section Header Title',
          htmlContent: '<p>Write formatted paragraph content and insert images using the WYSIWYG editor.</p>',
        };
        break;
      case 'ContactFormBlock':
        sampleContent = {
          title: 'Get In Touch',
          subtitle: 'Available 24/7',
          phone: '929-242-6868',
          email: 'contact@konnectmarketingusa.com',
          hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
          address: 'New York, NY',
        };
        break;
      default:
        sampleContent = {};
    }

    setContent(sampleContent);
  }

  function handleInsertSchema(schema: any) {
    setBlockType(schema.blockType);
    try {
      setContent(JSON.parse(schema.defaultContentJson));
    } catch {
      setContent({});
    }
    try {
      const anim = JSON.parse(schema.defaultAnimationJson || '{}');
      if (anim.type) setAnimationType(anim.type);
      if (anim.duration) setAnimationDuration(anim.duration);
      if (anim.delay) setAnimationDelay(anim.delay);
    } catch {}
    setSchemaModalOpen(false);
  }

  async function handleSave() {
    setSaving(true);
    await onSave({
      id: initialBlock?.id,
      pageId,
      blockType,
      orderIndex: initialBlock?.orderIndex ?? 0,
      contentJson: JSON.stringify(content),
      isVisible,
      animationType,
      animationDuration,
      animationDelay,
    });
    setSaving(false);
    onClose();
  }

  function pickImage(callback: (url: string) => void) {
    setActiveMediaTarget(() => callback);
    setMediaPickerOpen(true);
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '92vh',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 25px',
              borderBottom: '1px solid #eaeaea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111' }}>
                {initialBlock ? 'Edit Section Block' : 'Add Section Block'}
              </h3>
              <button
                type="button"
                onClick={() => setSchemaModalOpen(true)}
                style={{
                  padding: '5px 12px',
                  backgroundColor: '#fff',
                  border: '1px solid var(--ast-global-color-0)',
                  color: 'var(--ast-global-color-0)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ✨ Insert from Schemas Library
              </button>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#888' }}
            >
              &times;
            </button>
          </div>

          {/* Section Type Selector & Tabs Bar */}
          <div
            style={{
              padding: '12px 25px',
              borderBottom: '1px solid #eaeaea',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '520px' }}>
              <div style={{ width: '80px', height: '44px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <SectionWireframe blockType={blockType} />
              </div>
              <select
                value={blockType}
                onChange={(e) => handleTypeChange(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}
              >
                {AVAILABLE_BLOCK_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'content' ? 'var(--ast-global-color-0)' : '#f0f0f0',
                  color: activeTab === 'content' ? '#fff' : '#333',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                📝 Content Fields
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('animation')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'animation' ? 'var(--ast-global-color-0)' : '#f0f0f0',
                  color: activeTab === 'animation' ? '#fff' : '#333',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ⚡ Animation &amp; Effects
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '25px', backgroundColor: '#fcfcfc' }}>
            {activeTab === 'animation' ? (
              <div style={formBoxStyle}>
                <h4 style={{ margin: '0 0 15px', fontSize: '15px', fontWeight: 700, color: '#111' }}>
                  Scroll Entrance Animation &amp; Viewport Effects
                </h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '25px' }}>
                  Control how this section reveals itself when visitors scroll down the page.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Animation Entrance Type</label>
                    <select
                      value={animationType}
                      onChange={(e) => setAnimationType(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="none">None (Static Render)</option>
                      <option value="fade-in">Fade In (Opacity)</option>
                      <option value="slide-up">Slide Up (From Bottom)</option>
                      <option value="slide-down">Slide Down (From Top)</option>
                      <option value="slide-left">Slide Left (From Left)</option>
                      <option value="slide-right">Slide Right (From Right)</option>
                      <option value="zoom-in">Zoom In (Scale Entrance)</option>
                      <option value="bounce-in">Bounce In (Spring Physics)</option>
                      <option value="flip-in">3D Perspective Flip In</option>
                    </select>
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Animation Speed / Duration</label>
                    <select
                      value={animationDuration}
                      onChange={(e) => setAnimationDuration(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="fast">Fast (400ms)</option>
                      <option value="normal">Normal (800ms)</option>
                      <option value="slow">Slow (1200ms)</option>
                    </select>
                  </div>

                  <div>
                    <label style={fieldLabelStyle}>Scroll Delay</label>
                    <select
                      value={animationDelay}
                      onChange={(e) => setAnimationDelay(Number(e.target.value))}
                      style={inputStyle}
                    >
                      <option value={0}>0ms (Instant)</option>
                      <option value={100}>100ms</option>
                      <option value={200}>200ms</option>
                      <option value={300}>300ms</option>
                      <option value={400}>400ms</option>
                      <option value={500}>500ms</option>
                      <option value={600}>600ms</option>
                    </select>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Active Configuration:
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ast-global-color-0)' }}>
                    Effect: {animationType.toUpperCase()} &bull; Speed: {animationDuration.toUpperCase()} &bull; Delay: {animationDelay}ms
                  </div>
                </div>
              </div>
            ) : (
              /* TAB: CONTENT FIELDS (All 20 Block Types) */
              <div>
                {/* 1. HERO SLIDER */}
                {blockType === 'HeroSliderBlock' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Hero Slides ({(content.slides || []).length})</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const slides = content.slides || [];
                          setContent({
                            ...content,
                            slides: [...slides, { badge: 'NEW SLIDE', title: 'Slide Title', subtitle: 'Slide Subtitle', ctaText: 'Learn More', ctaLink: '/contact', bgImage: '/images/bg-01-free-img.jpg' }],
                          });
                        }}
                        style={addBtnStyle}
                      >
                        + Add Slide
                      </button>
                    </div>

                    {(content.slides || []).map((slide: any, sIdx: number) => (
                      <div key={sIdx} style={cardContainerStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <strong style={{ fontSize: '13px', color: 'var(--ast-global-color-0)' }}>Slide #{sIdx + 1}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              const slides = content.slides.filter((_: any, idx: number) => idx !== sIdx);
                              setContent({ ...content, slides });
                            }}
                            style={deleteBtnStyle}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Badge</label>
                            <input type="text" value={slide.badge || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].badge = e.target.value; setContent({ ...content, slides: s }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Title</label>
                            <input type="text" value={slide.title || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].title = e.target.value; setContent({ ...content, slides: s }); }} style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={slide.subtitle || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].subtitle = e.target.value; setContent({ ...content, slides: s }); }} style={inputStyle} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={fieldLabelStyle}>CTA Text</label>
                            <input type="text" value={slide.ctaText || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].ctaText = e.target.value; setContent({ ...content, slides: s }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>CTA Link</label>
                            <input type="text" value={slide.ctaLink || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].ctaLink = e.target.value; setContent({ ...content, slides: s }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Background Image</label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input type="text" value={slide.bgImage || ''} onChange={(e) => { const s = [...content.slides]; s[sIdx].bgImage = e.target.value; setContent({ ...content, slides: s }); }} style={{ ...inputStyle, flex: 1 }} />
                              <button type="button" onClick={() => pickImage((url) => { const s = [...content.slides]; s[sIdx].bgImage = url; setContent({ ...content, slides: s }); })} style={imagePickerBtnStyle}>🖼 Pick</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. PAGE HERO */}
                {blockType === 'PageHeroBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Subtitle</label>
                      <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Title</label>
                      <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Description</label>
                      <textarea rows={2} value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Background Image</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" value={content.bgImage || ''} onChange={(e) => setContent({ ...content, bgImage: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                        <button type="button" onClick={() => pickImage((url) => setContent({ ...content, bgImage: url }))} style={imagePickerBtnStyle}>🖼 Select Image</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SPLIT HERO */}
                {blockType === 'SplitHeroBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Badge</label>
                        <input type="text" value={content.badge || ''} onChange={(e) => setContent({ ...content, badge: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Title</label>
                        <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Subtitle</label>
                      <textarea rows={2} value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Primary Button Text / Link</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder="Text" value={content.primaryBtnText || ''} onChange={(e) => setContent({ ...content, primaryBtnText: e.target.value })} style={inputStyle} />
                          <input type="text" placeholder="Link" value={content.primaryBtnLink || ''} onChange={(e) => setContent({ ...content, primaryBtnLink: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Secondary Button Text / Link</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder="Text" value={content.secondaryBtnText || ''} onChange={(e) => setContent({ ...content, secondaryBtnText: e.target.value })} style={inputStyle} />
                          <input type="text" placeholder="Link" value={content.secondaryBtnLink || ''} onChange={(e) => setContent({ ...content, secondaryBtnLink: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Side Image</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={content.image || ''} onChange={(e) => setContent({ ...content, image: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                          <button type="button" onClick={() => pickImage((url) => setContent({ ...content, image: url }))} style={imagePickerBtnStyle}>🖼 Pick</button>
                        </div>
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Floating Highlight Tag</label>
                        <input type="text" value={content.highlightText || ''} onChange={(e) => setContent({ ...content, highlightText: e.target.value })} placeholder="e.g. 50 States Covered" style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. VIDEO HERO */}
                {blockType === 'VideoHeroBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Badge</label>
                        <input type="text" value={content.badge || ''} onChange={(e) => setContent({ ...content, badge: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Headline Title</label>
                        <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Subtitle</label>
                      <textarea rows={2} value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Poster Background Image</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={content.posterImage || ''} onChange={(e) => setContent({ ...content, posterImage: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                          <button type="button" onClick={() => pickImage((url) => setContent({ ...content, posterImage: url }))} style={imagePickerBtnStyle}>🖼 Pick</button>
                        </div>
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>CTA Button Text / Link</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder="Text" value={content.ctaText || ''} onChange={(e) => setContent({ ...content, ctaText: e.target.value })} style={inputStyle} />
                          <input type="text" placeholder="Link" value={content.ctaLink || ''} onChange={(e) => setContent({ ...content, ctaLink: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. TWO COLUMN STORY */}
                {blockType === 'TwoColumnStoryBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Subtitle</label>
                        <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Headline Title</label>
                        <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Narrative Paragraphs</label>
                      {(content.paragraphs || ['']).map((p: string, pIdx: number) => (
                        <div key={pIdx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <textarea rows={2} value={p} onChange={(e) => { const ps = [...(content.paragraphs || [''])]; ps[pIdx] = e.target.value; setContent({ ...content, paragraphs: ps }); }} style={{ ...inputStyle, flex: 1 }} />
                          <button type="button" onClick={() => setContent({ ...content, paragraphs: content.paragraphs.filter((_: any, idx: number) => idx !== pIdx) })} style={deleteBtnStyle}>&times;</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setContent({ ...content, paragraphs: [...(content.paragraphs || []), ''] })} style={addBtnStyle}>+ Add Paragraph</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Button Text / Link</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" placeholder="Text" value={content.btnText || ''} onChange={(e) => setContent({ ...content, btnText: e.target.value })} style={inputStyle} />
                          <input type="text" placeholder="Link" value={content.btnLink || ''} onChange={(e) => setContent({ ...content, btnLink: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Side Media Image</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={content.sideContent || ''} onChange={(e) => setContent({ ...content, sideContent: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                          <button type="button" onClick={() => pickImage((url) => setContent({ ...content, sideContent: url }))} style={imagePickerBtnStyle}>🖼 Pick</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. THREE COLUMN CARDS */}
                {blockType === 'ThreeColumnCardsBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0 10px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Cards ({(content.cards || []).length})</h4>
                      <button type="button" onClick={() => setContent({ ...content, cards: [...(content.cards || []), { icon: '⭐', title: 'New Card', description: 'Description', linkText: 'Explore', linkUrl: '/services' }] })} style={addBtnStyle}>+ Add Card</button>
                    </div>

                    {(content.cards || []).map((card: any, cIdx: number) => (
                      <div key={cIdx} style={cardContainerStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Icon</label>
                            <input type="text" value={card.icon || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].icon = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Card Title</label>
                            <input type="text" value={card.title || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].title = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Link Text / URL</label>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <input type="text" placeholder="Text" value={card.linkText || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].linkText = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                              <input type="text" placeholder="URL" value={card.linkUrl || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].linkUrl = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Description</label>
                          <input type="text" value={card.description || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].description = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. BLOCKQUOTE HIGHLIGHT */}
                {blockType === 'BlockquoteHighlightBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Quote Text</label>
                      <textarea rows={3} value={content.quote || ''} onChange={(e) => setContent({ ...content, quote: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Author Name</label>
                        <input type="text" value={content.authorName || ''} onChange={(e) => setContent({ ...content, authorName: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Author Title / Role</label>
                        <input type="text" value={content.authorTitle || ''} onChange={(e) => setContent({ ...content, authorTitle: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Company</label>
                        <input type="text" value={content.company || ''} onChange={(e) => setContent({ ...content, company: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. CAPABILITIES GRID */}
                {blockType === 'CapabilitiesGridBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0 10px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Cards ({(content.cards || []).length})</h4>
                      <button type="button" onClick={() => setContent({ ...content, cards: [...(content.cards || []), { number: `0${(content.cards || []).length + 1}`, title: 'Service Name', description: 'Description', btnText: 'Explore', btnLink: '/services' }] })} style={addBtnStyle}>+ Add Card</button>
                    </div>

                    {(content.cards || []).map((card: any, cIdx: number) => (
                      <div key={cIdx} style={cardContainerStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Number</label>
                            <input type="text" value={card.number || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].number = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Title</label>
                            <input type="text" value={card.title || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].title = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Button Text / Link</label>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <input type="text" placeholder="Text" value={card.btnText || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].btnText = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                              <input type="text" placeholder="Link" value={card.btnLink || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].btnLink = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Description</label>
                          <textarea rows={2} value={card.description || ''} onChange={(e) => { const cs = [...content.cards]; cs[cIdx].description = e.target.value; setContent({ ...content, cards: cs }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. PROCESS STEPS */}
                {blockType === 'ProcessStepsBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <h4 style={{ margin: '15px 0 10px', fontSize: '14px', fontWeight: 700 }}>Steps</h4>
                    {(content.steps || []).map((step: any, stIdx: number) => (
                      <div key={stIdx} style={cardContainerStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Step</label>
                            <input type="text" value={step.step || ''} onChange={(e) => { const sts = [...content.steps]; sts[stIdx].step = e.target.value; setContent({ ...content, steps: sts }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Step Title</label>
                            <input type="text" value={step.title || ''} onChange={(e) => { const sts = [...content.steps]; sts[stIdx].title = e.target.value; setContent({ ...content, steps: sts }); }} style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Description</label>
                          <textarea rows={2} value={step.description || ''} onChange={(e) => { const sts = [...content.steps]; sts[stIdx].description = e.target.value; setContent({ ...content, steps: sts }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 10. FAQ ACCORDION */}
                {blockType === 'FaqAccordionBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0 10px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>FAQ Items ({(content.faqs || []).length})</h4>
                      <button type="button" onClick={() => setContent({ ...content, faqs: [...(content.faqs || []), { question: 'New Question?', answer: 'Answer text.' }] })} style={addBtnStyle}>+ Add FAQ</button>
                    </div>

                    {(content.faqs || []).map((faq: any, fIdx: number) => (
                      <div key={fIdx} style={cardContainerStyle}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={fieldLabelStyle}>Question</label>
                          <input type="text" value={faq.question || ''} onChange={(e) => { const fqs = [...content.faqs]; fqs[fIdx].question = e.target.value; setContent({ ...content, faqs: fqs }); }} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Answer</label>
                          <textarea rows={2} value={faq.answer || ''} onChange={(e) => { const fqs = [...content.faqs]; fqs[fIdx].answer = e.target.value; setContent({ ...content, faqs: fqs }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 11. PRICING MATRIX */}
                {blockType === 'PricingMatrixBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <h4 style={{ margin: '15px 0 10px', fontSize: '14px', fontWeight: 700 }}>Pricing Plans ({(content.plans || []).length})</h4>
                    {(content.plans || []).map((plan: any, pIdx: number) => (
                      <div key={pIdx} style={cardContainerStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Plan Name</label>
                            <input type="text" value={plan.name || ''} onChange={(e) => { const ps = [...content.plans]; ps[pIdx].name = e.target.value; setContent({ ...content, plans: ps }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Price</label>
                            <input type="text" value={plan.price || ''} onChange={(e) => { const ps = [...content.plans]; ps[pIdx].price = e.target.value; setContent({ ...content, plans: ps }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Period</label>
                            <input type="text" value={plan.period || ''} onChange={(e) => { const ps = [...content.plans]; ps[pIdx].period = e.target.value; setContent({ ...content, plans: ps }); }} placeholder="e.g. month" style={inputStyle} />
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={fieldLabelStyle}>Features (Comma-separated)</label>
                          <input type="text" value={(plan.features || []).join(', ')} onChange={(e) => { const ps = [...content.plans]; ps[pIdx].features = e.target.value.split(',').map((s) => s.trim()); setContent({ ...content, plans: ps }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 12. TESTIMONIALS CAROUSEL */}
                {blockType === 'TestimonialsCarouselBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <h4 style={{ margin: '15px 0 10px', fontSize: '14px', fontWeight: 700 }}>Testimonials ({(content.items || []).length})</h4>
                    {(content.items || []).map((item: any, iIdx: number) => (
                      <div key={iIdx} style={cardContainerStyle}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={fieldLabelStyle}>Quote Text</label>
                          <textarea rows={2} value={item.quote || ''} onChange={(e) => { const its = [...content.items]; its[iIdx].quote = e.target.value; setContent({ ...content, items: its }); }} style={inputStyle} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={fieldLabelStyle}>Author</label>
                            <input type="text" value={item.author || ''} onChange={(e) => { const its = [...content.items]; its[iIdx].author = e.target.value; setContent({ ...content, items: its }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Role</label>
                            <input type="text" value={item.role || ''} onChange={(e) => { const its = [...content.items]; its[iIdx].role = e.target.value; setContent({ ...content, items: its }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Company</label>
                            <input type="text" value={item.company || ''} onChange={(e) => { const its = [...content.items]; its[iIdx].company = e.target.value; setContent({ ...content, items: its }); }} style={inputStyle} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 13. STATS COUNTER */}
                {blockType === 'StatsCounterBlock' && (
                  <div>
                    <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>Stats Items ({(content.stats || []).length})</h4>
                    {(content.stats || []).map((stat: any, stIdx: number) => (
                      <div key={stIdx} style={{ ...cardContainerStyle, display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label style={fieldLabelStyle}>Target Number</label>
                          <input type="text" value={stat.target || ''} onChange={(e) => { const sts = [...content.stats]; sts[stIdx].target = e.target.value; setContent({ ...content, stats: sts }); }} style={inputStyle} />
                        </div>
                        <div style={{ width: '80px' }}>
                          <label style={fieldLabelStyle}>Suffix</label>
                          <input type="text" value={stat.suffix || ''} onChange={(e) => { const sts = [...content.stats]; sts[stIdx].suffix = e.target.value; setContent({ ...content, stats: sts }); }} style={inputStyle} />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={fieldLabelStyle}>Label</label>
                          <input type="text" value={stat.label || ''} onChange={(e) => { const sts = [...content.stats]; sts[stIdx].label = e.target.value; setContent({ ...content, stats: sts }); }} style={inputStyle} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 14. CLIENT LOGOS */}
                {blockType === 'ClientLogosBlock' && (
                  <div>
                    <div style={formBoxStyle}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={fieldLabelStyle}>Subtitle</label>
                          <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={fieldLabelStyle}>Headline Title</label>
                          <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <h4 style={{ margin: '15px 0 10px', fontSize: '14px', fontWeight: 700 }}>Logos ({(content.logos || []).length})</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {(content.logos || []).map((logo: any, lIdx: number) => (
                        <div key={lIdx} style={cardContainerStyle}>
                          <div style={{ marginBottom: '6px' }}>
                            <label style={fieldLabelStyle}>Client Name</label>
                            <input type="text" value={logo.name || ''} onChange={(e) => { const lgs = [...content.logos]; lgs[lIdx].name = e.target.value; setContent({ ...content, logos: lgs }); }} style={inputStyle} />
                          </div>
                          <div>
                            <label style={fieldLabelStyle}>Logo Image URL</label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input type="text" value={logo.image || ''} onChange={(e) => { const lgs = [...content.logos]; lgs[lIdx].image = e.target.value; setContent({ ...content, logos: lgs }); }} style={{ ...inputStyle, flex: 1 }} />
                              <button type="button" onClick={() => pickImage((url) => { const lgs = [...content.logos]; lgs[lIdx].image = url; setContent({ ...content, logos: lgs }); })} style={imagePickerBtnStyle}>🖼 Pick</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 15. CTA BANNER */}
                {blockType === 'CtaBannerBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Theme Variant</label>
                        <select value={content.variant || 'light'} onChange={(e) => setContent({ ...content, variant: e.target.value })} style={inputStyle}>
                          <option value="light">Light (#F2F5F7)</option>
                          <option value="dark">Dark (#000000)</option>
                          <option value="image">Image Background</option>
                        </select>
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Subtitle</label>
                        <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Headline Title</label>
                        <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Button Text</label>
                        <input type="text" value={content.btnText || ''} onChange={(e) => setContent({ ...content, btnText: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Button Link</label>
                        <input type="text" value={content.btnLink || ''} onChange={(e) => setContent({ ...content, btnLink: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 16. WORDPRESS WYSIWYG RICH TEXT */}
                {blockType === 'RichTextBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={fieldLabelStyle}>Section Header Title (Optional)</label>
                      <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>WYSIWYG Visual Canvas</label>
                      <RichTextEditor value={content.htmlContent || ''} onChange={(html) => setContent({ ...content, htmlContent: html })} minHeight="260px" />
                    </div>
                  </div>
                )}

                {/* 17. CONTACT FORM */}
                {blockType === 'ContactFormBlock' && (
                  <div style={formBoxStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Subtitle</label>
                        <input type="text" value={content.subtitle || ''} onChange={(e) => setContent({ ...content, subtitle: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Title</label>
                        <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={fieldLabelStyle}>Phone</label>
                        <input type="text" value={content.phone || ''} onChange={(e) => setContent({ ...content, phone: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Email</label>
                        <input type="text" value={content.email || ''} onChange={(e) => setContent({ ...content, email: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Hours</label>
                        <input type="text" value={content.hours || ''} onChange={(e) => setContent({ ...content, hours: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={fieldLabelStyle}>Address</label>
                        <input type="text" value={content.address || ''} onChange={(e) => setContent({ ...content, address: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* FALLBACK FOR MODULAR & COMPARISON BLOCKS */}
                {['ModularFrameworkBlock', 'FeatureComparisonBlock', 'ProductCatalogBlock', 'PortfolioGridBlock'].includes(blockType) && (
                  <div style={formBoxStyle}>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      Configure structured fields below:
                    </p>
                    <textarea
                      rows={8}
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          setContent(JSON.parse(e.target.value));
                        } catch {}
                      }}
                      style={{ ...inputStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '14px 25px',
              borderTop: '1px solid #eaeaea',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="blockVisible"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="blockVisible" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Section Visible
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '8px 18px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 24px',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Apply Section Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Library Picker Modal */}
      {schemaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '85vh',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Select From 20 Section Design Schemas</h3>
              <button onClick={() => setSchemaModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
                {availableSchemas.map((schema) => (
                  <div
                    key={schema.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Visual Blueprint illustration */}
                    <div style={{ height: '110px', position: 'relative', overflow: 'hidden' }}>
                      <SectionWireframe blockType={schema.blockType} />
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          backgroundColor: 'rgba(15,23,42,0.85)',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {schema.category}
                      </span>
                    </div>

                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{schema.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ast-global-color-0)', fontWeight: 600, marginBottom: '6px' }}>
                        {schema.blockType}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4em', marginBottom: '12px', flex: 1 }}>
                        {schema.description || 'Flexible layout schema.'}
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewSchema(schema)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#0F172A',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          👁️ Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertSchema(schema)}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            backgroundColor: 'var(--ast-global-color-0)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ⚡ Insert Section
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', textAlign: 'right', background: '#fafafa' }}>
              <button onClick={() => setSchemaModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <SchemaPreviewModal
        isOpen={!!previewSchema}
        onClose={() => setPreviewSchema(null)}
        schema={previewSchema}
      />

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={(url) => {
          if (activeMediaTarget) {
            activeMediaTarget(url);
          }
        }}
      />
    </>
  );
}

const formBoxStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #eaeaea',
  borderRadius: '6px',
  padding: '20px',
};

const cardContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #eaeaea',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
};

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#555',
  marginBottom: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '13px',
  outline: 'none',
};

const addBtnStyle: React.CSSProperties = {
  padding: '5px 12px',
  backgroundColor: '#f5f5f5',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const deleteBtnStyle: React.CSSProperties = {
  padding: '3px 8px',
  backgroundColor: '#ffebee',
  color: '#c62828',
  border: 'none',
  borderRadius: '3px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
};

const imagePickerBtnStyle: React.CSSProperties = {
  padding: '7px 12px',
  backgroundColor: 'var(--ast-global-color-0)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};
