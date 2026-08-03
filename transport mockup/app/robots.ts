import type { MetadataRoute } from "next";
import { transportationSite } from "@/config/transportation";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${transportationSite.identity.domain}/sitemap.xml`,
  };
}
