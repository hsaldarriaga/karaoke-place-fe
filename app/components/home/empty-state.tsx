export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm shadow-black/5">
      <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </div>
  );
}
