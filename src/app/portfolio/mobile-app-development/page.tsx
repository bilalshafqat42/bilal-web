import DisciplinePage, { disciplineMetadata } from "@/components/DisciplinePage";

const SLUG = "mobile-app-development";

export const metadata = disciplineMetadata(SLUG);

export default function Page() {
  return <DisciplinePage slug={SLUG} />;
}
