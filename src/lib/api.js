const API_URL = import.meta.env.VITE_API_URL;

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const KEY = "mock_user";
const ORDERS_KEY = "mock_orders";
const PAYMENTS_KEY = "mock_payments";
const USER_KEY = "ideax_user";
const PAYREF_KEY = "ideax_payment_refs";
const PAYING_KEY = "ideax_paying_order";

// Services come from the real backend when the whole app is real,
// or when VITE_REAL_SERVICES=true (so areas can be connected one at a time)
const REAL_SERVICES =
  !USE_MOCK || import.meta.env.VITE_REAL_SERVICES === "true";

// Sign-up and login use the real backend when the whole app is real,
// or when VITE_REAL_AUTH=true
const REAL_AUTH = !USE_MOCK || import.meta.env.VITE_REAL_AUTH === "true";

// Creating requests and paying use the real backend when VITE_REAL_PAYMENTS=true.
// (Needs real login and real services too.)
const REAL_ORDERS =
  !USE_MOCK || import.meta.env.VITE_REAL_PAYMENTS === "true";

// TEAM: confirm these numbers with the backend engineer (Models > category)
const CATEGORY_NAMES = {
  0: "Software Engineering",
  1: "Product Design",
  2: "Research and Development",
  3: "Business Ventures",
};

function iconFor(name = "") {
  const n = name.toLowerCase();
  if (n.includes("front")) return "monitor";
  if (n.includes("back")) return "server";
  if (n.includes("mobile")) return "mobile";
  if (n.includes("thinking") || n.includes("ideation")) return "lightbulb";
  if (n.includes("ui/ux") || n.includes("ux") || n.includes("design")) return "pen";
  if (n.includes("manage")) return "clipboard";
  if (n.includes("startup") || n.includes("venture")) return "rocket";
  return "code";
}

function fromApiService(s) {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    category:
      typeof s.category === "number"
        ? CATEGORY_NAMES[s.category] || "Other services"
        : s.category,
    icon: iconFor(s.name),
    price: s.price,
  };
}

const TOKEN_KEY = "ideax_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token
    ? localStorage.setItem(TOKEN_KEY, token)
    : localStorage.removeItem(TOKEN_KEY);

async function request(path, options = {}) {
  const token = getToken();
  let res;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    console.error("Network or CORS error:", err);
    throw {
      message:
        "We couldn't reach the server. Check your connection and try again.",
    };
  }

  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }

  if (res.status === 401 && token && !path.startsWith("/api/Account/")) {
    throw {
      message: "Your session has expired. Please log in again.",
      status: 401,
    };
  }

  const failed = !res.ok || (json && json.success === false);
  if (failed) {
    const details =
      Array.isArray(json.errors) && json.errors.length
        ? json.errors.join(" ")
        : "";
    throw {
      message:
        details || json.message || json.title || `Request failed (${res.status})`,
      status: res.status,
    };
  }

  return json;
}

function readJson(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function readOrders() {
  return readJson(ORDERS_KEY, []);
}

function saveOrders(list) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
}

function readPayments() {
  return readJson(PAYMENTS_KEY, {});
}

// ---------- Auth helpers (real backend) ----------
function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

const pick = (obj, keys) => {
  if (!obj || typeof obj !== "object") return null;
  for (const k of keys) if (obj[k]) return obj[k];
  return null;
};

const CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/";

// Works out the token and the user from the server's reply, whatever
// its exact shape (we only knew the wrapper: success, message, data)
function extractAuth(res, fallbackEmail, nameHint) {
  const d = res?.data ?? res ?? {};
  const token =
    pick(d, ["token", "accessToken", "access_token", "jwt", "jwtToken"]) ||
    pick(res, ["token", "accessToken", "access_token"]);
  const u = d.user || d.profile || d.account || d;
  const claims = token ? decodeJwt(token) : null;

  let name =
    pick(u, ["fullName", "fullname", "displayName", "name"]) ||
    pick(claims, ["fullName", "full_name", "name", `${CLAIM}givenname`, "given_name", "unique_name"]);
  const email =
    pick(u, ["email", "userName"]) ||
    pick(claims, ["email", `${CLAIM}emailaddress`]) ||
    fallbackEmail;

  if (!name || String(name).includes("@")) {
    name = nameHint || String(email || "User").split("@")[0];
  }

  const id =
    pick(u, ["id", "userId"]) ||
    pick(claims, ["sub", "nameid", `${CLAIM}nameidentifier`]) ||
    email;

  return { token, user: { id, name, email } };
}

