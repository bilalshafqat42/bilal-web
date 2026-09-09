import DisciplinePage, { disciplineMetadata } from "@/components/DisciplinePage";

const SLUG = "web-development";

export const metadata = disciplineMetadata(SLUG);

export default function Page() {
  return <DisciplinePage slug={SLUG} />;
}
