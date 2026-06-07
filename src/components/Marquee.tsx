type Props = { items: string[] };

export function Marquee({ items }: Props) {
  if (!items?.length) return null;
  const loop = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-emerald text-emerald-foreground">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {loop.map((text, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2 text-sm font-medium">
            <span className="text-gold">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
