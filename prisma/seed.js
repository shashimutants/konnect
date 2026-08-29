const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Konnect Marketing CMS Database...');

  // 1. Create Super Admin User
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@konnectmarketingusa.com' },
    update: {},
    create: {
      email: 'admin@konnectmarketingusa.com',
      passwordHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('Created Super Admin User:', admin.email);

  // 2. Seed Global Site Settings
  const settings = [
    { key: 'site_name', value: 'Konnect Marketing USA', group: 'general' },
    { key: 'site_tagline', value: 'One partner. Every channel. Every state.', group: 'general' },
    { key: 'site_logo', value: '/images/logo.png', group: 'general' },
    { key: 'contact_phone', value: '929-242-6868', group: 'contact' },
    { key: 'contact_email', value: 'contact@konnectmarketingusa.com', group: 'contact' },
    { key: 'contact_hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM', group: 'contact' },
    { key: 'contact_address', value: 'New York, NY', group: 'contact' },
    { key: 'social_linkedin', value: 'https://linkedin.com', group: 'social' },
    { key: 'social_instagram', value: 'https://instagram.com', group: 'social' },
    { key: 'social_youtube', value: 'https://youtube.com', group: 'social' },
    {
      key: 'global_organization_schema',
      group: 'seo',
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MarketingAgency',
        name: 'Konnect Marketing USA',
        url: 'https://konnectmarketingusa.com',
        logo: 'https://konnectmarketingusa.com/images/logo.png',
        telephone: '929-242-6868',
        email: 'contact@konnectmarketingusa.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New York',
          addressRegion: 'NY',
          addressCountry: 'US',
        },
      }),
    },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }
  console.log('Seeded Global Site Settings.');

  // 3. Seed Menus
  const headerMenu = await prisma.menu.upsert({
    where: { locationSlug: 'header-main' },
    update: {},
    create: {
      name: 'Main Header Navigation',
      locationSlug: 'header-main',
    },
  });

  const headerItems = [
    { title: 'Home', url: '/', orderIndex: 0 },
    { title: 'About', url: '/about', orderIndex: 1 },
    { title: 'Services', url: '/services', orderIndex: 2 },
    { title: 'Products', url: '/products', orderIndex: 3 },
    { title: 'Portfolio', url: '/portfolio', orderIndex: 4 },
    { title: 'Contact', url: '/contact', orderIndex: 5 },
  ];

  await prisma.menuItem.deleteMany({ where: { menuId: headerMenu.id } });
  for (const item of headerItems) {
    await prisma.menuItem.create({
      data: {
        menuId: headerMenu.id,
        title: item.title,
        url: item.url,
        orderIndex: item.orderIndex,
      },
    });
  }

  // 4. Seed Core Pages & Dynamic Content Blocks

  // A. HOME PAGE
  const homePage = await prisma.page.upsert({
    where: { slug_language: { slug: 'home', language: 'en-US' } },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      isHome: true,
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'Konnect Marketing USA - Full-Spectrum Marketing & Infrastructure',
      seoDescription: 'Transforming how brands connect with audiences across digital, outdoor media, and commercial display hardware nationwide.',
      ogTitle: 'Konnect Marketing USA',
      ogDescription: 'One partner. Every channel. Every state.',
      ogImageUrl: '/images/bg-01-free-img.jpg',
      schemaType: 'WebPage',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: homePage.id } });

  const homeBlocks = [
    {
      blockType: 'HeroSliderBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        slides: [
          {
            badge: 'FULL-SPECTRUM MARKETING & INFRASTRUCTURE',
            title: 'Transforming How Brands Connect with Audiences.',
            subtitle: 'OUTDOOR & TRANSIT MEDIA • DIGITAL ADVERTISING • VIDEO WALLS • SIGNAGE INFRASTRUCTURE',
            ctaText: 'GET STARTED NOW',
            ctaLink: '/contact',
            showPlayBtn: true,
            bgImage: '/images/bg-01-free-img.jpg',
          },
          {
            badge: 'NATIONWIDE ADVERTISING & MEDIA PLANNING',
            title: 'High-Impact Outdoor & Transit Advertising.',
            subtitle: 'HIGHWAY BILLBOARDS • DIGITAL BILLBOARDS • BUS SHELTERS • TRANSIT HUBS',
            ctaText: 'EXPLORE MEDIA SITES',
            ctaLink: '/products',
            showPlayBtn: false,
            bgImage: '/images/bg-13-free-img.jpg',
          },
          {
            badge: 'DIGITAL SIGNAGE & VIDEO WALL INTEGRATION',
            title: 'Cutting-Edge Commercial Video Display Systems.',
            subtitle: 'INDOOR & OUTDOOR LED WALLS • INTERACTIVE KIOSKS • CLOUD CMS CONTROL',
            ctaText: 'VIEW PRODUCTS',
            ctaLink: '/products',
            showPlayBtn: false,
            bgImage: '/images/bg-15-free-img.jpg',
          },
        ],
      }),
    },
    {
      blockType: 'CapabilitiesGridBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        subtitle: 'Our Core Capabilities',
        title: 'Six Channels. One Accountable Partner.',
        cards: [
          {
            number: '01',
            title: 'Digital Marketing & Demand Gen',
            description: 'Paid search, paid social, SEO, and programmatic display tied directly to campaign flights and geographic targets.',
            btnText: 'Explore Digital',
            btnLink: '/services',
          },
          {
            number: '02',
            title: 'Outdoor & Transit Advertising',
            description: 'Static & digital billboards, bus shelters, transit wraps, airport displays, and railway networks nationwide.',
            btnText: 'Explore Outdoor',
            btnLink: '/services',
          },
          {
            number: '03',
            title: 'Video Display & Digital Signage',
            description: 'Turnkey LED video walls, interactive touchscreen kiosks, projection systems, and centralized cloud CMS.',
            btnText: 'Explore Displays',
            btnLink: '/products',
          },
          {
            number: '04',
            title: 'Interactive Environments & Motion',
            description: 'Multi-touch directories, wayfinding kiosks, motion-activated brand experiences, and smart installations.',
            btnText: 'Explore Interactive',
            btnLink: '/services',
          },
          {
            number: '05',
            title: 'Creative, Video & Motion Content',
            description: 'Brand films, 3D motion graphics, commercial videos, ad creatives, and screen-specific optimized content.',
            btnText: 'Explore Creative',
            btnLink: '/services',
          },
          {
            number: '06',
            title: 'Lighting, Audio & Experiential AV',
            description: 'Architectural lighting, commercial audio systems, stage production, trade show booths, and live activations.',
            btnText: 'Explore Events',
            btnLink: '/services',
          },
        ],
      }),
    },
    {
      blockType: 'TwoColumnStoryBlock',
      orderIndex: 2,
      contentJson: JSON.stringify({
        subtitle: 'About Konnect Marketing',
        title: 'We Bridge Physical Infrastructure with Digital Performance.',
        paragraphs: [
          'Konnect Marketing USA was founded on a simple premise: modern brands shouldn\'t have to juggle five different vendors to run a unified campaign.',
          'We engineer and install commercial display hardware, secure municipal billboard permits, produce cinematic video content, and run targeted digital demand generation campaigns with live attribution.',
        ],
        btnText: 'Learn More About Us',
        btnLink: '/about',
        sideType: 'image',
        sideContent: '/images/about-02-free-img.png',
      }),
    },
    {
      blockType: 'ModularFrameworkBlock',
      orderIndex: 3,
      contentJson: JSON.stringify({
        subtitle: 'Modular Engagement Framework',
        title: 'Start Regional. Scale National.',
        introText: 'You don\'t need a multi-million-dollar national commitment on day one. Our modular engagement framework allows enterprise brands to test, prove ROI in regional markets, and seamlessly expand.',
        steps: [
          {
            stepNum: 'PHASE 01',
            title: 'Regional Pilot & Proof',
            description: 'Deploy targeted outdoor media, digital ads, and branch displays in 1–3 focus metro markets to establish baseline ROI.',
          },
          {
            stepNum: 'PHASE 02',
            title: 'Corridor Expansion',
            description: 'Scale media inventory along primary transit corridors, retail footprints, and regional airports with continuous live reporting.',
          },
          {
            stepNum: 'PHASE 03',
            title: 'National Dominance',
            description: 'Synchronize nationwide billboard flights, hundreds of digital screens, experiential event activations, and centralized CMS.',
          },
        ],
        quoteText: 'Konnect Marketing delivers the creative ambition of a Madison Avenue agency with the logistical precision of an industrial infrastructure partner.',
        ctaText: 'Start Your Regional Pilot',
        ctaLink: '/contact',
      }),
    },
    {
      blockType: 'StatsCounterBlock',
      orderIndex: 4,
      contentJson: JSON.stringify({
        stats: [
          { target: '50', suffix: '', label: 'States Covered' },
          { target: '500', suffix: '+', label: 'Displays & Screens Managed' },
          { target: '2.5', suffix: 'M+', label: 'Monthly Campaign Impressions' },
          { target: '94', suffix: '%', label: 'Client Retention Rate' },
        ],
      }),
    },
    {
      blockType: 'PortfolioGridBlock',
      orderIndex: 5,
      contentJson: JSON.stringify({
        items: [
          { category: 'DOOH Media', title: 'Times Square Digital Tower', image: '/images/portfolio-0001-free-img.jpg', link: '/portfolio' },
          { category: 'Commercial LED', title: 'Flagship Store Video Wall', image: '/images/portfolio-00002-free-img.jpg', link: '/portfolio' },
          { category: 'Transit Advertising', title: 'Metro Transit System Wrap', image: '/images/portfolio-0003-free-img.jpg', link: '/portfolio' },
          { category: 'Events & Lighting', title: 'Architectural Lighting Showcase', image: '/images/portfolio-0004-free-img.jpg', link: '/portfolio' },
          { category: 'Interactive AV', title: 'Touchscreen Directory Kiosks', image: '/images/portfolio-0005-free-img.jpg', link: '/portfolio' },
          { category: 'Billboards', title: 'Highway 101 Static Billboard', image: '/images/portfolio-0006-free-img.jpg', link: '/portfolio' },
          { category: 'Signage', title: 'Airport Terminal Signage Network', image: '/images/portfolio-0007-free-img.jpg', link: '/portfolio' },
          { category: 'Experiential', title: 'Interactive Product Display Hub', image: '/images/portfolio-0008-free-img.jpg', link: '/portfolio' },
        ],
      }),
    },
    {
      blockType: 'ClientLogosBlock',
      orderIndex: 6,
      contentJson: JSON.stringify({
        subtitle: 'A True Partnership',
        title: 'Trusted by High-Growth and Enterprise Brands Nationwide',
        logos: [
          { name: 'Client 1', image: '/images/logo-1.png' },
          { name: 'Client 2', image: '/images/logo-2.png' },
          { name: 'Client 3', image: '/images/logo-3.png' },
          { name: 'Client 5', image: '/images/logo-5.png' },
          { name: 'Client 6', image: '/images/logo-6.png' },
          { name: 'Client 7', image: '/images/logo-7.png' },
          { name: 'Client 8', image: '/images/logo-8.png' },
          { name: 'Client 9', image: '/images/logo-9.png' },
        ],
      }),
    },
    {
      blockType: 'CtaBannerBlock',
      orderIndex: 7,
      contentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Vision & Partnership',
        title: 'Ready to scale your brand across digital channels and physical infrastructure?',
        btnText: 'Start a Conversation',
        btnLink: '/contact',
      }),
    },
  ];

  for (const b of homeBlocks) {
    await prisma.contentBlock.create({
      data: {
        pageId: homePage.id,
        blockType: b.blockType,
        orderIndex: b.orderIndex,
        contentJson: b.contentJson,
        isVisible: true,
      },
    });
  }
  console.log('Seeded Home Page with 8 Dynamic Blocks.');

  // B. ABOUT PAGE
  const aboutPage = await prisma.page.upsert({
    where: { slug_language: { slug: 'about', language: 'en-US' } },
    update: {},
    create: {
      title: 'About',
      slug: 'about',
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'About Us - Konnect Marketing USA',
      seoDescription: 'Learn about Konnect Marketing USA: our vision, leadership team, national multi-channel capabilities, and company history.',
      ogTitle: 'About - Konnect Marketing USA',
      ogDescription: 'One partner. Every channel. Every state.',
      ogImageUrl: '/images/about-001-free-img.jpg',
      schemaType: 'AboutPage',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: aboutPage.id } });

  const aboutBlocks = [
    {
      blockType: 'PageHeroBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        subtitle: 'Agency & Infrastructure Overview',
        title: 'About Us',
        description: 'Blending digital demand generation with outdoor media, interactive hardware, and experiential production under one accountable partner nationwide.',
        bgImage: '/images/bg-14-free-img.jpg',
      }),
    },
    {
      blockType: 'TwoColumnStoryBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        subtitle: 'Who We Are',
        title: 'One Partner. Every Channel. Every State.',
        paragraphs: [
          'Konnect Marketing was built to solve the fragmentation of modern brand growth. Traditional agencies manage ads in isolation from outdoor signage, while hardware vendors operate disconnected from conversion tracking.',
          'We unite digital performance marketing, commercial display infrastructure, and experiential event production under a single contract with unified attribution.',
        ],
        sideType: 'image',
        sideContent: '/images/about-001-free-img.jpg',
      }),
    },
    {
      blockType: 'CapabilitiesGridBlock',
      orderIndex: 2,
      contentJson: JSON.stringify({
        subtitle: 'Our Advantage',
        title: 'Why Leading Brands Choose Konnect',
        cards: [
          {
            number: '01',
            title: 'Omnichannel Integration',
            description: 'We tie paid digital search, paid social, and programmatic display directly to physical billboard flights and in-branch signage.',
            btnText: 'Explore Channels',
            btnLink: '/services',
          },
          {
            number: '02',
            title: 'Turnkey Hardware & Permits',
            description: 'From zoning approval and structural engineering to LED screen installation and DMX lighting, we manage every phase in-house.',
            btnText: 'Explore Hardware',
            btnLink: '/products',
          },
          {
            number: '03',
            title: 'Measurable Geo-Attribution',
            description: 'Every billboard, bus shelter, and interactive display is wrapped with geo-fencing to measure foot-traffic lift and online conversion lift.',
            btnText: 'View Analytics',
            btnLink: '/services',
          },
        ],
      }),
    },
    {
      blockType: 'ModularFrameworkBlock',
      orderIndex: 3,
      contentJson: JSON.stringify({
        subtitle: 'Our Scalable Model',
        title: 'Start Regional. Scale National.',
        introText: 'You don\'t need a multi-million-dollar national commitment on day one. Our modular framework allows enterprise brands to test, prove ROI in regional target markets, and seamlessly expand.',
        steps: [
          { stepNum: 'PHASE 01', title: 'Regional Pilot & Proof', description: 'Deploy targeted outdoor media, digital ads, and branch displays in 1–3 focus metro markets.' },
          { stepNum: 'PHASE 02', title: 'Corridor Expansion', description: 'Scale media inventory along primary transit corridors, retail footprints, and regional airports.' },
          { stepNum: 'PHASE 03', title: 'National Dominance', description: 'Synchronize nationwide billboard flights, hundreds of digital screens, and centralized CMS.' },
        ],
        quoteText: 'Konnect Marketing delivers the creative ambition of a Madison Avenue agency with the logistical precision of an industrial infrastructure partner.',
        ctaText: 'Start Your Regional Pilot',
        ctaLink: '/contact',
      }),
    },
    {
      blockType: 'StatsCounterBlock',
      orderIndex: 4,
      contentJson: JSON.stringify({
        stats: [
          { target: '50', suffix: '', label: 'States Covered' },
          { target: '500', suffix: '+', label: 'Displays & Screens Managed' },
          { target: '2.5', suffix: 'M+', label: 'Monthly Campaign Impressions' },
          { target: '94', suffix: '%', label: 'Client Retention Rate' },
        ],
      }),
    },
    {
      blockType: 'ClientLogosBlock',
      orderIndex: 5,
      contentJson: JSON.stringify({
        subtitle: 'Trusted Partnerships',
        title: 'Powering Brands Across the Nation',
        logos: [
          { name: 'Client 1', image: '/images/logo-1.png' },
          { name: 'Client 2', image: '/images/logo-2.png' },
          { name: 'Client 3', image: '/images/logo-3.png' },
          { name: 'Client 5', image: '/images/logo-5.png' },
          { name: 'Client 6', image: '/images/logo-6.png' },
          { name: 'Client 7', image: '/images/logo-7.png' },
          { name: 'Client 8', image: '/images/logo-8.png' },
          { name: 'Client 9', image: '/images/logo-9.png' },
        ],
      }),
    },
    {
      blockType: 'CtaBannerBlock',
      orderIndex: 6,
      contentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Vision & Partnership',
        title: 'Ready to unify your digital campaigns, outdoor media, and display hardware?',
        btnText: 'Schedule a Consultation',
        btnLink: '/contact',
      }),
    },
  ];

  for (const b of aboutBlocks) {
    await prisma.contentBlock.create({
      data: {
        pageId: aboutPage.id,
        blockType: b.blockType,
        orderIndex: b.orderIndex,
        contentJson: b.contentJson,
        isVisible: true,
      },
    });
  }
  console.log('Seeded About Page with 7 Dynamic Blocks.');

  // C. SERVICES PAGE
  const servicesPage = await prisma.page.upsert({
    where: { slug_language: { slug: 'services', language: 'en-US' } },
    update: {},
    create: {
      title: 'Services',
      slug: 'services',
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'Our Capabilities & Services - Konnect Marketing USA',
      seoDescription: 'Full-spectrum multi-channel agency services: digital performance marketing, outdoor media, video walls, and AV production.',
      ogTitle: 'Capabilities & Services - Konnect Marketing USA',
      ogDescription: 'Six channels. One accountable partner.',
      ogImageUrl: '/images/bg-08-free-img.jpg',
      schemaType: 'Service',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: servicesPage.id } });

  const servicesBlocks = [
    {
      blockType: 'PageHeroBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        subtitle: 'Integrated Marketing & Production',
        title: 'Our Capabilities',
        description: 'Six unified channels executed under one contract — from digital demand generation and outdoor media to commercial video walls and experiential events.',
        bgImage: '/images/bg-08-free-img.jpg',
      }),
    },
    {
      blockType: 'TwoColumnStoryBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        subtitle: 'Unified Strategy',
        title: 'Six Channels. One Accountable Partner.',
        paragraphs: [
          'When brands expand, managing separate vendors for digital ads, billboard media, signage hardware, and video creative causes friction, missed deadlines, and disjointed attribution.',
          'Konnect Marketing synchronizes all physical and digital channels to reinforce each other — wrapping every billboard and branch installation with geo-targeted search, paid social, and live conversion analytics.',
        ],
        sideType: 'checklist',
        sideContent: JSON.stringify([
          'Zero Vendor Switching as You Scale',
          'Geo-Fenced Attribution on Every Screen',
          'Full Permitting, Hardware & Engineering',
          'Centralized Real-Time Dashboard Reporting',
        ]),
      }),
    },
    {
      blockType: 'CapabilitiesGridBlock',
      orderIndex: 2,
      contentJson: JSON.stringify({
        subtitle: 'Full Service Suite',
        title: 'End-to-End Channel Execution',
        cards: [
          {
            number: '01',
            title: 'Digital Marketing & Demand Gen',
            description: 'Paid search (Google/Bing Ads), paid social (Meta, LinkedIn, TikTok), SEO, and programmatic display tied directly to flight windows.',
            features: ['Paid Search & Paid Social', 'Omnichannel Retargeting', 'Geo-Targeted Mobile Ads'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
          {
            number: '02',
            title: 'Outdoor & Transit Advertising',
            description: 'Static and digital billboards, bus wraps, transit shelter panels, airport media, and railway concourse displays with permitting.',
            features: ['High-Traffic DOOH Billboards', 'Bus, Train & Shelter Panels', 'Airport & Highway Concourse'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
          {
            number: '03',
            title: 'Video Display & Digital Signage',
            description: 'Indoor fine-pitch and outdoor high-bright LED video walls, commercial LCD signage, and multi-location cloud CMS distribution.',
            features: ['Turnkey LED Wall Installation', 'Central Cloud Content Control', 'Multi-Branch Sync & Schedules'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
          {
            number: '04',
            title: 'Interactive Environments & Motion',
            description: 'Multi-touch touchscreen kiosks, sensor-based interactive displays, wayfinding software, and custom screen applications.',
            features: ['Capacitive Touch Wayfinding', 'Custom Interactive Apps', 'Audience Sensor Analytics'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
          {
            number: '05',
            title: 'Creative, Video & Motion Content',
            description: 'Broadcast commercial films, 3D motion graphics, brand documentaries, explainer videos, and screen-ratio customized ad creatives.',
            features: ['3D Motion & CGI Animation', 'Brand & Corporate Films', 'Custom Screen Format Cuts'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
          {
            number: '06',
            title: 'Lighting, Audio & Events',
            description: 'Architectural facade lighting, multi-zone distributed audio, trade show booth production, and executive presentation AV support.',
            features: ['DMX Architectural Facades', 'Zoned Commercial Sound', 'Trade Show & Expo Production'],
            btnText: 'Request Proposal',
            btnLink: '/contact',
          },
        ],
      }),
    },
    {
      blockType: 'CtaBannerBlock',
      orderIndex: 3,
      contentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Vision & Partnership',
        title: 'Ready to launch a synchronized multi-channel campaign in your target markets?',
        btnText: 'Get a Custom Proposal',
        btnLink: '/contact',
      }),
    },
  ];

  for (const b of servicesBlocks) {
    await prisma.contentBlock.create({
      data: {
        pageId: servicesPage.id,
        blockType: b.blockType,
        orderIndex: b.orderIndex,
        contentJson: b.contentJson,
        isVisible: true,
      },
    });
  }
  console.log('Seeded Services Page.');

  // D. PRODUCTS PAGE
  const productsPage = await prisma.page.upsert({
    where: { slug_language: { slug: 'products', language: 'en-US' } },
    update: {},
    create: {
      title: 'Products & Hardware',
      slug: 'products',
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'Products & Hardware Solutions - Konnect Marketing USA',
      seoDescription: 'Commercial LED video walls, digital billboard hardware, transit shelters, and interactive touch kiosks.',
      ogTitle: 'Hardware & Products - Konnect Marketing USA',
      ogDescription: 'Enterprise display hardware engineered for 24/7 reliability.',
      ogImageUrl: '/images/portfolio-0001-free-img.jpg',
      schemaType: 'Product',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: productsPage.id } });

  const productsBlocks = [
    {
      blockType: 'PageHeroBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        subtitle: 'Commercial Hardware & Infrastructure',
        title: 'Products & Solutions',
        description: 'Enterprise-grade outdoor digital billboards, commercial LED video walls, transit shelters, and interactive kiosk systems.',
        bgImage: '/images/bg-13-free-img.jpg',
      }),
    },
    {
      blockType: 'ProductCatalogBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        specsStrip: [
          { title: '24/7 Industrial Rating', description: 'Commercial-grade diodes, redundant power supplies, and active cooling.' },
          { title: 'IP67 Weather Sealed', description: 'All-weather outdoor enclosures engineered for extreme climates.' },
          { title: 'Centralized Cloud CMS', description: 'Remote diagnostic monitoring, proof-of-play logs, and instant scheduling.' },
          { title: 'Nationwide SLA', description: 'Certified field engineering teams providing 48-hour on-site resolution.' },
        ],
        categories: [
          {
            categoryNum: 'Category 01',
            title: 'Outdoor & Transit Media Hardware',
            description: 'Engineered for high-traffic highway corridors and urban transit hubs.',
            isDark: false,
            products: [
              {
                badge: 'DOOH Billboard',
                title: 'Digital LED Billboards',
                description: 'Ultra-high-bright 8,500+ nit SMD & DIP LED billboard displays with automatic ambient light dimming.',
                features: ['P6, P8, P10 Pixel Pitch Options', '8,500+ Nits Brightness Output', 'Front & Rear Serviceable Modules'],
                image: '/images/portfolio-0001-free-img.jpg',
              },
              {
                badge: 'Static Media',
                title: 'Static & Trivision Billboards',
                description: 'Heavy-gauge steel unipole and cantilever structures engineered to municipal wind-load tolerances.',
                features: ['Standard 14x48 & 10x30 Formats', 'High-Intensity LED Downlighting', 'Corrosion-Resistant Zinc Coating'],
                image: '/images/portfolio-0006-free-img.jpg',
              },
              {
                badge: 'Transit Media',
                title: 'Bus Shelter & Transit Enclosures',
                description: 'Custom fabricated stainless steel and tempered glass transit shelters equipped with illuminated poster panels.',
                features: ['Vandal-Resistant 10mm Polycarbonate', 'Integrated Solar Power Option', 'Optional 55" Sunlight-Readable Screen'],
                image: '/images/portfolio-0003-free-img.jpg',
              },
            ],
          },
          {
            categoryNum: 'Category 02',
            title: 'LED Video Walls & Display Systems',
            description: 'Fine-pitch interior and high-impact exterior architectural display systems.',
            isDark: true,
            products: [
              {
                badge: 'Fine Pitch LED',
                title: 'Indoor Commercial LED Walls',
                description: 'Bezel-free, seamless ultra-fine pixel pitch video walls for corporate lobbies, boardrooms, and command centers.',
                features: ['P1.2, P1.5, P1.8 Ultra-Fine Pitch', 'HDR10+ Color Calibration', 'Die-Cast Aluminum Cabinet Design'],
                image: '/images/portfolio-00002-free-img.jpg',
              },
              {
                badge: 'Curved LED',
                title: 'Curved & Flexible LED Facades',
                description: 'Custom-radius concave and convex LED panel configurations engineered for cylindrical columns and architectural corners.',
                features: ['Up to 90° Seamless Corner Modules', 'Custom Concave / Convex Curvature', 'Lightweight Modular Lock System'],
                image: '/images/bg-01-free-img.jpg',
              },
              {
                badge: 'Glass LED',
                title: 'Transparent Glass LED Panels',
                description: 'See-through LED mesh panels delivering up to 75% optical transparency for retail storefronts.',
                features: ['75% Optical Transparency', '5,500 Nits Daylight Visibility', 'Minimal Structural Load Design'],
                image: '/images/portfolio-0007-free-img.jpg',
              },
            ],
          },
        ],
      }),
    },
    {
      blockType: 'CtaBannerBlock',
      orderIndex: 2,
      contentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Custom Engineering & Nationwide Deployment',
        title: 'Need custom hardware specifications, site surveys, or an RFP quote for your rollout?',
        btnText: 'Request Hardware Quote',
        btnLink: '/contact',
      }),
    },
  ];

  for (const b of productsBlocks) {
    await prisma.contentBlock.create({
      data: {
        pageId: productsPage.id,
        blockType: b.blockType,
        orderIndex: b.orderIndex,
        contentJson: b.contentJson,
        isVisible: true,
      },
    });
  }
  console.log('Seeded Products Page.');

  // E. PORTFOLIO & CONTACT PAGES
  const portfolioPage = await prisma.page.upsert({
    where: { slug_language: { slug: 'portfolio', language: 'en-US' } },
    update: {},
    create: {
      title: 'Portfolio',
      slug: 'portfolio',
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'Portfolio & Case Studies - Konnect Marketing USA',
      seoDescription: 'Explore our latest billboard flights, commercial LED installations, and experiential brand activations.',
      ogTitle: 'Portfolio - Konnect Marketing USA',
      ogDescription: 'Proven results across outdoor media and display hardware.',
      ogImageUrl: '/images/portfolio-0001-free-img.jpg',
      schemaType: 'WebPage',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: portfolioPage.id } });

  await prisma.contentBlock.create({
    data: {
      pageId: portfolioPage.id,
      blockType: 'PageHeroBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        subtitle: 'Featured Work & Installations',
        title: 'Our Portfolio',
        description: 'Explore a selection of our nationwide campaigns, digital billboard networks, and custom video wall installations.',
        bgImage: '/images/bg-15-free-img.jpg',
      }),
    },
  });

  await prisma.contentBlock.create({
    data: {
      pageId: portfolioPage.id,
      blockType: 'PortfolioGridBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        items: [
          { category: 'DOOH Media', title: 'Times Square Digital Tower', image: '/images/portfolio-0001-free-img.jpg', link: '/portfolio' },
          { category: 'Commercial LED', title: 'Flagship Store Video Wall', image: '/images/portfolio-00002-free-img.jpg', link: '/portfolio' },
          { category: 'Transit Advertising', title: 'Metro Transit System Wrap', image: '/images/portfolio-0003-free-img.jpg', link: '/portfolio' },
          { category: 'Events & Lighting', title: 'Architectural Lighting Showcase', image: '/images/portfolio-0004-free-img.jpg', link: '/portfolio' },
          { category: 'Interactive AV', title: 'Touchscreen Directory Kiosks', image: '/images/portfolio-0005-free-img.jpg', link: '/portfolio' },
          { category: 'Billboards', title: 'Highway 101 Static Billboard', image: '/images/portfolio-0006-free-img.jpg', link: '/portfolio' },
          { category: 'Signage', title: 'Airport Terminal Signage Network', image: '/images/portfolio-0007-free-img.jpg', link: '/portfolio' },
          { category: 'Experiential', title: 'Interactive Product Display Hub', image: '/images/portfolio-0008-free-img.jpg', link: '/portfolio' },
        ],
      }),
    },
  });

  await prisma.contentBlock.create({
    data: {
      pageId: portfolioPage.id,
      blockType: 'CtaBannerBlock',
      orderIndex: 2,
      contentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Vision & Partnership',
        title: 'Ready to launch your next high-impact campaign?',
        btnText: 'Start Your Campaign',
        btnLink: '/contact',
      }),
    },
  });
  console.log('Seeded Portfolio Page.');

  const contactPage = await prisma.page.upsert({
    where: { slug_language: { slug: 'contact', language: 'en-US' } },
    update: {},
    create: {
      title: 'Contact',
      slug: 'contact',
      status: 'PUBLISHED',
      language: 'en-US',
      seoTitle: 'Contact Us - Konnect Marketing USA',
      seoDescription: 'Get in touch with Konnect Marketing USA for hardware quotes, media planning, and campaign proposals.',
      ogTitle: 'Contact Konnect Marketing USA',
      ogDescription: 'One partner. Every channel. Every state.',
      ogImageUrl: '/images/bg-14-free-img.jpg',
      schemaType: 'ContactPage',
      publishedAt: new Date(),
    },
  });

  await prisma.contentBlock.deleteMany({ where: { pageId: contactPage.id } });

  await prisma.contentBlock.create({
    data: {
      pageId: contactPage.id,
      blockType: 'PageHeroBlock',
      orderIndex: 0,
      contentJson: JSON.stringify({
        subtitle: 'Let\'s Connect',
        title: 'Contact Us',
        description: 'Whether you need a custom hardware quote, billboard availability, or a full omnichannel proposal, our team is ready.',
        bgImage: '/images/bg-14-free-img.jpg',
      }),
    },
  });

  await prisma.contentBlock.create({
    data: {
      pageId: contactPage.id,
      blockType: 'ContactFormBlock',
      orderIndex: 1,
      contentJson: JSON.stringify({
        title: 'Get In Touch',
        subtitle: 'Our Team Is Available 24/7',
        phone: '929-242-6868',
        email: 'contact@konnectmarketingusa.com',
        hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
        address: 'New York, NY',
      }),
    },
  });

  console.log('Seeded Contact Page.');

  // 6. Seed 20 Section Design Schemas
  console.log('Seeding 20 Reusable Section Design Schemas...');
  const sectionTemplates = [
    {
      name: 'Hero - Multi-Slide Rotating Banner',
      category: 'Heroes',
      description: 'Rotating multi-slide hero banner with custom badges, headlines, dual CTAs, and background imagery.',
      blockType: 'HeroSliderBlock',
      thumbnailUrl: '/images/bg-01-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
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
      }),
    },
    {
      name: 'Hero - Classic Inner Page Header',
      category: 'Heroes',
      description: 'Clean inner page header with category subtitle, page title, overview paragraph, and background backdrop.',
      blockType: 'PageHeroBlock',
      thumbnailUrl: '/images/bg-14-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Enterprise Solutions',
        title: 'Next-Gen Media & Hardware',
        description: 'Comprehensive nationwide advertising infrastructure and digital display systems.',
        bgImage: '/images/bg-14-free-img.jpg',
      }),
    },
    {
      name: 'Hero - 50/50 Split Showcase',
      category: 'Heroes',
      description: 'Modern split layout with headline, dual CTA action buttons, and floating highlight card over media.',
      blockType: 'SplitHeroBlock',
      thumbnailUrl: '/images/about-001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        badge: 'Enterprise Performance',
        title: 'Architecting National Brand Presence',
        subtitle: 'Uniting high-traffic outdoor billboard inventory and digital performance marketing under one seamless team.',
        primaryBtnText: 'Launch Campaign',
        primaryBtnLink: '/contact',
        secondaryBtnText: 'Explore Capabilities',
        secondaryBtnLink: '/services',
        image: '/images/about-001-free-img.jpg',
        highlightText: '50 States Nationwide Coverage',
      }),
    },
    {
      name: 'Hero - Cinematic Video Showcase',
      category: 'Heroes',
      description: 'Full-bleed high-impact video banner with dark overlay, centered typography, and prominent CTA.',
      blockType: 'VideoHeroBlock',
      thumbnailUrl: '/images/bg-01-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'zoom-in', duration: 'slow', delay: 0 }),
      defaultContentJson: JSON.stringify({
        badge: 'High Impact Media',
        title: 'Where Creative Scale Meets Precision Delivery',
        subtitle: 'Transform urban skylines and commercial venues with iconic high-bright display engineering.',
        posterImage: '/images/bg-01-free-img.jpg',
        ctaText: 'View Our Portfolio',
        ctaLink: '/portfolio',
      }),
    },
    {
      name: 'Narrative - 2-Column Story with Image',
      category: 'Narrative',
      description: 'Editorial 2-column narrative with headline, custom paragraphs, CTA button, and right-side image.',
      blockType: 'TwoColumnStoryBlock',
      thumbnailUrl: '/images/about-001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 100 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Our Strategic Narrative',
        title: 'One Partner. Every Channel. Every State.',
        paragraphs: [
          'Founded to eliminate the fragmentation between creative agencies and media buyers, Konnect Marketing operates as a unified growth engine.',
          'We engineer campaigns that bridge physical real-world attention with real-time digital attribution.',
        ],
        btnText: 'Learn About Our Methodology',
        btnLink: '/about',
        sideType: 'image',
        sideContent: '/images/about-001-free-img.jpg',
      }),
    },
    {
      name: 'Narrative - 3-Column Feature Cards',
      category: 'Narrative',
      description: 'Clean 3-column container with emoji/icon highlights, structured descriptions, and inline explore links.',
      blockType: 'ThreeColumnCardsBlock',
      thumbnailUrl: '/images/portfolio-00002-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Core Pillars',
        title: 'Built For Enterprise Reliability',
        intro: 'Engineered from the ground up to deliver uncompromising media performance.',
        cards: [
          { icon: '🚀', title: 'High-Traffic Inventory', description: 'Exclusive highway billboard placements and metro transit concourses.', linkText: 'Explore Media', linkUrl: '/services' },
          { icon: '⚡', title: 'Commercial Hardware', description: 'Tier-1 SMD diodes and high-refresh video walls designed for 24/7 runtimes.', linkText: 'View Specs', linkUrl: '/products' },
          { icon: '📊', title: 'Attribution Tracking', description: 'Foot-traffic lift metrics and geo-fenced mobile cross-channel retargeting.', linkText: 'See Analytics', linkUrl: '/services' },
        ],
      }),
    },
    {
      name: 'Narrative - Gutenberg Rich Text Block',
      category: 'Narrative',
      description: 'WordPress-style freeform WYSIWYG rich text block supporting headings, bullet lists, blockquotes, and images.',
      blockType: 'RichTextBlock',
      thumbnailUrl: '/images/bg-14-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        title: 'Editorial Insights & Technical Specifications',
        htmlContent: '<p>Our engineering team works directly with architects, municipal planners, and commercial developers to ensure all hardware installations meet strict safety and visual compliance standards.</p><h3>Key Hardware Highlights</h3><ul><li>Ultra-wide viewing angles (160° Horizontal / 140° Vertical)</li><li>Custom front-service access modules for zero-downtime maintenance</li></ul>',
      }),
    },
    {
      name: 'Narrative - Editorial Pull-Quote Highlight',
      category: 'Narrative',
      description: 'High-impact statement pull-quote block with author attribution and corporate metadata.',
      blockType: 'BlockquoteHighlightBlock',
      thumbnailUrl: '/images/about-001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        quote: 'Konnect Marketing transformed how our retail brand engages metropolitan foot-traffic with unprecedented visual clarity.',
        authorName: 'Marcus Vance',
        authorTitle: 'Chief Marketing Officer',
        company: 'Apex Retail Group',
        backgroundColor: 'light',
      }),
    },
    {
      name: 'Capabilities - 6-Channel Grid',
      category: 'Capabilities',
      description: 'High-conversion multi-card capability grid with numbered badge indicators and explore CTAs.',
      blockType: 'CapabilitiesGridBlock',
      thumbnailUrl: '/images/portfolio-0001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Our Services',
        title: 'Six Integrated Capabilities',
        cards: [
          { number: '01', title: 'Digital Marketing & Demand Gen', description: 'Performance paid search, paid social, SEO, and geo-targeted multi-channel funnels.', btnText: 'Explore', btnLink: '/services' },
          { number: '02', title: 'Outdoor & Transit Advertising', description: 'Static billboards, digital LED billboards, airport concourses, and transit wraps.', btnText: 'Explore', btnLink: '/services' },
          { number: '03', title: 'Video Display & Digital Signage', description: 'High-bright LED video walls, corporate signage, and centralized cloud CMS control.', btnText: 'Explore', btnLink: '/products' },
          { number: '04', title: 'Interactive AV & Kiosks', description: 'Touchscreen wayfinding kiosks, smart retail hubs, and sensor-based experiential apps.', btnText: 'Explore', btnLink: '/products' },
          { number: '05', title: 'Creative, Video & Motion', description: 'Brand films, 3D CGI anamorphic billboard motion graphics, and ad production.', btnText: 'Explore', btnLink: '/services' },
          { number: '06', title: 'Lighting, Audio & Events', description: 'Architectural facade wash, commercial PA sound, and live experiential booth staging.', btnText: 'Explore', btnLink: '/services' },
        ],
      }),
    },
    {
      name: 'Capabilities - 3-Step Growth Framework',
      category: 'Capabilities',
      description: 'Dark-themed 3-phase strategic roadmap cards with featured quote and direct action trigger.',
      blockType: 'ModularFrameworkBlock',
      thumbnailUrl: '/images/portfolio-00002-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Our Scalable Model',
        title: 'Start Regional. Scale National.',
        introText: 'Our modular framework allows enterprise brands to test and validate before expanding.',
        steps: [
          { stepNum: 'PHASE 01', title: 'Regional Pilot & Proof', description: 'Deploy targeted outdoor and digital ads in focus markets to validate customer acquisition costs.' },
          { stepNum: 'PHASE 02', title: 'Corridor Expansion', description: 'Scale media inventory along primary transit corridors and high-density shopping districts.' },
          { stepNum: 'PHASE 03', title: 'National Dominance', description: 'Synchronize nationwide billboard flights and cloud digital screens with automated attribution.' },
        ],
        quoteText: 'Konnect Marketing delivered our multi-state expansion with logistical precision.',
        ctaText: 'Start Your Regional Pilot',
        ctaLink: '/contact',
      }),
    },
    {
      name: 'Capabilities - Process Roadmap',
      category: 'Capabilities',
      description: 'Clean step-by-step numbered process cards (Discover, Plan, Deploy, Scale).',
      blockType: 'ProcessStepsBlock',
      thumbnailUrl: '/images/bg-01-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'How We Work',
        title: 'Our Proven 4-Step Execution Model',
        description: 'From initial site survey to hardware commissioning and flight monitoring.',
        steps: [
          { step: '01', title: 'Market & Site Audit', description: 'Comprehensive analysis of vehicular traffic patterns and zoning regulations.' },
          { step: '02', title: 'Hardware Engineering', description: 'Custom structural engineering and electrical load calculations.' },
          { step: '03', title: 'Creative Calibration', description: 'High-contrast content optimization for maximum daytime readability.' },
          { step: '04', title: 'Live Optimization', description: 'Continuous uptime monitoring and real-time impression telemetry.' },
        ],
      }),
    },
    {
      name: 'Products - Hardware Specs & Catalog',
      category: 'Products',
      description: 'Commercial hardware catalog with specs ticker and tiered product display cards.',
      blockType: 'ProductCatalogBlock',
      thumbnailUrl: '/images/portfolio-0001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        specsStrip: [
          { title: '24/7 Rating', description: 'Industrial grade diodes with 100,000+ hour MTBF rating.' },
          { title: 'IP67 Sealed', description: 'All-weather outdoor aluminum chassis.' },
          { title: 'Cloud CMS', description: 'Centralized diagnostic and scheduling control.' },
          { title: 'Nationwide SLA', description: 'Rapid on-site resolution technicians.' },
        ],
        categories: [
          {
            categoryNum: 'Category 01',
            title: 'Outdoor LED Billboards',
            description: 'Ultra-high-bright 8,500+ nit SMD LED billboard displays.',
            isDark: false,
            products: [
              {
                badge: 'DOOH Billboard',
                title: 'High-Bright LED Billboard',
                description: 'Daylight-viewable outdoor digital display designed for highway corridors.',
                features: ['P6, P8, P10 Pixel Pitch', '8,500+ Nits Brightness', 'IP67 Weatherproof'],
                image: '/images/portfolio-0001-free-img.jpg',
              },
            ],
          },
        ],
      }),
    },
    {
      name: 'Products - Feature & Hardware Comparison Matrix',
      category: 'Products',
      description: 'Interactive side-by-side comparison table for product lines, hardware tiers, and campaign packages.',
      blockType: 'FeatureComparisonBlock',
      thumbnailUrl: '/images/portfolio-00002-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Tier Comparison',
        title: 'Compare Hardware & Flight Specifications',
        description: 'Choose the optimal package tailored for your footprint and visibility objectives.',
        columnHeaders: ['Specification', 'Standard DOOH', 'Regional Synergy', 'National Network'],
        rows: [
          { feature: 'Pixel Pitch Options', plan1: 'P10 Outdoor', plan2: 'P6 - P8 SMD', plan3: 'P2.5 - P4 Ultra Fine' },
          { feature: 'Brightness Output', plan1: '5,500 Nits', plan2: '7,500 Nits', plan3: '10,000+ Nits HDR' },
          { feature: 'Cloud CMS Scheduling', plan1: 'Single Site', plan2: 'Multi-Branch', plan3: 'API Automated' },
          { feature: 'On-Site Maintenance SLA', plan1: '48 Hours', plan2: '24 Hours', plan3: '4-Hour Emergency' },
        ],
      }),
    },
    {
      name: 'Social Proof - Animated Metrics Counter',
      category: 'Social Proof',
      description: '4-column animated counter strip highlighting key enterprise statistics and achievements.',
      blockType: 'StatsCounterBlock',
      thumbnailUrl: '/images/bg-01-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'zoom-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        stats: [
          { target: '50', suffix: '', label: 'States Covered' },
          { target: '500', suffix: '+', label: 'Displays Managed' },
          { target: '2.5', suffix: 'M+', label: 'Monthly Impressions' },
          { target: '94', suffix: '%', label: 'Client Retention' },
        ],
      }),
    },
    {
      name: 'Social Proof - Client Logo Cloud',
      category: 'Social Proof',
      description: 'Responsive multi-logo showcase with subtle grayscale hover transitions.',
      blockType: 'ClientLogosBlock',
      thumbnailUrl: '/images/logo-1.png',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Trusted Partnerships',
        title: 'Powering Leading Brands Nationwide',
        logos: [
          { name: 'Client 1', image: '/images/logo-1.png' },
          { name: 'Client 2', image: '/images/logo-2.png' },
          { name: 'Client 3', image: '/images/logo-3.png' },
          { name: 'Client 5', image: '/images/logo-5.png' },
        ],
      }),
    },
    {
      name: 'Social Proof - Customer Reviews & Testimonials',
      category: 'Social Proof',
      description: 'Interactive carousel of customer reviews with 5-star ratings and role badges.',
      blockType: 'TestimonialsCarouselBlock',
      thumbnailUrl: '/images/about-001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Client Testimonials',
        title: 'What Enterprise Partners Say',
        items: [
          { quote: 'Konnect Marketing delivered our 12-market DOOH billboard expansion flawlessly and ahead of schedule.', author: 'Elena Rostova', role: 'VP of Growth', company: 'Solstice Tech', stars: 5 },
          { quote: 'The indoor video wall installation in our Chicago flagship is breathtaking. Flawless pixel clarity.', author: 'David Chen', role: 'Director of Facilities', company: 'Horizon Retail', stars: 5 },
        ],
      }),
    },
    {
      name: 'Social Proof - 8-Box Portfolio Gallery',
      category: 'Social Proof',
      description: 'Responsive 8-box grid showcasing commercial LED installations and outdoor billboard flights.',
      blockType: 'PortfolioGridBlock',
      thumbnailUrl: '/images/portfolio-0001-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        items: [
          { category: 'DOOH Media', title: 'Times Square Spectacular', image: '/images/portfolio-0001-free-img.jpg', link: '/portfolio' },
          { category: 'Commercial LED', title: 'Flagship Store Video Wall', image: '/images/portfolio-00002-free-img.jpg', link: '/portfolio' },
          { category: 'Transit Media', title: 'Metropolitan Rail Concourse', image: '/images/portfolio-0003-free-img.jpg', link: '/portfolio' },
          { category: 'Architectural', title: 'Facade LED Wash Lighting', image: '/images/portfolio-0004-free-img.jpg', link: '/portfolio' },
        ],
      }),
    },
    {
      name: 'Interactive - Expandable FAQ Accordion',
      category: 'Interactive',
      description: 'Accordion component with smooth toggle animations answering common enterprise queries.',
      blockType: 'FaqAccordionBlock',
      thumbnailUrl: '/images/bg-14-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Got Questions?',
        title: 'Frequently Asked Questions',
        description: 'Find answers regarding hardware lead times, municipal permits, and campaign flight management.',
        faqs: [
          { question: 'What is the typical lead time for custom LED wall installations?', answer: 'Standard modular LED panels typically ship within 2 to 3 weeks, with complete structural on-site installation taking 3-5 business days.' },
          { question: 'Do you handle municipal billboard permits and zoning approvals?', answer: 'Yes. Our specialized municipal compliance team manages all structural engineering stamps, electrical permits, and municipal zoning filings.' },
          { question: 'Can we update screen content across multiple states in real time?', answer: 'Absolutely. Our centralized cloud CMS allows your creative team to push scheduled content, emergency overrides, and dynamic feeds to any screen instantly.' },
        ],
      }),
    },
    {
      name: 'Interactive - Tiered Pricing & Campaign Matrix',
      category: 'Interactive',
      description: '3-tier pricing cards with featured plan badge, bulleted benefits list, and action buttons.',
      blockType: 'PricingMatrixBlock',
      thumbnailUrl: '/images/bg-01-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'slide-up', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        subtitle: 'Campaign Packages',
        title: 'Flexible Campaign Flight Tiers',
        description: 'Scalable media solutions for regional rollouts and nationwide brand domination.',
        plans: [
          { name: 'Regional Launch', price: '$4,500', period: 'month', description: 'Ideal for local market brand awareness.', features: ['2 Highway Digital Billboard Flights', '150k Guaranteed Impressions', 'Bi-Weekly Analytics Report'], isPopular: false, ctaText: 'Start Regional', ctaLink: '/contact' },
          { name: 'Corridor Expansion', price: '$12,500', period: 'month', description: 'Multi-city transit and highway dominance.', features: ['8 High-Traffic DOOH Locations', '650k Guaranteed Impressions', 'Mobile Geo-Fencing Retargeting', 'Dedicated Account Strategist'], isPopular: true, ctaText: 'Scale Corridor', ctaLink: '/contact' },
          { name: 'National Network', price: '$35,000+', period: 'month', description: 'Omnichannel multi-state saturation.', features: ['25+ National Metropolitan Locations', '3.5M+ Guaranteed Impressions', 'Real-Time Foot-Traffic Attribution', '24/7 Priority Emergency Support'], isPopular: false, ctaText: 'Contact Enterprise', ctaLink: '/contact' },
        ],
      }),
    },
    {
      name: 'Conversion - High-Contrast CTA Banner',
      category: 'Conversion',
      description: 'High-contrast conversion callout strip with custom headline, subtitle, and primary button.',
      blockType: 'CtaBannerBlock',
      thumbnailUrl: '/images/bg-14-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'zoom-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        variant: 'light',
        subtitle: 'Vision & Partnership',
        title: 'Ready to launch your next high-impact campaign?',
        btnText: 'Start a Conversation',
        btnLink: '/contact',
      }),
    },
    {
      name: 'Conversion - Enterprise Contact & Inquiry Form',
      category: 'Conversion',
      description: 'Direct contact info sidebar with phone, email, address, and live inquiry submission form.',
      blockType: 'ContactFormBlock',
      thumbnailUrl: '/images/bg-14-free-img.jpg',
      defaultAnimationJson: JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      defaultContentJson: JSON.stringify({
        title: 'Get In Touch',
        subtitle: 'Available 24/7',
        phone: '929-242-6868',
        email: 'contact@konnectmarketingusa.com',
        hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
        address: 'New York, NY',
      }),
    },
  ];

  for (const template of sectionTemplates) {
    const existing = await prisma.sectionTemplate.findFirst({ where: { name: template.name } });
    if (!existing) {
      await prisma.sectionTemplate.create({
        data: {
          ...template,
          isDefault: true,
        },
      });
    }
  }

  console.log(`Seeded ${sectionTemplates.length} Reusable Section Design Schemas.`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
