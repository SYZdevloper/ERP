import type { IndustrySiteConfig } from "@/types/site";

export const transportationSite: IndustrySiteConfig = {
  identity: {
    name: "Transportation Industry Insights",
    shortName: "TII",
    domain: "https://transportationindustryinsights.com",
    email: "research@transportationindustryinsights.com",
    tagline: "Market Research & Intelligence",
    description:
      "Transportation market research reports and strategic intelligence across automotive, aviation, rail, maritime, logistics, infrastructure and future mobility.",
    footerDescription:
      "Global transportation and mobility market intelligence across road, rail, air, maritime, logistics and infrastructure.",
    phones: ["+1 800 555 0148", "+44 330 043 0148"],
    hours: "Mon–Fri, 9am–6pm ET",
  },
  routes: {
    home: "/",
    verticals: "/verticals",
    services: "/services",
    news: "/news",
    blogs: "/blogs",
    about: "/about",
    contact: "/contact",
    reports: "/reports",
    mediaCoverage: "/media-coverage",
    testimonials: "/testimonials",
    writeForUs: "/write-for-us",
    privacy: "/privacy",
    terms: "/terms",
    returns: "/return-policy",
    sitemap: "/sitemap.xml",
  },
  hero: {
    kicker: "Global Transportation Market Intelligence",
    titleBefore: "Research that keeps decisions",
    titleAccent: "moving.",
    description:
      "Syndicated market reports, custom studies and strategic consulting across automotive, aviation, rail, maritime, logistics, infrastructure and future mobility.",
    searchPlaceholder:
      "Search market reports — e.g. EV Charging, Smart Rail, Cold Chain…",
    trending: ["Electric Vehicles", "Smart Logistics", "Urban Mobility", "Aviation MRO"],
  },
  sections: {
    verticalEyebrow: "Browse by Sector",
    verticalTitle: "The full transportation ecosystem",
    verticalDescription:
      "Focused coverage areas spanning vehicles, infrastructure, operations, services, technology and the movement of people and goods.",
    reportsEyebrow: "Latest Market Research",
    reportsTitle: "Transportation industry reports",
    reportsDescription:
      "Market sizing, growth forecasts, competitive analysis and opportunity intelligence across established and emerging transportation markets.",
    servicesEyebrow: "How We Support Growth",
    servicesTitle: "From published reports to embedded intelligence.",
    servicesDescription:
      "Engagement models designed for product strategy, investment, market entry and long-range transportation planning.",
    trustEyebrow: "Why Decision-Makers Choose TII",
    trustTitle: "Transportation depth, not generic coverage.",
    trustDescription:
      "Every analyst, market model and source set is built for mobility, logistics, infrastructure and the transportation value chain.",
    insightsEyebrow: "Insights & Newsroom",
    insightsTitle: "What is reshaping global mobility",
    insightsDescription:
      "Analyst viewpoints, market developments and strategic signals across passenger transport, freight, infrastructure and connected mobility.",
    testimonialsEyebrow: "What Our Clients Say",
    testimonialsTitle: "Trusted across the movement economy",
    testimonialsDescription:
      "Supporting manufacturers, operators, investors, technology vendors and infrastructure teams with decision-ready market intelligence.",
    ctaTitle: "Need a transportation market we have not published yet?",
    ctaDescription:
      "We will scope, size and forecast it to your exact definition—with analyst support throughout the engagement.",
  },
  fallbackContent: {
    stats: [
      { value: 180, suffix: "+", label: "Reports Published" },
      { value: 38, label: "Countries Covered" },
      { value: 45, suffix: "+", label: "Sector Analysts" },
      { value: 12, label: "Transportation Sectors" },
    ],
    citedBy: ["Mobility", "Automotive", "Aviation", "Logistics", "Infrastructure"],
    verticals: [
      { id: "1", title: "Automotive & Vehicle Technologies", slug: "automotive-vehicle-technologies", reportCount: 24, icon: "auto" },
      { id: "2", title: "Road Transportation", slug: "road-transportation", reportCount: 18, icon: "road" },
      { id: "3", title: "Rail & Mass Transit", slug: "rail-mass-transit", reportCount: 16, icon: "rail" },
      { id: "4", title: "Aviation & Aerospace Transport", slug: "aviation-aerospace-transport", reportCount: 22, icon: "air" },
      { id: "5", title: "Maritime & Inland Waterways", slug: "maritime-inland-waterways", reportCount: 17, icon: "marine" },
      { id: "6", title: "Freight, Logistics & Warehousing", slug: "freight-logistics-warehousing", reportCount: 29, icon: "logistics" },
      { id: "7", title: "Public & Urban Transportation", slug: "public-urban-transportation", reportCount: 14, icon: "urban" },
      { id: "8", title: "Transportation Infrastructure", slug: "transportation-infrastructure", reportCount: 20, icon: "infra" },
      { id: "9", title: "Intelligent Transportation Systems", slug: "intelligent-transportation-systems", reportCount: 21, icon: "smart" },
      { id: "10", title: "Shared & Micromobility", slug: "shared-micromobility", reportCount: 13, icon: "mobility" },
      { id: "11", title: "Aftermarket, MRO & Services", slug: "aftermarket-mro-services", reportCount: 15, icon: "aftermarket" },
      { id: "12", title: "Transportation Safety & Security", slug: "transportation-safety-security", reportCount: 11, icon: "safety" },
    ],
    reportCategories: ["All Reports", "Automotive", "Road", "Rail", "Aviation", "Maritime", "Logistics", "Urban Mobility", "Smart Transport"],
    reports: [
      { id: "ev-charging", slug: "electric-vehicle-charging-infrastructure-market", category: "Automotive", title: "Electric Vehicle Charging Infrastructure Market Size, Share & Forecast 2026–2035", description: "Infrastructure deployment, charger type, ownership models and regional investment analysis.", baseYear: "2025", baseValue: "$38.4B", forecastYear: "2035", forecastValue: "$188.7B", cagr: "17.3%", status: "Updated" },
      { id: "digital-freight", slug: "digital-freight-brokerage-market", category: "Logistics", title: "Digital Freight Brokerage Market Size, Share & Forecast 2026–2035", description: "Platform adoption, shipper behavior, carrier economics and competitive benchmarking.", baseYear: "2025", baseValue: "$6.9B", forecastYear: "2035", forecastValue: "$21.8B", cagr: "12.2%", status: "Updated" },
      { id: "smart-rail", slug: "smart-railways-market", category: "Rail", title: "Smart Railways Market Size, Share & Forecast 2026–2035", description: "Signaling, passenger systems, predictive maintenance and digital rail infrastructure.", baseYear: "2025", baseValue: "$29.8B", forecastYear: "2035", forecastValue: "$62.1B", cagr: "7.6%", status: "Updated" },
      { id: "aircraft-mro", slug: "commercial-aircraft-mro-market", category: "Aviation", title: "Commercial Aircraft MRO Market Size, Share & Forecast 2026–2035", description: "Fleet maintenance demand, component services, engine overhaul and regional capacity.", baseYear: "2025", baseValue: "$91.4B", forecastYear: "2035", forecastValue: "$137.6B", cagr: "4.2%", status: "Updated" },
      { id: "smart-ports", slug: "smart-ports-market", category: "Maritime", title: "Smart Ports Market Size, Share & Forecast 2026–2035", description: "Port automation, terminal systems, digital twins and connected logistics analysis.", baseYear: "2025", baseValue: "$2.9B", forecastYear: "2035", forecastValue: "$9.8B", cagr: "13.0%", status: "Updated" },
      { id: "maas", slug: "mobility-as-a-service-market", category: "Urban Mobility", title: "Mobility-as-a-Service Market Size, Share & Forecast 2026–2035", description: "Platform ecosystems, multimodal integration, payment systems and city adoption trends.", baseYear: "2025", baseValue: "$11.6B", forecastYear: "2035", forecastValue: "$68.4B", cagr: "19.4%", status: "Updated" },
    ],
    services: [
      { title: "Syndicated Reports", description: "Publication-ready studies with market sizing, structured segmentation, competitive analysis and forecast tables.", href: "/services" },
      { title: "Custom Research", description: "Bespoke sizing, competitor landscaping, country deep-dives and technology assessments scoped to your definition.", href: "/contact" },
      { title: "Consulting & Advisory", description: "Market-entry strategy, opportunity assessment, portfolio prioritization and commercial due diligence.", href: "/services" },
      { title: "Ongoing Intelligence", description: "Quarterly market monitoring, competitor tracking, forecast updates and direct analyst support.", href: "/services" },
    ],
    trustFeatures: [
      { icon: "source", title: "Primary-Source Discipline", description: "Official statistics, transport authorities, regulatory data and verified company disclosures." },
      { icon: "model", title: "Auditable Market Models", description: "Clear assumptions with segment, regional and global totals that reconcile exactly." },
      { icon: "expert", title: "Transportation Specialists", description: "Domain-focused analysts across vehicles, mobility, logistics, infrastructure and technology." },
      { icon: "refresh", title: "Living Forecasts", description: "Forecasts updated as policy, infrastructure, technology and competitive conditions change." },
    ],
    compliance: [
      "ISO-aligned quality process",
      "Secure client data handling",
      "Source-level traceability",
      "GDPR & CCPA compliance",
      "Secure payments",
      "Fact-checked publishing",
    ],
    blogs: [
      { id: "b1", slug: "charging-infrastructure-competitive-edge", date: "JUL 25 · 2026", title: "Why Charging Infrastructure Is Becoming the Real Competitive Edge in Electric Mobility" },
      { id: "b2", slug: "ai-route-optimization-freight", date: "JUL 22 · 2026", title: "How AI-Based Route Optimization Is Reshaping Freight Economics" },
      { id: "b3", slug: "connected-rail-infrastructure", date: "JUL 18 · 2026", title: "Inside the Next Generation of Connected Rail Infrastructure" },
      { id: "b4", slug: "smart-ports-investment-signals", date: "JUL 14 · 2026", title: "Five Signals Driving Investment in Smart Ports and Digital Terminals" },
    ],
    pressReleases: [
      { id: "p1", slug: "ev-charging-market-188-billion", date: "JUL 25 · 2026", title: "Electric Vehicle Charging Infrastructure Market to Reach $188.7 Billion by 2035" },
      { id: "p2", slug: "digital-freight-brokerage-growth", date: "JUL 22 · 2026", title: "Digital Freight Brokerage Market Forecast to Grow at 12.2% CAGR" },
      { id: "p3", slug: "smart-railways-market-62-billion", date: "JUL 18 · 2026", title: "Smart Railways Market Size Expected to Surpass $62 Billion by 2035" },
      { id: "p4", slug: "smart-ports-double-digit-growth", date: "JUL 14 · 2026", title: "Smart Ports Market Set for Double-Digit Growth Through 2035" },
    ],
    testimonials: [
      { initials: "SD", quote: "The market model connected infrastructure deployment, fleet adoption and regional policy into one usable view. It went directly into our strategy process.", role: "Strategy Director", company: "Global Mobility Technology Company" },
      { initials: "VP", quote: "Their logistics coverage gave us a much clearer picture of platform economics, carrier fragmentation and realistic addressable demand.", role: "VP, Market Development", company: "International Logistics Provider" },
      { initials: "PI", quote: "The competitor mapping was current, well sourced and structured around the decisions we actually needed to make during diligence.", role: "Principal Investor", company: "Infrastructure & Mobility Fund" },
    ],
  },
};
