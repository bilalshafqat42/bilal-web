// Long-form content for the four LEOS project case studies.
//
// Why this file exists: the case studies averaged 190 words, making them the
// thinnest pages on the site despite being the only proof a buyer reads before
// enquiring. Kept separate from `caseStudies.ts` so that file stays a readable
// data model rather than a wall of prose.
//
// Everything here describes work that shipped and constraints that were real.
// The development facts (unit counts, sizes, prices, completion dates) come
// from the captures themselves. There are no invented performance figures:
// campaign results were never shared for publication, so none are claimed.

export type DepthBlock = { heading: string; paragraphs: string[] };

export const caseStudyDepth: Record<string, DepthBlock[]> = {
  "hadley-heights": [
    {
      heading: "The brief behind the page",
      paragraphs: [
        "Hadley Heights is one and two bedroom apartments in Jumeirah Village Circle, from AED 1 million. JVC is one of the most competitive addresses in Dubai for off-plan: a buyer comparing it is looking at a dozen towers within the same few streets, at overlapping prices, all promising the same amenity list. A launch page in that market is not judged on how good it looks. It is judged on whether it answers a comparison faster than the next tab.",
        "So the page was built around one question: is this the right building for me, at the right price, in the right place. Everything that did not help answer that was cut, including the long-form lifestyle copy that usually opens a development page and that nobody comparing four towers actually reads.",
      ],
    },
    {
      heading: "Decisions that shaped it",
      paragraphs: [
        "The price qualifier sits in the hero rather than halfway down. Putting \"from AED 1 million\" above the fold loses clicks from people who were never going to buy, which looks like a worse page on a traffic report and produces a better cost per qualified lead. That trade is only worth making when the same person owns both the page and the campaign spending against it.",
        "Request a Callback became the single primary action, with the form short enough to complete on a phone in a lift. Every additional field on an off-plan enquiry form costs completions, and the fields that matter for a first conversation are name, phone and email. Qualification happens on the call, not in the form.",
        "Check Construction Progress sits as a clearly secondary route. Existing buyers arrive on the same page looking for updates, and without somewhere to go they either fill in the enquiry form and pollute the lead list, or they leave. Giving them their own path keeps the primary call to action clean for new traffic.",
      ],
    },
    {
      heading: "What was delivered",
      paragraphs: [
        "A full desktop landing page built for the launch, with the hero, the pricing and unit mix, the amenity set, the location context and the enquiry path. It was designed against the campaigns that would point at it rather than handed over for someone else to drive traffic to.",
        "Because the same person built the page and ran the campaign, the ad copy and the page opening say the same thing. That sounds trivial and is the most common leak in paid property marketing: the ad promises a price or a view, the page opens on something else, and the bounce is blamed on the audience.",
      ],
    },
  ],

  "weybridge-gardens": [
    {
      heading: "The brief behind the page",
      paragraphs: [
        "Weybridge Gardens is in Dubailand, a district that sells on value and space rather than on proximity, which changes what a launch page has to do. A buyer looking at Dubailand has usually already decided against the marina and the downtown premium, so the page is not competing on prestige. It is competing on whether the numbers make sense.",
        "That makes the location section load-bearing rather than decorative. Dubailand needs explaining in a way that Marina does not: what is nearby, how long the drive actually is, what is being built around it. A page that assumes the buyer already knows the area loses the people it was built for.",
      ],
    },
    {
      heading: "Decisions that shaped it",
      paragraphs: [
        "Registration was treated as the conversion rather than a brochure download. Gated PDFs generate volume and very little intent: people give an email to see a floor plan and never speak to anyone. Registering interest is a smaller number and a warmer one, and for an off-plan launch the pipeline matters more than the list size.",
        "The page was structured so the answer to each buyer question arrives in the order they ask it: where is it, what does it cost, what do I get, what happens next. Development pages are usually organised by what the developer wants to say, which is a different sequence entirely.",
      ],
    },
    {
      heading: "What was delivered",
      paragraphs: [
        "A launch landing page for the development, built as part of a wider engagement covering the LEOS corporate site and the campaign creative behind it. The full-page capture on this page is the delivered build.",
        "This was the first of two Weybridge launches. The second, Weybridge Gardens 2, took the same location in a completely different direction as the Provence Edition, and is documented separately.",
      ],
    },
    {
      heading: "Why two phases needed two different pages",
      paragraphs: [
        "LEOS launched Weybridge twice in the same district, and the second phase arrived as the Provence Edition with a French-inspired identity and a lower entry price. The temptation with a phase two is to reuse the phase one page and change the numbers, because it is faster and it looks consistent.",
        "That is usually the wrong call. A buyer who considered phase one and did not buy is being asked to look again, and an identical page tells them nothing has changed. A buyer arriving fresh at a AED 600,000 entry price is a different person from one who looked at the original. The two launches were treated as two launches, which is why the Provence Edition has its own case study rather than a paragraph appended to this one.",
      ],
    }
  ],

  "weybridge-gardens-2": [
    {
      heading: "The brief behind the page",
      paragraphs: [
        "The second Weybridge phase is 288 homes in Dubailand from AED 600,000, themed as the Provence Edition: French-inspired living, studios through three bedrooms. A themed launch is harder than a plain one, because the theme has to survive contact with the conversion path. Carry it too lightly and it reads as a marketing sticker; carry it too heavily and the page becomes a mood board that never asks for anything.",
        "The entry price is the other thing shaping this page. At AED 600,000 the audience is broader and more price-led than Hadley Heights, which means more traffic, less qualified, and a greater need to filter early rather than late.",
      ],
    },
    {
      heading: "Built twice, for two different devices",
      paragraphs: [
        "This is the launch where the mobile build was treated as its own design rather than a squeezed desktop layout. The hero crops to keep the tower and the development name legible at 366 pixels wide, and the registration button sits within thumb reach rather than below the fold. Both captures are on this page so the difference is visible.",
        "That matters commercially, not just aesthetically. Property traffic from paid social arrives overwhelmingly on phones. A desktop page compressed to a phone puts the primary action under three scrolls of lifestyle copy, and the conversion rate that follows gets blamed on the audience rather than the layout.",
      ],
    },
    {
      heading: "What was delivered",
      paragraphs: [
        "Desktop and mobile landing pages for the Provence Edition launch, with Register Your Interest as the single primary goal and the price qualifier placed high so unqualified traffic filters itself out before it costs a click.",
        "A secondary Check Construction Progress route gives existing buyers somewhere to go that does not compete with the registration form, the same pattern used on Hadley Heights and for the same reason.",
      ],
    },
    {
      heading: "One page, four different buyers",
      paragraphs: [
        "The unit mix runs from studios to three bedrooms, which means a single page has to work for an investor buying the smallest unit for yield and a family buying the largest to live in. Those two people want almost opposite things from the same screen: one wants the entry price and the rental context, the other wants room sizes and what is nearby for children.",
        "Rather than trying to speak to both at once and satisfying neither, the page leads with what they genuinely share, the location and the price floor, then lets the unit mix section do the separating. It is the section a visitor self-selects into, so it carries the detail that would clutter the hero.",
        "This is also why the price is stated as a floor rather than a range. \"From AED 600,000\" invites the investor in without misleading the family buyer, where a range spanning three bedroom pricing would filter out the studio audience the development mostly consists of.",
      ],
    }
  ],

  "cavendish-square": [
    {
      heading: "The brief behind the page",
      paragraphs: [
        "Cavendish Square is 138 homes in Jumeirah Village Triangle, and the unit mix decides everything about how it has to be sold: 114 studios and 24 one-bedroom apartments, from 428 to 1,209 square feet, with estimated completion in Q4 2025. That is an investor and first-purchase audience rather than a family one, and they buy on different evidence.",
        "At this size the shared space is the product. A 428 square foot studio is not sold on the floor plan, because every 428 square foot studio has broadly the same floor plan. It is sold on the rooftop garden, the outdoor cinema, the pool and the gym, and on the address. So the page leads with those rather than with interiors.",
      ],
    },
    {
      heading: "Decisions that shaped it",
      paragraphs: [
        "The page answers what a compact-unit buyer actually asks, in that order: where is it, how many homes, what sizes, when does it complete. Not the lifestyle opening a development page usually starts with. An investor comparing yields wants the numbers in the first screen, and a first-time buyer wants to know whether completion fits their plan.",
        "Register Your Interest sits in the hero with Check Construction Progress beneath it. Splitting the two is deliberate: buyers who have already committed have somewhere to go that does not compete with the registration form, which keeps the primary action clean for new traffic.",
        "The British and European architects and interior designers are stated rather than implied, because for an overseas investor buying off-plan in Dubai, who is building it is part of the risk assessment.",
      ],
    },
    {
      heading: "What was delivered",
      paragraphs: [
        "Desktop and mobile landing pages for the launch. The mobile build is a genuine rebuild rather than a compression: the hero crops to hold the building and the development name at 367 pixels, and both calls to action sit above the fold within thumb reach.",
        "Both captures are on this page in full. The mobile one is shown in a phone frame rather than cropped to a landscape box, because a 367 by 5,317 pixel capture cropped to 16:9 shows only a top strip that looks like any desktop page and tells you nothing about the work.",
      ],
    },
  ],
};
