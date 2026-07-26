const bars = [
  [40, 70, 45, 90, 60, 100, 75],
  [55, 35, 80, 50, 95, 65, 40],
  [30, 60, 85, 45, 70, 55, 95],
];

export default function DashboardGraphic({ variant = 0 }: { variant?: number }) {
  const data = bars[variant % bars.length];
  return (
    <div className="relative h-full w-full rounded-2xl border border-border bg-gradient-to-br from-surface to-bg-soft p-6 overflow-hidden">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet/15 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-violet/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted">Campaign Performance</span>
      </div>

      <div className="relative mt-8 flex items-end gap-2.5 h-32">
        {data.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-gold/70 to-gold-2/40"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-3">
        {["Reach", "Leads", "Conversion"].map((label) => (
          <div key={label} className="rounded-xl border border-border bg-bg/40 p-3 text-center">
            <span className="h-1.5 w-1.5 mx-auto block rounded-full bg-gold/70 mb-2" />
            <p className="text-[10px] text-muted uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
