export default function SectionHeading({ label, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-bold uppercase tracking-wide text-brand">
        {label}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
}