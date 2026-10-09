import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(dir, name), "utf8");
const fill = (html, values) =>
  html.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in values ? values[key] : match
  );

// The logo is embedded in the preview so it shows in any browser.
// (Real emails use the hosted address: APP_URL + "/logo-email.png")
const logoPath = join(dir, "..", "public", "logo-email.png");
let LOGO_URL = "";
if (existsSync(logoPath)) {
  const png = readFileSync(logoPath);
  console.log(`Logo found: ${png.length} bytes`);
  LOGO_URL = `data:image/png;base64,${png.toString("base64")}`;
} else {
  console.warn(`Logo NOT found at ${logoPath}`);
}

const APP_URL = "https://ideax-web-kohl.vercel.app";
const common = {
  APP_URL,
  LOGO_URL,
  SUPPORT_EMAIL: "support@yourdomain.com",
};

const order = {
  ORDER_ID: "ORD-1791357162621",
  SERVICE: "Frontend Engineering",
  TITLE: "Website for cooking eba",
};

const emails = {
  welcome: {
    heading: "Welcome to IdeaX, Boluwatife",
    preheader: "Your account is ready. Here is how to get started.",
    body: "welcome-body.html",
    values: {},
    button: ["Browse services", `${APP_URL}/services`],
  },
  "request-submitted": {
    heading: "We received your request",
    preheader: "Review your order and pay to start work.",
    body: "request-submitted-body.html",
    values: { ...order, TOTAL: "₦180,000" },
    button: ["Review and pay", `${APP_URL}/orders/${order.ORDER_ID}`],
  },
  "payment-confirmed": {
    heading: "Payment received",
    preheader: "We received your payment of ₦180,000.",
    body: "payment-confirmed-body.html",
    values: {
      ...order,
      AMOUNT: "₦180,000",
      REFERENCE: "PSK-1791357200000",
      DATE: "9 October 2026",
    },
    button: ["View order", `${APP_URL}/orders/${order.ORDER_ID}`],
  },
  "order-update": {
    heading: "Work has started",
    preheader: "Our team has started working on your request.",
    body: "order-update-body.html",
    values: { ...order, MESSAGE: "Our team has started working on your request." },
    button: ["View order", `${APP_URL}/orders/${order.ORDER_ID}`],
  },
  "reset-password": {
    heading: "Reset your password",
    preheader: "Use this link to choose a new password.",
    body: "reset-password-body.html",
    values: {
      RESET_URL: `${APP_URL}/reset-password?token=SAMPLE-TOKEN&email=boluwatife%40example.com`,
      EXPIRY: "1 hour",
    },
    button: null, // this email has its own button inside the body
  },
  "password-changed": {
    heading: "Your password was changed",
    preheader: "If this wasn't you, reset your password right away.",
    body: "notice-body.html",
    values: {
      MESSAGE:
        "The password for your IdeaX account was just changed. If this was you, no action is needed. If it wasn't, reset your password right away.",
    },
    button: ["Reset my password", `${APP_URL}/forgot-password`],
  },
};

mkdirSync(join(dir, "preview"), { recursive: true });

for (const [name, email] of Object.entries(emails)) {
  const body = fill(read(email.body), email.values);
  const button = email.button
    ? fill(read("button.html"), {
        BUTTON_TEXT: email.button[0],
        BUTTON_URL: email.button[1],
      })
    : "";
  const html = fill(read("layout.html"), {
    ...common,
    HEADING: email.heading,
    PREHEADER: email.preheader,
    BODY: body,
    BUTTON: button,
  });
  writeFileSync(join(dir, "preview", `${name}.html`), html);
}

console.log("Done. Open the files in email-templates/preview/ in your browser.");