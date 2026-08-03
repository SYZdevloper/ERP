"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IndustrySiteConfig } from "@/types/site";
import { BrandMark, MenuIcon } from "@/components/icons";

export function Header({ site }: { site: IndustrySiteConfig }) {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${sticky ? " sticky" : ""}`}>
      <div className="container nav">
        <Link href={site.routes.home} className="brand" aria-label={`${site.identity.name} home`} onClick={close}>
          <BrandMark />
          <span className="brand-copy">
            <span className="brand-name">{site.identity.name}</span>
            <span className="brand-type">{site.identity.tagline}</span>
          </span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main navigation">
          <Link href={site.routes.verticals} onClick={close}>Verticals</Link>
          <Link href={site.routes.services} onClick={close}>Services</Link>
          <Link href={site.routes.news} onClick={close}>News</Link>
          <Link href={site.routes.blogs} onClick={close}>Blogs</Link>
          <Link href={site.routes.about} onClick={close}>About</Link>
          <Link href={site.routes.contact} onClick={close}>Contact Us</Link>
        </nav>

        <Link className="btn btn--orange nav-cta" href={site.routes.contact}>Request Research</Link>

        <button
          className="icon-btn menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
