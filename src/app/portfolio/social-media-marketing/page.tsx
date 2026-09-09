import DisciplinePage, { disciplineMetadata } from "@/components/DisciplinePage";

const SLUG = "social-media-marketing";

export const metadata = disciplineMetadata(SLUG);

export default function Page() {
  return <DisciplinePage slug={SLUG} />;
}
