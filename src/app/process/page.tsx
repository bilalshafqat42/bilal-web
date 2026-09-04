import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Engagement from "@/components/Engagement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "My Process — From Brief To Shipped Work | Bilal Shafqat",
  description:
    "How a project actually runs, stage by stage: understanding the brief, planning and design, build and launch, then measurement and iteration. Worked examples from UAE and UK real estate projects.",
  alternates: { canonical: "/process" },
};

/**
 * The full delivery process.
 *
 * Exists because the image-rich, pinned version of this section was the tallest
 * thing on the homepage, and the homepage was making the same argument three
 * times over. The homepage now carries `ProcessCompact` — the same four stages,
 * one row, no imagery — and links here.
 *
 * A server shell with client islands inside it: `Process` and `Engagement` are
 * both client components already, and no `"use client"` is added at page level.
 *
 * `Engagement` follows the process deliberately. Someone who has just read how
 * the work runs is being asked the next question, which is how to buy it.
 */
export default function ProcessPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Process />
        <Engagement />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
