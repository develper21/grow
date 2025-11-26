export type PaymentMethod = 'Netbanking' | 'UPI' | 'Auto-debit mandate';

export type PaymentGateway = 'NETBANKING' | 'UPI_COLLECT' | 'NACH';

export interface PaymentIntentInput {
  method: PaymentMethod;
  amount: number;
  upiHandle?: string;
  mandateId?: string;
}

export interface PaymentIntentResult {
  gateway: PaymentGateway;
  reference: string;
  narrative: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateReference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const initiatePaymentIntent = async ({ method, amount, upiHandle, mandateId }: PaymentIntentInput): Promise<PaymentIntentResult> => {
  await delay(800);

  switch (method) {
    case 'UPI': {
      if (!upiHandle) {
        throw new Error('UPI handle is required');
      }
      return {
        gateway: 'UPI_COLLECT',
        reference: generateReference('UPI'),
        narrative: `Collect request sent to ${upiHandle} for ₹${amount.toLocaleString('en-IN')}`,
      };
    }
    case 'Auto-debit mandate': {
      if (!mandateId) {
        throw new Error('Mandate selection is required');
      }
      return {
        gateway: 'NACH',
        reference: generateReference('NACH'),
        narrative: `Mandate ${mandateId} scheduled for auto debit`,
      };
    }
    default:
      return {
        gateway: 'NETBANKING',
        reference: generateReference('NBK'),
        narrative: 'Redirected to partner bank gateway',
      };
  }
};
