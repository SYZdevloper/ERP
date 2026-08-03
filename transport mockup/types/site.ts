export type IconName =
  | "auto"
  | "road"
  | "rail"
  | "air"
  | "marine"
  | "logistics"
  | "urban"
  | "infra"
  | "smart"
  | "mobility"
  | "aftermarket"
  | "safety"
  | "source"
  | "model"
  | "expert"
  | "refresh";

export interface SiteRoutes {
  home: string;
  verticals: string;
  services: string;
  news: string;
  blogs: string;
  about: string;
  contact: string;
  reports: string;
  mediaCoverage: string;
  testimonials: string;
  writeForUs: string;
  privacy: string;
  terms: string;
  returns: string;
  sitemap: string;
}

export interface SiteIdentity {
  name: string;
  shortName: string;
  domain: string;
  email: string;
  tagline: string;
  footerDescription: string;
  description: string;
  phones: string[];
  hours: string;
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface VerticalItem {
  id: string;
  title: string;
  slug: string;
  reportCount: number;
  icon: IconName;
}

export interface ReportItem {
  id: string;
  slug: string;
  href?: string;
  category: string;
  title: string;
  description: string;
  baseYear: string;
  baseValue: string;
  forecastYear: string;
  forecastValue: string;
  cagr: string;
  status?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  href: string;
}

export interface TrustFeature {
  icon: IconName;
  title: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  href?: string;
  date: string;
}

export interface TestimonialItem {
  initials: string;
  quote: string;
  role: string;
  company: string;
}

export interface HomePageContent {
  stats: StatItem[];
  citedBy: string[];
  verticals: VerticalItem[];
  reportCategories: string[];
  reports: ReportItem[];
  services: ServiceItem[];
  trustFeatures: TrustFeature[];
  compliance: string[];
  blogs: NewsItem[];
  pressReleases: NewsItem[];
  testimonials: TestimonialItem[];
}

export interface IndustrySiteConfig {
  identity: SiteIdentity;
  routes: SiteRoutes;
  hero: {
    kicker: string;
    titleBefore: string;
    titleAccent: string;
    description: string;
    searchPlaceholder: string;
    trending: string[];
  };
  sections: {
    verticalEyebrow: string;
    verticalTitle: string;
    verticalDescription: string;
    reportsEyebrow: string;
    reportsTitle: string;
    reportsDescription: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesDescription: string;
    trustEyebrow: string;
    trustTitle: string;
    trustDescription: string;
    insightsEyebrow: string;
    insightsTitle: string;
    insightsDescription: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    testimonialsDescription: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  fallbackContent: HomePageContent;
}