function clearAuth() {
  setToken(null);
  localStorage.removeItem(USER_KEY);
}

// ---------- Auth ----------
export async function login(data) {
  if (!REAL_AUTH) {
    await wait(600);
    const user = { id: 1, name: "Test User", email: data.email };
    localStorage.setItem(KEY, JSON.stringify(user));
    return { success: true, user };
  }

  const res = await request("/api/Account/login", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      rememberMe: !!data.remember,
    }),
  });

  // Temporary: shows the shape of the reply (the token itself is hidden)
  console.info(
    "Login response shape:",
    JSON.stringify(res, (k, v) => (/token/i.test(k) ? "[hidden]" : v))
  );

  const { token, user } = extractAuth(res, data.email, data.nameHint);
  if (!token) {
    console.warn("No token found in the login response.");
  }
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export async function signup(data) {
  if (!REAL_AUTH) {
    await wait(600);
    const user = { id: 1, name: data.name, email: data.email };
    localStorage.setItem(KEY, JSON.stringify(user));
    return { success: true, user };
  }

  await request("/api/Account/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: data.name,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.password,
    }),
  });

  // The register endpoint doesn't return a session, so sign the user in
  return login({
    email: data.email,
    password: data.password,
    remember: true,
    nameHint: data.name,
  });
}

export async function getMe() {
  if (!REAL_AUTH) {
    const user = JSON.parse(localStorage.getItem(KEY));
    if (!user) throw { message: "Not logged in" };
    return { success: true, user };
  }

  const user = readJson(USER_KEY);
  if (!user) throw { message: "Not logged in" };

  const token = getToken();
  const claims = token ? decodeJwt(token) : null;
  if (claims?.exp && claims.exp * 1000 < Date.now()) {
    clearAuth();
    throw { message: "Your session has expired. Please log in again." };
  }
  return { success: true, user };
}

export async function logout() {
  if (!REAL_AUTH) {
    localStorage.removeItem(KEY);
    return { success: true };
  }
  clearAuth();
  return { success: true };
}


const MOCK_SERVICES = [
  {
    id: "backend-engineering",
    category: "Software Engineering",
    name: "Backend Engineering",
    description:
      "APIs, databases and server logic that power your product behind the scenes.",
    icon: "server",
    price: 200000,
  },
  {
    id: "frontend-engineering",
    category: "Software Engineering",
    name: "Frontend Engineering",
    description:
      "Fast, responsive websites and web apps that people enjoy using.",
    icon: "monitor",
    price: 180000,
  },
  {
    id: "mobile-engineering",
    category: "Software Engineering",
    name: "Mobile Engineering",
    description:
      "Android and iOS apps built to give your users a smooth experience.",
    icon: "mobile",
    price: 350000,
  },
  {
    id: "ui-ux-design",
    category: "Product Design",
    name: "UI/UX Design",
    description:
      "Clean, easy-to-use interfaces and user flows for web and mobile products.",
    icon: "pen",
    price: 120000,
  },
  {
    id: "design-thinking-ideation",
    category: "Research and Development",
    name: "Design Thinking & Ideation",
    description:
      "Workshops and research that turn a rough idea into a clear, testable concept.",
    icon: "lightbulb",
    price: 90000,
  },
  {
    id: "product-management",
    category: "Business Ventures",
    name: "Product Management",
    description:
      "Roadmaps, priorities and delivery plans that keep your product on track.",
    icon: "clipboard",
    price: 150000,
  },
  {
    id: "startup-venture-development",
    category: "Business Ventures",
    name: "Startup & Venture Development",
    description:
      "Guidance on validating, structuring and launching your startup or venture.",
    icon: "rocket",
    price: 250000,
  },
];

export async function getServices() {
  if (REAL_SERVICES) {
    const res = await request("/api/Services");
    const services = (res.data || [])
      .filter((s) => s.isActive !== false)
      .map(fromApiService);
    return { success: true, services };
  }
  await wait(500);
  return { success: true, services: MOCK_SERVICES };
}

export async function getService(id) {
  const { services } = await getServices();
  const service = services.find((s) => s.id === id);
  if (!service) throw { message: "Service not found" };
  return { success: true, service };
}

