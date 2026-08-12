const SITE_URL = "https://bilalshafqat.com";

const services = [
  "Paid Marketing & Lead Generation",
  "Website & App Development",
  "Design, Content & Conversion Optimization",
  "CRM & Marketing Automation",
  "Google Ads & Performance Max",
  "Meta, LinkedIn & TikTok Advertising",
  "HubSpot, Zoho & Salesforce CRM Setup",
  "Conversion Rate Optimization (CRO)",
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bilal Shafqat",
  jobTitle: "Digital Marketing, Design & Development Specialist",
  url: SITE_URL,
  image: `${SITE_URL}/images/bilal-shafqat-coat.avif`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  sameAs: ["https://www.behance.net/bilalshafqat"],
  knowsAbout: services,
  areaServed: ["United Arab Emirates", "Worldwide"],
  makesOffer: services.map((name) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name,
      provider: { "@type": "Person", name: "Bilal Shafqat" },
      areaServed: ["United Arab Emirates", "Worldwide"],
    },
  })),
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
