import LegalPage from "../components/layout/LegalPage.jsx";
import { LEGAL } from "../lib/legal.js";

const sections = [
  {
    title: "Who we are",
    blocks: [
      `${LEGAL.brand} is operated by ${LEGAL.company}, ${LEGAL.address}. We are responsible for the personal information we collect about you, and we handle it in line with the Nigeria Data Protection Act 2023. You can reach us at ${LEGAL.email}.`,
    ],
  },
  {
    title: "Information we collect",
    blocks: [
      [
        "Account information: your full name, email address and password. Your password is stored in a protected (hashed) form.",
        "Request information: the service you choose, your request title and description, and your preferred deadline. If we add file uploads, the files you attach as well.",
        "Payment information: payments are handled by Paystack. We receive a confirmation with details such as the transaction reference, amount, status and payment method type. We do not see or store your full card number or PIN.",
        "Technical information: basic data such as your browser, device and IP address, collected through standard server logs, plus cookies or browser storage that keep you signed in.",
        "Messages: what you send us when you contact support.",
      ],
    ],
  },
  {
    title: "How we use your information",
    blocks: [
      [
        "To create and manage your account.",
        "To receive, process and deliver your service requests.",
        "To process payments and confirm your orders.",
        "To send you emails about your account and orders, such as sign-up, service selection and payment confirmation.",
        "To give you support and answer your questions.",
        "To keep IdeaX secure and prevent fraud or abuse.",
        "To improve our platform and services.",
        "To meet our legal and accounting obligations.",
      ],
      "We rely on the following lawful bases: to perform our agreement with you, your consent where we ask for it, our legitimate interests in running and securing IdeaX, and compliance with the law.",
    ],
  },
  {
    title: "Emails",
    // TEAM: confirm whether marketing emails will be sent
    blocks: [
      "We send service emails that are needed to run your account and orders. We will not send you marketing emails unless you agree to receive them, and you can opt out at any time.",
    ],
  },
  {
    title: "Who we share information with",
    blocks: [
      "We do not sell your personal information. We share it only where needed:",
      [
        "Paystack, to process your payments.",
        "Our email, hosting and infrastructure providers, to run IdeaX and send notifications.",
        "Team members and professionals working on your order, who only see what they need.",
        "Authorities or regulators, where the law requires it.",
        "A successor business, if IdeaX is ever sold or merged, with the same protections for your information.",
      ],
    ],
  },
  {
    title: "Transfers outside Nigeria",
    blocks: [
      "Some of our service providers may store or process information outside Nigeria. When that happens, we take steps to make sure your information stays protected, as the Nigeria Data Protection Act requires.",
    ],
  },
  {
    title: "How long we keep your information",
    blocks: [
      `We keep your information while your account is active and as long as we need it to provide our services. We keep records of orders and payments for ${LEGAL.retentionYears} years, or longer where the law requires, for accounting and legal purposes. When information is no longer needed, we delete or anonymise it.`,
    ],
  },
  {
    title: "How we protect your information",
    blocks: [
      "We use reasonable technical and organisational measures to protect your information, including encrypted connections (HTTPS), protected password storage and limited access for our team. No system is completely secure, so we cannot promise absolute security, but we take your privacy seriously.",
    ],
  },
  {
    title: "Your rights",
    blocks: [
      "Under the Nigeria Data Protection Act 2023, you have the right to:",
      [
        "ask for a copy of the personal information we hold about you;",
        "ask us to correct information that is wrong or incomplete;",
        "ask us to delete your information, unless we must keep it by law;",
        "ask us to restrict, or object to, how we use your information;",
        "receive your information in a commonly used format;",
        "withdraw your consent at any time, without affecting what we did before you withdrew it.",
      ],
      `To use any of these rights, email us at ${LEGAL.email}. We may need to confirm your identity first. If you are not happy with how we handle your information, you also have the right to complain to the Nigeria Data Protection Commission.`,
    ],
  },
  {
    title: "Children",
    blocks: [
      "IdeaX is for people aged 18 and over. We do not knowingly collect information from children. If you think a child has given us their information, contact us and we will delete it.",
    ],
  },
  {
    title: "Cookies and browser storage",
    blocks: [
      "We use cookies and similar browser storage only for essential purposes, such as keeping you signed in and making the site work. If we add analytics or advertising tools in the future, we will update this policy and, where required, ask for your consent.",
    ],
  },
  {
    title: "Changes to this policy",
    blocks: [
      "We may update this Privacy Policy from time to time. When we make an important change, we will let you know by email or on IdeaX. The date at the top shows when it was last updated.",
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

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LEGAL.lastUpdated}
      intro={`Your privacy matters to us. This Privacy Policy explains what personal information ${LEGAL.brand} collects, how we use it, who we share it with, and the choices you have.`}
      sections={sections}
      otherLink={{ to: "/terms", label: "Read our Terms of Service" }}
    />
  );
}