// ---------- Orders ----------
export async function createOrder(data) {
  if (REAL_ORDERS) {
    const { service } = await getService(data.serviceId);

    // The backend takes one text field, so the title, deadline and
    // description are packed into it.
    const details = [
      `Title: ${data.title}`,
      `Preferred deadline: ${data.deadline || "Not specified"}`,
      "",
      data.description,
    ].join("\n");

    const res = await request(`/api/Services/${data.serviceId}/select`, {
      method: "POST",
      body: JSON.stringify({ details }),
    });

    // Temporary: shows what the server sent back
    console.info("Select response shape:", JSON.stringify(res));

    const d = res.data;
    const serverId =
      (typeof d === "string" ? d : null) ||
      pick(d, ["id", "serviceRequestId", "requestId"]) ||
      pick(d?.serviceRequest, ["id"]);

    if (!serverId) {
      throw {
        message:
          "Your request was sent, but the server didn't return its id. Please tell the developer.",
      };
    }

    const order = {
      id: String(serverId),
      serverId: String(serverId),
      serviceId: service.id,
      serviceName: service.name,
      title: data.title,
      description: data.description,
      deadline: data.deadline || null,
      price: service.price,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    };
    saveOrders([order, ...readOrders()]);
    return { success: true, order };
  }

  await wait(700);
  const { service } = await getService(data.serviceId);

  const order = {
    id: `ORD-${Date.now()}`,
    serviceId: service.id,
    serviceName: service.name,
    title: data.title,
    description: data.description,
    deadline: data.deadline || null,
    price: service.price,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
  };
  saveOrders([order, ...readOrders()]);
  return { success: true, order };
}

export async function getOrder(id) {
  if (USE_MOCK) {
    await wait(300);
    const order = readOrders().find((o) => o.id === id);
    if (!order) throw { message: "Order not found" };
    return { success: true, order };
  }
  return request(`/orders/${id}`);
}

export async function getOrders() {
  if (USE_MOCK) {
    await wait(400);
    return { success: true, orders: readOrders() };
  }

  return request("/orders");
}

export async function cancelOrder(id) {
  if (USE_MOCK) {
    await wait(400);
    const orders = readOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw { message: "Order not found" };
    if (order.status !== "pending_payment") {
      throw {
        message: "Only unpaid orders can be cancelled here. Please contact support.",
      };
    }
    const updated = orders.map((o) =>
      o.id === id
        ? { ...o, status: "cancelled", cancelledAt: new Date().toISOString() }
        : o
    );
    saveOrders(updated);
    return { success: true, order: updated.find((o) => o.id === id) };
  }

  return request(`/orders/${id}/cancel`, { method: "PATCH" });
}

export async function deleteOrder(id) {
  if (USE_MOCK) {
    await wait(400);
    const orders = readOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw { message: "Order not found" };
    if (order.status !== "cancelled") {
      throw { message: "Only cancelled orders can be deleted." };
    }
    saveOrders(orders.filter((o) => o.id !== id));
    return { success: true };
  }
  return request(`/orders/${id}`, { method: "DELETE" });
}


function normalizePaymentStatus(res) {
  const d = res?.data;
  const raw =
    (typeof d === "string" ? d : null) ??
    pick(d, ["status", "paymentStatus", "state"]) ??
    (typeof d === "boolean" ? (d ? "success" : "failed") : null) ??
    (d && (d.isPaid === true || d.paid === true) ? "success" : null) ??
    res?.message ??
    "";
  const s = String(raw).toLowerCase();
  if (/success|paid|complete|confirm/.test(s)) return "success";
  if (/fail|abandon|revers|declin|cancel/.test(s)) return "failed";
  return "pending";
}

async function postInitialize(body) {
  const options = { method: "POST", body: JSON.stringify(body) };
  try {
    // His route currently has a typo: "initiatialize"
    return await request("/api/Payments/initiatialize", options);
  } catch (err) {
    if (err?.status === 404) {
      return request("/api/Payments/initialize", options);
    }
    throw err;
  }
}

