import { MandateRecord, OrderInput, OrderRecord } from '@/types/orders';

async function handle(response: Response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
}

export const fetchOrders = async (): Promise<OrderRecord[]> => {
  const res = await fetch('/api/orders');
  return handle(res);
};

export const placeOrder = async (payload: OrderInput): Promise<OrderRecord> => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
};

export const fetchMandates = async (): Promise<MandateRecord[]> => {
  const res = await fetch('/api/orders/mandates');
  return handle(res);
};

export const toggleMandate = async (mandateId: string): Promise<MandateRecord> => {
  const res = await fetch('/api/orders/mandates', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: mandateId }),
  });
  return handle(res);
};
