interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-blue-950">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>
    </section>
  );
}
