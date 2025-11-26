import PDFDocument from 'pdfkit';
import { OrderRecord } from '@/types/orders';

export const createReceiptPdf = (order: OrderRecord): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Grow Investments Pvt. Ltd.', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#555').text('Mutual Fund Transaction Receipt');
    doc.moveDown();

    doc.fillColor('#000').fontSize(12);
    doc.text(`Order Reference: ${order.id}`);
    doc.text(`Order Type: ${order.orderType.toUpperCase()}`);
    doc.text(`Scheme: ${order.schemeName}`);
    doc.text(`Fund House: ${order.fundHouse}`);
    doc.text(`Amount: ₹${order.amount.toLocaleString('en-IN')}`);
    doc.text(`Payment Method: ${order.paymentMethod}${order.paymentGateway ? ` (${order.paymentGateway})` : ''}`);
    if (order.paymentReference) {
      doc.text(`Payment Reference: ${order.paymentReference}`);
    }
    doc.text(`Placed On: ${new Date(order.createdAt).toLocaleString('en-IN')}`);
    doc.text(`Updated On: ${new Date(order.updatedAt).toLocaleString('en-IN')}`);
    doc.moveDown();

    doc.fontSize(12).text('Summary', { underline: true });
    doc.fontSize(11).list([
      `NAV at purchase: ₹${Number(order.nav).toFixed(2)}`,
      order.orderType === 'sip'
        ? `Frequency: ${order.frequency?.toUpperCase()} starting ${order.sipStartDate}`
        : undefined,
      order.orderType === 'swp'
        ? `Payout account: ${order.payoutAccount ?? 'n/a'}`
        : undefined,
      order.orderType === 'stp'
        ? `Target scheme: ${order.targetScheme ?? 'n/a'} | Start: ${order.transferStartDate ?? 'n/a'}`
        : undefined,
    ].filter(Boolean) as string[]);

    doc.moveDown();
    doc.fontSize(10).fillColor('#777').text('This is a computer generated receipt for informational purposes only.');

    doc.end();
  });
};
