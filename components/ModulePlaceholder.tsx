interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>
    </section>
  );
}
