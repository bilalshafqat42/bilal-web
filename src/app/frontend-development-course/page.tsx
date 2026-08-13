import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoursePage from "@/components/CoursePage";
import { getCourseBySlug } from "@/data/courses";

const course = getCourseBySlug("frontend-development-course");

export const metadata: Metadata = {
  title: course?.seoTitle ?? "Course — Bilal Shafqat",
  description: course?.seoDescription ?? "",
  alternates: { canonical: "/frontend-development-course/" },
};

export default function Page() {
  if (!course) notFound();
  return <CoursePage course={course} />;
}
