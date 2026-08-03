import { transportationSite } from "@/config/transportation";
import type {
  HomePageContent,
  IconName,
  NewsItem,
  ReportItem,
  VerticalItem,
} from "@/types/site";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const asNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const validIcons: IconName[] = [
  "auto", "road", "rail", "air", "marine", "logistics", "urban", "infra",
  "smart", "mobility", "aftermarket", "safety", "source", "model", "expert", "refresh",
];

const iconOrFallback = (value: unknown, index: number): IconName => {
  const icon = asString(value) as IconName;
  if (validIcons.includes(icon)) return icon;
  const verticalIcons: IconName[] = [
    "auto", "road", "rail", "air", "marine", "logistics",
    "urban", "infra", "smart", "mobility", "aftermarket", "safety",
  ];
  return verticalIcons[index % verticalIcons.length];
};

const first = (record: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
};

function normalizeVertical(value: unknown, index: number): VerticalItem | null {
  if (!isRecord(value)) return null;
  const title = asString(first(value, ["title", "name", "category_name", "vertical_name"]));
  if (!title) return null;
  const slug = asString(first(value, ["slug", "url_slug"]), slugify(title));
  return {
    id: asString(first(value, ["id", "category_id", "vertical_id"]), String(index + 1)),
    title,
    slug,
    reportCount: asNumber(first(value, ["reportCount", "report_count", "reports_count", "count"])),
    icon: iconOrFallback(first(value, ["icon", "icon_name"]), index),
  };
}

function normalizeReport(value: unknown, index: number): ReportItem | null {
  if (!isRecord(value)) return null;
  const title = asString(first(value, ["title", "report_title", "name"]));
  if (!title) return null;
  const slug = asString(first(value, ["slug", "report_slug", "url_slug"]), slugify(title));
  return {
    id: asString(first(value, ["id", "report_id"]), String(index + 1)),
    slug,
    href: asString(first(value, ["href", "url"])) || undefined,
    category: asString(first(value, ["category", "category_name", "vertical", "vertical_name"]), "Transportation"),
    title,
    description: asString(first(value, ["description", "summary", "meta_description"]), `Comprehensive market analysis of the ${title}.`),
    baseYear: asString(first(value, ["baseYear", "base_year"]), "2025"),
    baseValue: asString(first(value, ["baseValue", "base_value", "current", "current_value", "market_size"]), "N/A"),
    forecastYear: asString(first(value, ["forecastYear", "forecast_year"]), "2035"),
    forecastValue: asString(first(value, ["forecastValue", "forecast_value", "forecast"]), "N/A"),
    cagr: asString(first(value, ["cagr", "growth_rate"]), "N/A"),
    status: asString(first(value, ["status", "report_status"]), "Updated"),
  };
}

function normalizeNews(value: unknown, index: number): NewsItem | null {
  if (!isRecord(value)) return null;
  const title = asString(first(value, ["title", "headline", "name"]));
  if (!title) return null;
  const slug = asString(first(value, ["slug", "url_slug"]), slugify(title));
  return {
    id: asString(first(value, ["id", "article_id"]), String(index + 1)),
    title,
    slug,
    href: asString(first(value, ["href", "url"])) || undefined,
    date: asString(first(value, ["date", "published_at", "publishedAt", "created_at"]), "Recently updated"),
  };
}

function fromApi(raw: unknown): Partial<HomePageContent> {
  if (!isRecord(raw)) return {};
  const root = isRecord(raw.data) ? raw.data : raw;

  const verticalSource = first(root, ["verticals", "categories", "sectors"]);
  const reportSource = first(root, ["reports", "latestReports", "latest_reports"]);
  const blogSource = first(root, ["blogs", "latestBlogs", "latest_blogs"]);
  const pressSource = first(root, ["pressReleases", "press_releases", "news", "latestNews"]);

  const verticals = asArray(verticalSource)
    .map(normalizeVertical)
    .filter((item): item is VerticalItem => item !== null);
  const reports = asArray(reportSource)
    .map(normalizeReport)
    .filter((item): item is ReportItem => item !== null);
  const blogs = asArray(blogSource)
    .map(normalizeNews)
    .filter((item): item is NewsItem => item !== null);
  const pressReleases = asArray(pressSource)
    .map(normalizeNews)
    .filter((item): item is NewsItem => item !== null);

  const reportCategories = [
    "All Reports",
    ...Array.from(new Set(reports.map((report) => report.category).filter(Boolean))),
  ];

  return {
    ...(verticals.length ? { verticals } : {}),
    ...(reports.length ? { reports, reportCategories } : {}),
    ...(blogs.length ? { blogs } : {}),
    ...(pressReleases.length ? { pressReleases } : {}),
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const fallback = transportationSite.fallbackContent;
  const endpoint = process.env.HOMEPAGE_API_URL;

  if (!endpoint) return fallback;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });

    if (!response.ok) return fallback;
    const normalized = fromApi(await response.json());

    return {
      ...fallback,
      ...normalized,
      stats: fallback.stats,
      citedBy: fallback.citedBy,
      services: fallback.services,
      trustFeatures: fallback.trustFeatures,
      compliance: fallback.compliance,
      testimonials: fallback.testimonials,
    };
  } catch {
    return fallback;
  }
}