export async function initializePayment(orderId) {
  if (REAL_ORDERS) {
    const order = readOrders().find((o) => o.id === orderId);
    if (!order) throw { message: "Order not found" };
    if (order.status !== "pending_payment") {
      throw { message: "This order has already been paid for." };
    }
    if (!order.serverId) {
      throw {
        message:
          "This order was created in demo mode and can't be paid for. Please create a new one.",
      };
    }

    const res = await postInitialize({
      serviceRequestId: order.serverId,
      returnUrl: `${window.location.origin}/payment/callback`,
    });

    // Temporary: shows what the server sent back
    console.info("Initialize response shape:", JSON.stringify(res));

    const d = res.data;
    const authorizationUrl =
      (typeof d === "string" ? d : null) ||
      pick(d, [
        "authorizationUrl",
        "authorization_url",
        "paymentUrl",
        "checkoutUrl",
        "url",
        "link",
      ]);
    const reference = pick(d, [
      "reference",
      "paymentReference",
      "transactionReference",
    ]);

    if (!authorizationUrl) {
      throw {
        message: "The payment page link wasn't returned. Please try again.",
      };
    }

    // Remember which order this payment belongs to
    localStorage.setItem(PAYING_KEY, order.id);
    if (reference) {
      const refs = readJson(PAYREF_KEY, {});
      refs[reference] = order.id;
      localStorage.setItem(PAYREF_KEY, JSON.stringify(refs));
    }

    return { success: true, reference, authorizationUrl };
  }

  await wait(600);
  const order = readOrders().find((o) => o.id === orderId);
  if (!order) throw { message: "Order not found" };
  if (order.status !== "pending_payment") {
    throw { message: "This order has already been paid for." };
  }

  const reference = `PSK-${Date.now()}`;
  const payments = readPayments();
  payments[reference] = { orderId, status: "pending" };
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  return {
    success: true,
    reference,
    authorizationUrl: `/mock-paystack?reference=${reference}`,
  };
}

export async function verifyPayment(reference) {
  if (REAL_ORDERS) {
    const res = await request(
      `/api/Payments/verify?reference=${encodeURIComponent(reference)}`
    );

    // Temporary: shows what the server sent back
    console.info("Verify response shape:", JSON.stringify(res));

    const status = normalizePaymentStatus(res);
    const refs = readJson(PAYREF_KEY, {});
    const orderId = refs[reference] || localStorage.getItem(PAYING_KEY);

    let order = readOrders().find((o) => o.id === orderId) || null;
    if (order && status === "success" && order.status === "pending_payment") {
      order = { ...order, status: "paid", paidAt: new Date().toISOString() };
      saveOrders(readOrders().map((o) => (o.id === order.id ? order : o)));
    }
    return { success: true, status, order };
  }

  await wait(800);
  const payment = readPayments()[reference];
  if (!payment) throw { message: "We couldn't find this payment." };
  const order = readOrders().find((o) => o.id === payment.orderId);
  return { success: true, status: payment.status, order };
}

export function mockGetPaymentDetails(reference) {
  const payment = readPayments()[reference];
  if (!payment) return null;
  const order = readOrders().find((o) => o.id === payment.orderId);
  if (!order) return null;
  return { reference, status: payment.status, order };
}

export function mockFinishPayment(reference, outcome) {
  const payments = readPayments();
  const payment = payments[reference];
  if (!payment) return;

  payment.status = outcome; // "success" or "failed"
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  if (outcome === "success") {
    saveOrders(
      readOrders().map((o) =>
        o.id === payment.orderId
          ? { ...o, status: "paid", paidAt: new Date().toISOString() }
          : o
      )
    );
  }
}


const READ_KEY = "mock_read_notifications";
const WELCOME_KEY = "mock_welcome_at";

function readReadIds() {
  return readJson(READ_KEY, []);
}

