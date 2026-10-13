# IdeaX emails: ready to send

Each file here is a COMPLETE email with all styles inline. Do not rebuild it in code.
For each email:
1. Read the file.
2. Replace every {{TOKEN}} listed below with its value. HTML-encode user-provided values (names, request titles).
3. Send it as an HTML email (IsBodyHtml = true, or HtmlBody), with the subject shown.

The logo loads from https://ideax-web-kohl.vercel.app/logo-email.png . That address must open in a browser.

| File | Subject | Tokens to replace |
|---|---|---|
| welcome.html | Welcome to IdeaX | {{NAME}}, {{SUPPORT_EMAIL}} |
| request-submitted.html | We received your request | {{ORDER_NUMBER}}, {{SERVICE}}, {{TITLE}}, {{TOTAL}}, {{ORDER_ID}}, {{SUPPORT_EMAIL}} |
| payment-confirmed.html | Payment received | {{AMOUNT}}, {{ORDER_NUMBER}}, {{SERVICE}}, {{REFERENCE}}, {{DATE}}, {{ORDER_ID}}, {{SUPPORT_EMAIL}} |
| order-update.html | An update on your request | {{HEADING}}, {{MESSAGE}}, {{ORDER_NUMBER}}, {{SERVICE}}, {{TITLE}}, {{ORDER_ID}}, {{SUPPORT_EMAIL}} |
| reset-password.html | Reset your IdeaX password | {{RESET_URL}}, {{EXPIRY}}, {{SUPPORT_EMAIL}} |
| password-changed.html | Your IdeaX password was changed | {{SUPPORT_EMAIL}} |

Token meanings: NAME = the user's full name. ORDER_ID = request id. SERVICE = service name. TITLE = request title.
TOTAL / AMOUNT = formatted amount such as ₦180,000. REFERENCE = Paystack reference. DATE = payment date.
HEADING and MESSAGE = text of an order update. RESET_URL = the full reset link. EXPIRY = for example 1 hour.
SUPPORT_EMAIL = our support address.