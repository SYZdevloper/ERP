import type { MetadataRoute } from "next";
import { transportationSite } from "@/config/transportation";

export default function sitemap(): MetadataRoute.Sitemap {
  const { domain } = transportationSite.identity;
  const { home, verticals, services, news, blogs, about, contact } = transportationSite.routes;
  return [home, verticals, services, news, blogs, about, contact].map((route) => ({
    url: `${domain}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
