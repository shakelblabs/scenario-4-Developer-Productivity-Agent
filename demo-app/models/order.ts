// Order status state machine
// pending → confirmed → shipped → delivered
// Any status can transition to: cancelled (if not yet delivered)
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // in cents
}

export interface OrderRecord {
  id: string;
  userId: string;          // FK → User.id
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;        // sum of (unitPrice * quantity) in cents
  taxAmount: number;       // subtotal * taxRate
  shippingAmount: number;  // flat rate or calculated
  total: number;           // subtotal + taxAmount + shippingAmount
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Valid status transitions — enforces the state machine
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped:   ["delivered"],
  delivered: [],
  cancelled: [],
};

// In-memory store — replace with Postgres/Prisma in production
const orders: OrderRecord[] = [
  {
    id: "ord_001",
    userId: "usr_001",
    status: "confirmed",
    items: [
      { productId: "prod_001", productName: "Widget A", quantity: 2, unitPrice: 1999 },
      { productId: "prod_002", productName: "Widget B", quantity: 1, unitPrice: 4999 },
    ],
    subtotal: 8997,
    taxAmount: 720,
    shippingAmount: 500,
    total: 10217,
    shippingAddress: {
      line1: "123 Main St",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      country: "US",
    },
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-02"),
  },
];

export const Order = {
  // Get all orders — optionally filter by userId
  async findAll(userId?: string): Promise<OrderRecord[]> {
    if (userId) return orders.filter((o) => o.userId === userId);
    return orders;
  },

  // Get a single order by ID
  async findById(id: string): Promise<OrderRecord | undefined> {
    return orders.find((o) => o.id === id);
  },

  // Create a new order (auto-calculates totals)
  async create(data: Omit<OrderRecord, "id" | "status" | "subtotal" | "taxAmount" | "total" | "createdAt" | "updatedAt">): Promise<OrderRecord> {
    const subtotal = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + taxAmount + data.shippingAmount;
    const order: OrderRecord = {
      id: `ord_${Date.now()}`,
      status: "pending",
      subtotal,
      taxAmount,
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    orders.push(order);
    return order;
  },

  // Update status — enforces the state machine
  async updateStatus(id: string, newStatus: OrderStatus): Promise<OrderRecord> {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error(`Order ${id} not found.`);

    const allowed = ALLOWED_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Cannot transition order from '${order.status}' to '${newStatus}'.`);
    }

    order.status = newStatus;
    order.updatedAt = new Date();
    return order;
  },
};
