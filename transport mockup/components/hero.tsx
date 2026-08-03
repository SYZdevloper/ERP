"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { IndustrySiteConfig } from "@/types/site";
import { ArrowIcon, SearchIcon } from "@/components/icons";

export function Hero({ site }: { site: IndustrySiteConfig }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `${site.routes.reports}?search=${encodeURIComponent(value)}` : site.routes.reports);
  };

  return (
    <section className="hero">
      <div className="hero-network" aria-hidden="true">
        <svg viewBox="0 0 1600 780" preserveAspectRatio="none">
          <path className="network-route network-route--blue" d="M-40 190 C150 85, 280 305, 470 220 S790 120, 975 250 S1280 420, 1640 245" />
          <path className="network-route network-route--orange" d="M-60 610 C180 660, 300 470, 520 535 S810 650, 1015 470 S1320 120, 1650 205" />
          <path className="network-route network-route--teal" d="M-20 375 C210 475, 330 335, 545 385 S855 505, 1065 405 S1370 555, 1630 470" />
          <g>
            <circle className="network-node network-node--blue" cx="125" cy="145" r="7" />
            <circle className="network-node network-node--orange" cx="280" cy="548" r="8" />
            <circle className="network-node network-node--teal" cx="430" cy="355" r="6" />
            <circle className="network-node network-node--blue" cx="1185" cy="353" r="7" />
            <circle className="network-node network-node--orange" cx="1390" cy="170" r="8" />
            <circle className="network-node network-node--teal" cx="1510" cy="492" r="6" />
          </g>
        </svg>
      </div>

      <div className="container">
        <div className="hero-inner">
          <div className="hero-kicker">{site.hero.kicker}</div>
          <h1>{site.hero.titleBefore} <span>{site.hero.titleAccent}</span></h1>
          <p className="hero-copy">{site.hero.description}</p>

          <form className="search-panel" role="search" onSubmit={submit}>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search reports</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={site.hero.searchPlaceholder}
              />
            </label>
            <button className="btn btn--orange" type="submit">Search Reports</button>
          </form>

          <div className="trending">
            <strong>Trending</strong>
            {site.hero.trending.map((item) => (
              <Link key={item} href={`${site.routes.reports}?search=${encodeURIComponent(item)}`}>{item}</Link>
            ))}
          </div>

          <div className="hero-actions">
            <Link className="btn btn--orange" href={site.routes.verticals}>
              Browse All Reports <ArrowIcon />
            </Link>
            <Link className="btn btn--outline" href={site.routes.contact}>Make a Custom Report</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
