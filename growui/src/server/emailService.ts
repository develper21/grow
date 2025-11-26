import { OrderRecord } from '@/types/orders';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendReceiptEmail = async (order: OrderRecord) => {
  await delay(300);
  console.info(`[mock-email] Sent receipt for ${order.id} to user@example.com`);
};
