import LegalPage from "../components/layout/LegalPage.jsx";
import { LEGAL } from "../lib/legal.js";

const sections = [
  {
    title: "About IdeaX",
    blocks: [
      `${LEGAL.brand} is an online platform operated by ${LEGAL.company} ("we", "us", "our"). It lets you browse technology and design services (such as software engineering, product design and UI/UX design), submit a request describing what you need, pay for it, and have the work carried out by our team and the professionals we work with.`,
    ],
  },
  {
    title: "Your account",
    blocks: [
      "To use IdeaX you must create an account. You must be at least 18 years old and provide accurate, complete information.",
      [
        "Keep your password confidential. You are responsible for everything that happens under your account.",
        "Tell us immediately if you think someone else has accessed your account.",
        "One person should not share an account with others.",
      ],
    ],
  },
  {
    title: "Our services and your requests",
    blocks: [
      "Each service on IdeaX has a description and a price. When you select a service, you describe what you need by giving a title, a description and, optionally, a preferred deadline.",
      [
        "We may contact you by email to clarify your request.",
        "We may decline, or ask you to change, a request that is unclear, unlawful, or outside the scope of the service.",
        "A deadline you give is a preference. It becomes a commitment only if we confirm it in writing.",
        "We may add, change or remove services and prices from time to time. A change never affects an order you have already paid for.",
      ],
    ],
  },
  {
    title: "Pricing and payment",
    blocks: [
      "All prices are shown in Nigerian Naira (₦). The price for your order is shown on your order summary before you pay.",
      [
        "Payment is required in full before work on your order starts.",
        "Payments are processed by Paystack, a third-party payment provider. We never see or store your full card details.",
        "Work begins once your payment has been confirmed. If a payment fails or is not confirmed, your order stays unpaid and work does not start.",
      ],
    ],
  },
  {
    title: "Cancellations and refunds",
    // TEAM: confirm these refund terms before launch
    blocks: [
      "Because work only starts after payment, please read your order summary carefully before you pay.",
      [
        "If you cancel before work has started, you are entitled to a full refund.",
        "If you cancel after work has started, we may keep a fair portion of the payment for the work already done and refund the rest.",
        "If we are unable to deliver the service you paid for, you are entitled to a full refund.",
        `Approved refunds are returned to your original payment method within ${LEGAL.refundDays} business days. Your bank or Paystack may need extra time to process them.`,
      ],
      `To request a refund, email us at ${LEGAL.email} with your order number.`,
    ],
  },
  {
    title: "Your content and ownership",
    // TEAM: confirm ownership of deliverables before launch
    blocks: [
      "You keep ownership of the ideas, materials and information you give us. You allow us to use them only to deliver your order.",
      [
        "Once you have paid in full for an order, you own the final deliverables for that order.",
        "Third-party and open-source components remain under their own licences.",
        "We keep ownership of our pre-existing tools, templates and know-how.",
        "We will not publicly show your project, for example in a portfolio, without your permission.",
      ],
    ],
  },
  {
    title: "Confidentiality of your ideas",
    blocks: [
      "We treat the details of your requests as confidential. We share them only with team members and professionals who need them to deliver your order, and who are bound to keep them confidential.",
    ],
  },
  {
    title: "Acceptable use",
    blocks: [
      "You agree not to:",
      [
        "submit requests that are unlawful, fraudulent, harmful or that infringe someone else's rights;",
        "ask us to build malware, scams, or anything designed to deceive or harm people;",
        "attempt to hack, disrupt, scrape or reverse-engineer IdeaX;",
        "use IdeaX to harass or abuse our team or other users;",
        "provide false information or impersonate someone else.",
      ],
    ],
  },
  {
    title: "Emails and notifications",
    blocks: [
      "We send you emails about your account and orders, for example when you sign up, when you select a service, and when your payment is confirmed. These messages are part of the service.",
    ],
  },
  {
    title: "Third-party services",
    blocks: [
      "IdeaX relies on third-party providers such as Paystack for payments, an email provider for notifications, and hosting providers. Their own terms apply when you use their services, and we are not responsible for their systems.",
    ],
  },
  {
    title: "Disclaimers",
    blocks: [
      "To the extent the law allows, IdeaX is provided \"as is\". We work hard to keep it running, but we do not promise it will always be available or error-free. We also cannot guarantee business results from the work we deliver, such as sales, users or funding.",
    ],
  },
  {
    title: "Limitation of liability",
    blocks: [
      "To the extent the law allows, we are not liable for indirect or consequential loss, including loss of profit, revenue, data or opportunity. Our total liability for any claim connected to an order is limited to the amount you paid for that order.",
      "Nothing in these Terms limits any liability that cannot lawfully be limited.",
    ],
  },
  {
    title: "Suspension and ending your account",
    blocks: [
      "We may suspend or close your account if you break these Terms or misuse IdeaX. You can ask us to close your account at any time by emailing us. Orders already in progress are handled under the cancellations and refunds section above.",
    ],
  },
  {
    title: "Changes to these Terms",
    blocks: [
      "We may update these Terms from time to time. When we make an important change, we will notify you by email or on IdeaX. If you keep using IdeaX after a change, you accept the updated Terms.",
    ],
  },
  {
    title: "Governing law and disputes",
    // TEAM: confirm the governing court with a lawyer
    blocks: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria. If you have a complaint, please contact us first so we can try to resolve it informally. If we cannot, the courts of Lagos State have jurisdiction.",
    ],
  },
  {
    title: "Contact us",
    blocks: [
      `${LEGAL.company}, ${LEGAL.address}`,
      `Email: ${LEGAL.email}`,
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LEGAL.lastUpdated}
      intro={`Welcome to ${LEGAL.brand}. These Terms of Service ("Terms") explain the rules for using our website and services. Please read them carefully. By creating an account or using ${LEGAL.brand}, you agree to these Terms and to our Privacy Policy.`}
      sections={sections}
      otherLink={{ to: "/privacy", label: "Read our Privacy Policy" }}
    />
  );
}