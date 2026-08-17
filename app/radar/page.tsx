import { getAllRadarItems } from "@/lib/radar";
import RadarSearch from "@/components/RadarSearch";

export const metadata = { title: "Radar" };

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const items = getAllRadarItems();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">Radar</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        AI &amp; open-source projects worth your time, added daily.
      </p>

      <div className="mt-8">
        <RadarSearch items={items} initialTag={tag} />
      </div>
    </div>
  );
}
