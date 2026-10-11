import { Mail, MapPin, ExternalLink } from "lucide-react";
import SectionHeading from "./SectionHeading.jsx";
import { LEGAL } from "../../lib/legal.js";

const ready = (value) => Boolean(value) && !value.startsWith("[");

export default function Contact() {
  const hasEmail = ready(LEGAL.email);
  const hasAddress = ready(LEGAL.address);

  // Opens Google Maps with the address searched
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    LEGAL.address
  )}`;

  return (
    <section id="contact" className="scroll-mt-24 bg-white">
      <div className="px-4 py-14 md:px-8 md:py-20">
        <SectionHeading
          label="Contact"
          title="Let's talk about your idea"
          text="Questions about a service or an order? Reach out and we'll get back to you."
        />

        <div className="mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Mail size={24} />
            </span>
            <h3 className="mt-4 text-lg font-bold">Email us</h3>
            {hasEmail ? (
              <a
                href={`mailto:${LEGAL.email}`}
                className="mt-1 block break-all text-brand hover:underline"
              >
                {LEGAL.email}
              </a>
            ) : (
              <p className="mt-1 text-gray-500">Contact details coming soon.</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <MapPin size={24} />
            </span>
            <h3 className="mt-4 text-lg font-bold">Find us</h3>
            {hasAddress ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                className="mt-1 inline-flex items-start gap-1.5 text-brand hover:underline"
              >
                <span>{LEGAL.address}</span>
                <ExternalLink size={14} className="mt-1.5 shrink-0" />
              </a>
            ) : (
              <p className="mt-1 text-gray-600">Address coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}