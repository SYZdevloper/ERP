import Link from "next/link";
import type { HomePageContent, IndustrySiteConfig, NewsItem } from "@/types/site";
import { AnimatedStat } from "@/components/animated-stat";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ArrowIcon, BrandMark, SectorIcon } from "@/components/icons";
import { ReportsSection } from "@/components/reports-section";

function NewsColumn({ title, label, items, route }: { title: string; label: string; items: NewsItem[]; route: string }) {
  return (
    <article className="news-column">
      <div className="news-column-head"><h3>{title}</h3><span>{label}</span></div>
      <ul className="news-list">
        {items.map((item) => (
          <li key={item.id}>
            <Link className="news-item" href={item.href || `${route}/${item.slug}`}>
              <span className="news-date">{item.date}</span>
              <span className="news-title">{item.title}</span>
              <ArrowIcon />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function HomePage({ site, content }: { site: IndustrySiteConfig; content: HomePageContent }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header site={site} />
      <main id="main-content">
        <Hero site={site} />

        <section className="stats-wrap" aria-label="Company metrics">
          <div className="container">
            <div className="stats-grid">
              {content.stats.map((stat) => (
                <article className="stat" key={stat.label}>
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                  <span className="stat-label">{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cited" aria-label="Research coverage">
          <div className="container">
            <div className="cited-label">Research cited by teams across</div>
            <div className="logo-strip">
              {content.citedBy.map((name) => <div className="logo-placeholder" key={name}>{name}</div>)}
            </div>
          </div>
        </section>

        <section className="section section--sky" id="verticals">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">{site.sections.verticalEyebrow}</p>
                <h2 className="section-title">{site.sections.verticalTitle}</h2>
                <p className="section-copy">{site.sections.verticalDescription}</p>
              </div>
              <Link className="text-link" href={site.routes.verticals}>View All Verticals <ArrowIcon /></Link>
            </div>
            <div className="sector-grid">
              {content.verticals.map((vertical, index) => (
                <Link className="sector-card" href={`${site.routes.verticals}/${vertical.slug}`} key={vertical.id}>
                  <span className="sector-no">SECTOR {String(index + 1).padStart(2, "0")}</span>
                  <span className="sector-icon"><SectorIcon name={vertical.icon} /></span>
                  <h3>{vertical.title}</h3>
                  <span className="sector-meta"><span>{vertical.reportCount} Reports</span><ArrowIcon /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ReportsSection site={site} categories={content.reportCategories} reports={content.reports} />

        <section className="section section--navy" id="services">
          <div className="container services-layout">
            <div className="service-intro">
              <p className="eyebrow">{site.sections.servicesEyebrow}</p>
              <h2 className="section-title">{site.sections.servicesTitle}</h2>
              <p className="section-copy">{site.sections.servicesDescription}</p>
              <Link className="btn btn--orange service-cta" href={site.routes.contact}>Discuss Your Requirement</Link>
            </div>
            <div className="service-list">
              {content.services.map((service, index) => (
                <Link className="service-item" href={service.href} key={service.title}>
                  <span className="service-no">{String(index + 1).padStart(2, "0")}</span>
                  <span><h3>{service.title}</h3><p>{service.description}</p></span>
                  <span className="service-arrow"><ArrowIcon /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--white" id="about">
          <div className="container">
            <div className="trust-grid">
              <div className="why-box">
                <p className="eyebrow">{site.sections.trustEyebrow}</p>
                <h2 className="section-title">{site.sections.trustTitle}</h2>
                <p className="section-copy">{site.sections.trustDescription}</p>
                <div className="why-features">
                  {content.trustFeatures.map((feature) => (
                    <article className="why-feature" key={feature.title}>
                      <SectorIcon name={feature.icon} />
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <aside className="compliance">
                <p className="eyebrow">Compliance & Trust</p>
                <h3>Research you can use with confidence</h3>
                <p>A structured quality and governance framework for transparent, secure and decision-ready market intelligence.</p>
                <ul>{content.compliance.map((item) => <li key={item}><span className="check">✓</span>{item}</li>)}</ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="insights">
          <div className="container">
            <div className="section-head"><div>
              <p className="eyebrow">{site.sections.insightsEyebrow}</p>
              <h2 className="section-title">{site.sections.insightsTitle}</h2>
              <p className="section-copy">{site.sections.insightsDescription}</p>
            </div></div>
            <div className="news-grid">
              <NewsColumn title="Latest Blogs" label="Analyst Insights" items={content.blogs} route={site.routes.blogs} />
              <NewsColumn title="Press Releases" label="Market Updates" items={content.pressReleases} route={site.routes.news} />
            </div>
          </div>
        </section>

        <section className="section section--navy">
          <div className="container">
            <div className="section-head"><div>
              <p className="eyebrow">{site.sections.testimonialsEyebrow}</p>
              <h2 className="section-title">{site.sections.testimonialsTitle}</h2>
              <p className="section-copy">{site.sections.testimonialsDescription}</p>
            </div></div>
            <div className="testimonial-grid">
              {content.testimonials.map((testimonial) => (
                <article className="testimonial" key={`${testimonial.role}-${testimonial.company}`}>
                  <span className="quote">“</span>
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className="person">
                    <span className="avatar">{testimonial.initials}</span>
                    <span><strong>{testimonial.role}</strong><small>{testimonial.company}</small></span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta" id="contact">
          <div className="container final-cta-inner">
            <div><h2>{site.sections.ctaTitle}</h2><p>{site.sections.ctaDescription}</p></div>
            <a className="btn btn--navy" href={`mailto:${site.identity.email}`}>Request a Custom Scope <ArrowIcon /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link href={site.routes.home} className="brand">
                <BrandMark />
                <span className="brand-copy"><span className="brand-name">{site.identity.name}</span><span className="brand-type">{site.identity.tagline}</span></span>
              </Link>
              <p className="footer-brand-text">{site.identity.footerDescription}</p>
            </div>
            <div><h3>Research & Insights</h3><div className="footer-links">
              <Link href={site.routes.verticals}>Verticals</Link><Link href={site.routes.blogs}>Blogs</Link><Link href={site.routes.news}>News</Link><Link href={site.routes.services}>Services</Link>
            </div></div>
            <div><h3>Company</h3><div className="footer-links">
              <Link href={site.routes.about}>About Us</Link><Link href={site.routes.contact}>Contact Us</Link><Link href={site.routes.mediaCoverage}>Media Coverage</Link><Link href={site.routes.testimonials}>Testimonials</Link><Link href={site.routes.writeForUs}>Write for Us</Link>
            </div></div>
            <div><h3>Contact</h3><div className="footer-contact">
              {site.identity.phones.map((phone) => <p key={phone}>{phone}</p>)}<p>{site.identity.email}</p><p>{site.identity.hours}</p>
            </div></div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {site.identity.name}. All rights reserved.</span>
            <div className="footer-legal"><Link href={site.routes.privacy}>Privacy</Link><Link href={site.routes.terms}>Terms</Link><Link href={site.routes.returns}>Return Policy</Link><Link href={site.routes.sitemap}>Sitemap</Link></div>
          </div>
        </div>
      </footer>
    </>
  );
}
