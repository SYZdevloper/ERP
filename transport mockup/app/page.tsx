import { HomePage } from "@/components/home-page";
import { transportationSite } from "@/config/transportation";
import { getHomePageContent } from "@/lib/homepage-data";

export default async function Page() {
  const content = await getHomePageContent();
  const site = transportationSite;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.identity.domain}/#organization`,
        name: site.identity.name,
        url: site.identity.domain,
        email: site.identity.email,
      },
      {
        "@type": "WebSite",
        "@id": `${site.identity.domain}/#website`,
        url: site.identity.domain,
        name: site.identity.name,
        publisher: { "@id": `${site.identity.domain}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.identity.domain}${site.routes.reports}?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage site={site} content={content} />
    </>
  );
}
