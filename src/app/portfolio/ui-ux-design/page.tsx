import DisciplinePage, { disciplineMetadata } from "@/components/portfolio/DisciplinePage";

const SLUG = "ui-ux-design";

export const metadata = disciplineMetadata(SLUG);

export default function Page() {
  return <DisciplinePage slug={SLUG} />;
}
