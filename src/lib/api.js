const API_URL = import.meta.env.VITE_API_URL;

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const KEY = "mock_user";
const ORDERS_KEY = "mock_orders";
const PAYMENTS_KEY = "mock_payments";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function readPayments() {
  try {
    return JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || {};
  } catch {
    return {};
  }
}


export async function signup(data) {
  if (USE_MOCK) {
    await wait(600);
    const user = { id: 1, name: data.name, email: data.email };
    localStorage.setItem(KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return request("/auth/signup", { method: "POST", body: JSON.stringify(data) });
}

export async function login(data) {
  if (USE_MOCK) {
    await wait(600);
    const user = { id: 1, name: "Test User", email: data.email };
    localStorage.setItem(KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return request("/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function getMe() {
  if (USE_MOCK) {
    const user = JSON.parse(localStorage.getItem(KEY));
    if (!user) throw { message: "Not logged in" };
    return { success: true, user };
  }
  return request("/auth/me");
}

export async function logout() {
  if (USE_MOCK) {
    localStorage.removeItem(KEY);
    return { success: true };
  }
  return request("/auth/logout", { method: "POST" });
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
  if (USE_MOCK) {
    await wait(500);
    return { success: true, services: MOCK_SERVICES };
  }
  return request("/services");
}

export async function getService(id) {
  if (USE_MOCK) {
    await wait(300);
    const service = MOCK_SERVICES.find((s) => s.id === id);
    if (!service) throw { message: "Service not found" };
    return { success: true, service };
  }
  return request(`/services/${id}`);
}

export async function createOrder(data) {
  if (USE_MOCK) {
    await wait(700);
    const service = MOCK_SERVICES.find((s) => s.id === data.serviceId);
    if (!service) throw { message: "Service not found" };

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
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...readOrders()]));
    return { success: true, order };
  }
  return request("/orders", { method: "POST", body: JSON.stringify(data) });
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
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
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
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders.filter((o) => o.id !== id))
    );
    return { success: true };
  }
  return request(`/orders/${id}`, { method: "DELETE" });
}


export async function initializePayment(orderId) {
  if (USE_MOCK) {
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
  
  return request("/payments/initialize", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function verifyPayment(reference) {
  if (USE_MOCK) {
    await wait(800);
    const payment = readPayments()[reference];
    if (!payment) throw { message: "We couldn't find this payment." };
    const order = readOrders().find((o) => o.id === payment.orderId);
    return { success: true, status: payment.status, order };
  }
  
  return request(`/payments/verify/${reference}`);
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
    const orders = readOrders().map((o) =>
      o.id === payment.orderId
        ? { ...o, status: "paid", paidAt: new Date().toISOString() }
        : o
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}


const READ_KEY = "mock_read_notifications";
const WELCOME_KEY = "mock_welcome_at";

function readReadIds() {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY)) || [];
  } catch {
    return [];
  }
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


const PREFS_KEY = "mock_email_prefs";
const DEFAULT_PREFS = {
  orderUpdates: true,
  deadlineReminders: true,
};

export async function updateProfile(data) {
  if (USE_MOCK) {
    await wait(500);
    const current = JSON.parse(localStorage.getItem(KEY));
    if (!current) throw { message: "Not logged in" };
    const user = { ...current, name: data.name, email: data.email };
    localStorage.setItem(KEY, JSON.stringify(user));
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
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch {
      saved = {};
    }
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
      ORDERS_KEY,
      PAYMENTS_KEY,
      PREFS_KEY,
      "mock_read_notifications",
      "mock_welcome_at",
    ].forEach((k) => localStorage.removeItem(k));
    return { success: true };
  }
  return request("/auth/account", { method: "DELETE" });
}