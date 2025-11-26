import { MandateRecord, OrderInput, OrderRecord, OrderStatus } from '@/types/orders';
import { sendReceiptEmail } from '@/server/emailService';

let orders: OrderRecord[] = [];
let mandates: MandateRecord[] = [
  {
    id: 'MAND-001',
    nickname: 'Primary SIP mandate',
    bank: 'HDFC Bank • 1234',
    limit: 25000,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: 'MAND-002',
    nickname: 'Goal-based investments',
    bank: 'ICICI Bank • 9876',
    limit: 15000,
    status: 'paused',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
];

const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

export const getOrders = () => orders;

export const getOrderById = (id: string) => orders.find((order) => order.id === id) ?? null;

export const createOrder = (input: OrderInput): OrderRecord => {
  const now = new Date().toISOString();
  const order: OrderRecord = {
    ...input,
    id: generateId('ORD'),
    status: 'processing',
    createdAt: now,
    updatedAt: now,
  };
  orders = [order, ...orders];
  scheduleStatusUpdate(order.id);
  return order;
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  orders = orders.map((order) =>
    order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
  );
  const updated = orders.find((order) => order.id === id) ?? null;
  if (updated && status === 'executed' && !updated.receiptEmailSentAt) {
    void sendReceiptEmail(updated).then(() => {
      markReceiptEmailSent(updated.id);
    });
  }
  return updated;
};

export const markReceiptEmailSent = (id: string) => {
  const timestamp = new Date().toISOString();
  orders = orders.map((order) =>
    order.id === id ? { ...order, receiptEmailSentAt: timestamp, updatedAt: timestamp } : order
  );
  return orders.find((order) => order.id === id) ?? null;
};

const scheduleStatusUpdate = (orderId: string) => {
  setTimeout(() => {
    const nextStatus: OrderStatus = Math.random() > 0.2 ? 'executed' : 'failed';
    updateOrderStatus(orderId, nextStatus);
  }, 3500);
};

export const getMandates = () => mandates;

export const toggleMandateStatus = (id: string) => {
  mandates = mandates.map((mandate) =>
    mandate.id === id
      ? {
          ...mandate,
          status: mandate.status === 'active' ? 'paused' : 'active',
        }
      : mandate
  );
  return mandates.find((mandate) => mandate.id === id) ?? null;
};

export const createMandate = (nickname: string, bank: string, limit: number) => {
  const mandate: MandateRecord = {
    id: generateId('MAND'),
    nickname,
    bank,
    limit,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  mandates = [mandate, ...mandates];
  return mandate;
};
