import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import privacy from "@/content/privacy-policy.json";

export const metadata: Metadata = {
  title: "Privacy Policy - Bilal Shafqat",
  description:
    "How Bilal Shafqat collects, uses, and protects your personal information when you visit this website or use these services.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-ink">
            Privacy Policy
          </h1>
          <div
            className="post-content mt-8"
            dangerouslySetInnerHTML={{ __html: privacy.content }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
