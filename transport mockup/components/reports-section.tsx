"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IndustrySiteConfig, ReportItem } from "@/types/site";
import { ArrowIcon } from "@/components/icons";

export function ReportsSection({
  site,
  categories,
  reports,
}: {
  site: IndustrySiteConfig;
  categories: string[];
  reports: ReportItem[];
}) {
  const [active, setActive] = useState(categories[0] ?? "All Reports");

  const visible = useMemo(() => {
    if (active === "All Reports") return reports;
    const filtered = reports.filter((report) => report.category === active);
    return filtered.length ? filtered : reports.slice(0, 3);
  }, [active, reports]);

  return (
    <section className="section" id="reports">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{site.sections.reportsEyebrow}</p>
            <h2 className="section-title">{site.sections.reportsTitle}</h2>
            <p className="section-copy">{site.sections.reportsDescription}</p>
          </div>
          <Link className="text-link" href={site.routes.verticals}>View All Reports <ArrowIcon /></Link>
        </div>

        <div className="tabs" role="tablist" aria-label="Report categories">
          {categories.map((category) => (
            <button
              key={category}
              className="tab"
              type="button"
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="reports-grid">
          {visible.length ? visible.map((report) => {
            const href = report.href || `${site.routes.reports}/${report.slug}`;
            return (
              <article className="report-card" key={report.id}>
                <div className="report-top">
                  <span className="report-category">{report.category}</span>
                  <span className="report-status">{report.status || "Updated"}</span>
                </div>
                <h3>{report.title}</h3>
                <p className="report-desc">{report.description}</p>
                <div className="report-metrics">
                  <div className="report-metric"><span>{report.baseYear}</span><strong>{report.baseValue}</strong></div>
                  <div className="report-metric"><span>{report.forecastYear}</span><strong>{report.forecastValue}</strong></div>
                  <div className="report-metric"><span>CAGR</span><strong>{report.cagr}</strong></div>
                </div>
                <Link className="report-link" href={href}>Read Report <ArrowIcon /></Link>
              </article>
            );
          }) : <div className="empty-reports">No reports are available in this category yet.</div>}
        </div>
      </div>
    </section>
  );
}
