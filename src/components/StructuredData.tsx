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
  // Build timestamp. Honest (the content really was current at build) and it
  // gives AI systems and search engines the freshness signal the site had none of.
  dateModified: new Date().toISOString().split("T")[0],
  sameAs: [
    "https://www.linkedin.com/in/bilalshafqat42",
    "https://www.behance.net/bilalshafqat",
    "https://dribbble.com/bilalshafqat",
    "https://www.instagram.com/imbilalshafqat/",
    "https://www.facebook.com/imBilalshafqat",
    "https://x.com/bilalshafqat42",
    "https://www.youtube.com/@bilalshafqat42",
    "https://www.tiktok.com/@imbilalshafqat",
    "https://www.pinterest.com/bilalshafqat42/",
  ],
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