function buildMockNotifications() {
  const readIds = readReadIds();
  const list = [];

  readOrders().forEach((o) => {
    list.push({
      id: `${o.id}:created`,
      type: "order",
      title: "Request submitted",
      message: `Your request "${o.title}" is saved.${
        o.status === "pending_payment" ? " Pay now to start work." : ""
      }`,
      orderId: o.id,
      createdAt: o.createdAt,
    });

    if (o.paidAt) {
      list.push({
        id: `${o.id}:paid`,
        type: "payment",
        title: "Payment confirmed",
        message: `We received your payment of ₦${o.price.toLocaleString()} for ${o.serviceName}. Work on your request has been scheduled.`,
        orderId: o.id,
        createdAt: o.paidAt,
      });
    }

    if (o.cancelledAt) {
      list.push({
        id: `${o.id}:cancelled`,
        type: "order",
        title: "Order cancelled",
        message: `Your order "${o.title}" was cancelled and you were not charged.`,
        orderId: o.id,
        createdAt: o.cancelledAt,
      });
    }

    if (o.deadline && !["completed", "cancelled"].includes(o.status)) {
      const days = Math.ceil(
        (new Date(`${o.deadline}T12:00:00`) - Date.now()) / 86400000
      );
      if (days >= 0 && days <= 3) {
        list.push({
          id: `${o.id}:deadline`,
          type: "deadline",
          title: "Deadline coming up",
          message: `"${o.title}" is due ${
            days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`
          }.`,
          orderId: o.id,
          createdAt: new Date().toISOString(),
        });
      }
    }
  });

  let welcomeAt = localStorage.getItem(WELCOME_KEY);
  if (!welcomeAt) {
    welcomeAt = new Date().toISOString();
    localStorage.setItem(WELCOME_KEY, welcomeAt);
  }
  list.push({
    id: "welcome",
    type: "account",
    title: "Welcome to IdeaX",
    message: "Your account is ready. Browse services and request your first one.",
    orderId: null,
    createdAt: welcomeAt,
  });

  return list
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((n) => ({ ...n, read: readIds.includes(n.id) }));
}

export async function getNotifications() {
  if (USE_MOCK) {
    await wait(300);
    return { success: true, notifications: buildMockNotifications() };
  }

  return request("/notifications");
}

export async function markNotificationRead(id) {
  if (USE_MOCK) {
    const ids = readReadIds();
    if (!ids.includes(id)) {
      localStorage.setItem(READ_KEY, JSON.stringify([...ids, id]));
    }
    return { success: true };
  }
  return request(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  if (USE_MOCK) {
    const all = buildMockNotifications().map((n) => n.id);
    localStorage.setItem(READ_KEY, JSON.stringify(all));
    return { success: true };
  }
  return request("/notifications/read-all", { method: "PATCH" });
}

// ---------- Settings ----------
const PREFS_KEY = "mock_email_prefs";
const DEFAULT_PREFS = {
  orderUpdates: true,
  deadlineReminders: true,
};

export async function updateProfile(data) {
  if (USE_MOCK) {
    await wait(500);
    const userKey = REAL_AUTH ? USER_KEY : KEY;
    const current = readJson(userKey);
    if (!current) throw { message: "Not logged in" };
    const user = { ...current, name: data.name, email: data.email };
    localStorage.setItem(userKey, JSON.stringify(user));
    return { success: true, user };
  }

  return request("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data) {
  if (USE_MOCK) {
    await wait(600);

    return { success: true };
  }

  return request("/auth/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getEmailPreferences() {
  if (USE_MOCK) {
    await wait(200);
    const saved = readJson(PREFS_KEY, {});
    return { success: true, preferences: { ...DEFAULT_PREFS, ...saved } };
  }

  return request("/settings/email-preferences");
}

export async function updateEmailPreferences(preferences) {
  if (USE_MOCK) {
    await wait(300);
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    return { success: true, preferences };
  }
  return request("/settings/email-preferences", {
    method: "PATCH",
    body: JSON.stringify(preferences),
  });
}

export async function deleteAccount() {
  if (USE_MOCK) {
    await wait(600);
    [
      KEY,
      USER_KEY,
      TOKEN_KEY,
      ORDERS_KEY,
      PAYMENTS_KEY,
      PAYREF_KEY,
      PAYING_KEY,
      PREFS_KEY,
      "mock_read_notifications",
      "mock_welcome_at",
    ].forEach((k) => localStorage.removeItem(k));
    return { success: true };
  }
  return request("/auth/account", { method: "DELETE" });
}

// ---------- Password reset ----------
// TEMPORARY: simulated until the backend has the reset endpoints.
// Set VITE_REAL_PASSWORD_RESET=true in .env (and Vercel) when they exist.
const REAL_RESET = import.meta.env.VITE_REAL_PASSWORD_RESET === "true";

export async function forgotPassword(email) {
  if (!REAL_RESET) {
    await wait(700);
    return { success: true };
  }
  return request("/api/Account/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ email, token, password }) {
  if (!REAL_RESET) {
    await wait(700);
    if (token === "expired") {
      throw { message: "This reset link has expired. Please request a new one." };
    }
    return { success: true };
  }
  return request("/api/Account/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email,
      token,
      newPassword: password,
      newPasswordConfirmation: password,
    }),
  });
}