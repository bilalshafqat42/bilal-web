/**
 * Training / course pages carried over from the previous WordPress site so
 * their URLs, titles, and keyword content survive the migration.
 *
 * Content is ported from the live pages with three deliberate corrections,
 * flagged to Bilal rather than published as-is:
 *  1. Both course pages previously shared identical copy (duplicate content,
 *     bad for SEO) — the frontend course now describes frontend fundamentals
 *     and the React course describes React specifically.
 *  2. Graphic-design copy that had been pasted into the React course page
 *     ("Basic Graphic Designing", Adobe Illustrator/Photoshop intro) removed.
 *  3. A stale fee ("20,000 PKR") and expired enrolment deadline
 *     ("15 April 2024") removed — these need current values from Bilal.
 */

export type CourseModule = {
  number: string;
  title: string;
  body: string;
};

export type Course = {
  slug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  modules: CourseModule[];
  outcomes: string[];
  whyMe: string[];
};

export const courses: Course[] = [
  {
    slug: "react-js-development-course",
    eyebrow: "Training",
    title: "React JS Development Course",
    seoTitle: "React Js Development Course - Bilal Shafqat",
    seoDescription:
      "Learn React.js from setup to deployment: components, hooks, state management, React Router, styling, API calls, Context API, and Redux. Taught one-to-one by a working developer.",
    intro:
      "A practical, project-led React course taught by someone who builds production React applications for clients, not a pre-recorded curriculum. You start from environment setup and JSX and finish by deploying a working application.",
    modules: [
      { number: "01", title: "Introduction to React.js", body: "Learn what React.js is, how to set up a development environment, create a basic application, and understand JSX syntax." },
      { number: "02", title: "Components in React", body: "Understanding React components, passing data between them using props, and handling events." },
      { number: "03", title: "State Management", body: "Introduction to managing state in React using the state hook, handling form data, and working with multiple form inputs." },
      { number: "04", title: "Handling Forms and User Input", body: "Creating controlled components for input, managing form submission and validation, and using state to handle multiple inputs." },
      { number: "05", title: "React Router for Navigation", body: "Set up and manage routes with React Router. Create nested routes and route parameters, and navigate between pages using links." },
      { number: "06", title: "Styling in React", body: "Styling options in React including CSS-in-JS libraries like styled-components, CSS modules for scoped styling, and integration with Bootstrap or Tailwind CSS." },
      { number: "07", title: "Asynchronous Data Fetching", body: "Making API calls in React apps using Fetch or Axios, handling async operations with the useEffect hook, and displaying data in components." },
      { number: "08", title: "Managing Global State with Context API", body: "Use the Context API for state management. Create and consume contexts, manage global state, and apply context to theming or user authentication." },
      { number: "09", title: "Introduction to Redux", body: "Redux core principles, setting it up in a React application, and updating state by dispatching actions." },
      { number: "10", title: "Deployment and Next Steps", body: "Prepare and deploy React applications to production platforms like Netlify or Vercel, plus resources for continuing your React development." },
    ],
    outcomes: [
      "Build and deploy a complete React application from scratch",
      "Understand hooks, props, and component composition properly",
      "Manage both local and global application state with confidence",
      "Consume APIs and handle asynchronous data correctly",
    ],
    whyMe: [
      "Direct learning from a working developer, not a pre-recorded course",
      "Flexible online or in-person sessions around your schedule",
      "Portfolio and career guidance built into the course",
    ],
  },
  {
    slug: "frontend-development-course",
    eyebrow: "Training",
    title: "Frontend Development Course",
    seoTitle: "Frontend Development Course - Bilal Shafqat",
    seoDescription:
      "Front-end development focused on the user interface and interactive elements of websites and web applications: HTML5, CSS3, responsive layouts, JavaScript, and modern frameworks.",
    intro:
      "Front-end development is the part of web development that focuses on the user interface and the interactive elements of websites and web applications. This course takes you from writing your first HTML page through to building responsive, interactive interfaces you can hand to a client.",
    modules: [
      { number: "01", title: "HTML5 Foundations", body: "Semantic HTML structure, forms, accessibility basics, and how to mark up a page so both browsers and search engines understand it." },
      { number: "02", title: "CSS3 & Modern Layout", body: "Core CSS, the box model, and modern layout with Flexbox and Grid rather than outdated float-based techniques." },
      { number: "03", title: "Responsive & Mobile-First Design", body: "Building mobile-first layouts that adapt cleanly across phone, tablet, and desktop breakpoints." },
      { number: "04", title: "Bootstrap & Utility Frameworks", body: "Using Bootstrap and utility-first CSS to build consistent interfaces quickly without rewriting the same styles each time." },
      { number: "05", title: "BEM & Scalable CSS", body: "Structuring stylesheets with BEM naming so a growing codebase stays maintainable instead of turning into specificity conflicts." },
      { number: "06", title: "JavaScript Essentials", body: "The JavaScript you actually need for the front end: the DOM, events, functions, arrays and objects, and asynchronous basics." },
      { number: "07", title: "Working with APIs", body: "Fetching and displaying data from an API, handling loading and error states, and understanding how the front end talks to a backend." },
      { number: "08", title: "Version Control & Deployment", body: "Using Git for version control, and deploying a finished front end to live hosting." },
    ],
    outcomes: [
      "Build a complete, responsive website from scratch",
      "Write maintainable, well-structured HTML and CSS",
      "Add real interactivity with JavaScript",
      "Confidently amend and extend an existing codebase",
    ],
    whyMe: [
      "Direct learning from a working developer, not a pre-recorded course",
      "Flexible online or in-person sessions around your schedule",
      "Portfolio and career guidance built into the course",
    ],
  },
  {
    slug: "graphic-designing-course",
    eyebrow: "Training",
    title: "Web & Graphic Design Course",
    seoTitle: "Graphic Designing Course - Bilal Shafqat",
    seoDescription:
      "Turn your vision into stunning visuals and websites with a comprehensive, personalised course covering design principles, Adobe Creative Suite, Figma, and web design.",
    intro:
      "Learn how to turn ideas into visual designs that work across print, social, and the web. You will cover design fundamentals, become proficient in the Adobe Creative Suite and Figma, and build real projects with personal feedback at every stage.",
    modules: [
      { number: "01", title: "Design Principles", body: "Colour theory, typography, and layout, including the psychology of design and how to create visually harmonious compositions." },
      { number: "02", title: "Adobe Creative Mastery", body: "Hands-on experience with Photoshop, Illustrator, and InDesign, working through each tool and feature with a focus on practical application." },
      { number: "03", title: "Logo Design & Brand Identity", body: "Designing logos and building a consistent brand identity that holds up across every medium it appears in." },
      { number: "04", title: "Typography", body: "Selecting and arranging typefaces to improve readability and carry the intended tone or message." },
      { number: "05", title: "Layout, Banner & Print Design", body: "Designing banners, brochures, and print-ready layouts, including print design guidelines and preparing files for production." },
      { number: "06", title: "Image Editing & Vector Graphics", body: "Editing and retouching images, and creating scalable vector graphics for logos and illustration work." },
      { number: "07", title: "Social Media Design", body: "Designing banners and posts for Facebook, Instagram, LinkedIn, and other social channels." },
      { number: "08", title: "Web Design Techniques", body: "The essentials of user-friendly web design, creating designs that are not only attractive but intuitive and accessible." },
      { number: "09", title: "Real-World Projects", body: "Projects that mirror real client scenarios: logos, brochures, and website layouts, with personalised feedback on each." },
    ],
    outcomes: [
      "Turn a brief into finished, professional visual designs",
      "Work confidently in Photoshop, Illustrator, and Figma",
      "Design for print, outdoor, social, and web",
      "Build a portfolio strong enough to win client work",
    ],
    whyMe: [
      "Direct learning from an expert with years of hands-on design experience",
      "Flexible and personalised: online or in-person, around your schedule",
      "Career path guidance on building a portfolio and navigating the job market",
      "Networking opportunities with other creatives on the course",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
