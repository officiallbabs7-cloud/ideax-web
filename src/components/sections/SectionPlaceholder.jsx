export default function SectionPlaceholder({ id, title, tint = false }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 min-h-[80vh] px-4 md:px-8 py-16 ${
        tint ? "bg-brand/5" : "bg-white"
      }`}
    >
      <h2 className="text-3xl md:text-5xl font-extrabold">{title}</h2>
      <p className="mt-3 text-gray-500">This section is coming soon.</p>
    </section>
  );
}