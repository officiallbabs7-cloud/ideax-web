import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(dir, name), "utf8");
const fill = (html, values) =>
  html.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in values ? values[key] : match
  );

// Fixed settings. If the site moves to a real domain, change APP_URL and run this again.
const APP_URL = "https://ideax-web-kohl.vercel.app";
const LOGO_URL = `${APP_URL}/logo-email.png`;
const fixed = { APP_URL, LOGO_URL };

// Anything written as {{LIKE_THIS}} is filled in by the backend for each user.
const emails = {
  welcome: {
    subject: "Welcome to IdeaX",
    heading: "Welcome to IdeaX, {{NAME}}",
    preheader: "Your account is ready. Here is how to get started.",
    body: "welcome-body.html",
    button: ["Browse services", `${APP_URL}/services`],
  },
  "request-submitted": {
    subject: "We received your request",
    heading: "We received your request",
    preheader: "Review your order and pay to start work.",
    body: "request-submitted-body.html",
    button: ["Review and pay", `${APP_URL}/orders/{{ORDER_ID}}`],
  },
  "payment-confirmed": {
    subject: "Payment received",
    heading: "Payment received",
    preheader: "We received your payment of {{AMOUNT}}.",
    body: "payment-confirmed-body.html",
    button: ["View order", `${APP_URL}/orders/{{ORDER_ID}}`],
  },
  "order-update": {
    subject: "An update on your request",
    heading: "{{HEADING}}",
    preheader: "{{MESSAGE}}",
    body: "order-update-body.html",
    button: ["View order", `${APP_URL}/orders/{{ORDER_ID}}`],
  },
  "reset-password": {
    subject: "Reset your IdeaX password",
    heading: "Reset your password",
    preheader: "Use this link to choose a new password.",
    body: "reset-password-body.html",
    button: null, // this email has its own button inside the body
  },
  "password-changed": {
    subject: "Your IdeaX password was changed",
    heading: "Your password was changed",
    preheader: "If this wasn't you, reset your password right away.",
    body: "notice-body.html",
    bodyValues: {
      MESSAGE:
        "The password for your IdeaX account was just changed. If this was you, no action is needed. If it wasn't, reset your password right away.",
    },
    button: ["Reset my password", `${APP_URL}/forgot-password`],
  },
};

mkdirSync(join(dir, "ready"), { recursive: true });
const report = [];

for (const [name, email] of Object.entries(emails)) {
  const body = fill(read(email.body), email.bodyValues || {});
  const button = email.button
    ? fill(read("button.html"), {
        BUTTON_TEXT: email.button[0],
        BUTTON_URL: email.button[1],
      })
    : "";
  const html = fill(read("layout.html"), {
    ...fixed,
    HEADING: email.heading,
    PREHEADER: email.preheader,
    BODY: body,
    BUTTON: button,
  });
  writeFileSync(join(dir, "ready", `${name}.html`), html);

  const tokens = [
    ...new Set([...html.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])),
  ];
  report.push({ name, subject: email.subject, tokens });
}

const readme = [
  "# IdeaX emails: ready to send",
  "",
  "Each file here is a COMPLETE email with all styles inline. Do not rebuild it in code.",
  "For each email:",
  "1. Read the file.",
  "2. Replace every {{TOKEN}} listed below with its value. HTML-encode user-provided values (names, request titles).",
  "3. Send it as an HTML email (IsBodyHtml = true, or HtmlBody), with the subject shown.",
  "",
  `The logo loads from ${LOGO_URL} . That address must open in a browser.`,
  "",
  "| File | Subject | Tokens to replace |",
  "|---|---|---|",
  ...report.map(
    (r) =>
      `| ${r.name}.html | ${r.subject} | ${
        r.tokens.map((t) => `{{${t}}}`).join(", ") || "none"
      } |`
  ),
  "",
  "Token meanings: NAME = the user's full name. ORDER_ID = request id. SERVICE = service name. TITLE = request title.",
  "TOTAL / AMOUNT = formatted amount such as ₦180,000. REFERENCE = Paystack reference. DATE = payment date.",
  "HEADING and MESSAGE = text of an order update. RESET_URL = the full reset link. EXPIRY = for example 1 hour.",
  "SUPPORT_EMAIL = our support address.",
];
writeFileSync(join(dir, "ready", "README.md"), readme.join("\n"));

for (const r of report) {
  console.log(`${r.name}.html  ->  ${r.tokens.join(", ") || "no tokens"}`);
}
console.log("\nDone. The files are in email-templates/ready/");