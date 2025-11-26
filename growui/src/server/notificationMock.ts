import { randomUUID } from 'crypto';
import {
  Channel,
  DeliveryLog,
  NotificationTemplate,
  TriggerRule,
  UserPreference,
} from '@/types/notification';

const templates: NotificationTemplate[] = [
  {
    id: 'TMP-1001',
    name: 'Order status update',
    channel: 'email',
    status: 'active',
    tags: ['orders', 'transactional'],
    updatedAt: new Date().toISOString(),
    variants: [
      {
        locale: 'en-IN',
        subject: 'Your order is {{status}}',
        body: 'Hi {{name}}, your order {{orderId}} is now {{status}}.',
      },
    ],
  },
  {
    id: 'TMP-1002',
    name: 'SIP reminder',
    channel: 'push',
    status: 'draft',
    tags: ['sip', 'reminder'],
    updatedAt: new Date(Date.now() - 86400_000).toISOString(),
    variants: [
      {
        locale: 'en-IN',
        title: 'SIP due tomorrow',
        body: 'Finish payment to keep your investment on track.',
      },
    ],
  },
];

const userPreferences: UserPreference[] = [
  {
    userId: 'USR-2001',
    email: 'customer@grow.in',
    segments: ['beta'],
    preferences: [
      { channel: 'email', optedIn: true, updatedAt: new Date().toISOString() },
      { channel: 'sms', optedIn: false, updatedAt: new Date().toISOString() },
      { channel: 'push', optedIn: true, updatedAt: new Date().toISOString() },
      { channel: 'in_app', optedIn: true, updatedAt: new Date().toISOString() },
    ],
  },
];

const deliveryLogs: DeliveryLog[] = Array.from({ length: 8 }).map((_, index) => ({
  id: randomUUID(),
  templateId: index % 2 === 0 ? 'TMP-1001' : 'TMP-1002',
  channel: index % 2 === 0 ? 'email' : 'push',
  recipient: index % 2 === 0 ? 'customer@grow.in' : 'device123',
  status: index % 3 === 0 ? 'bounced' : 'sent',
  sentAt: new Date(Date.now() - index * 3600_000).toISOString(),
  metadata: { campaign: 'Q4-retention' },
}));

const triggerRules: TriggerRule[] = [
  {
    id: 'TRG-1',
    name: 'SIP payment reminder',
    type: 'time_based',
    templateId: 'TMP-1002',
    criteria: 'run daily at 9 AM',
    active: true,
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: 'TRG-2',
    name: 'Order shipped event',
    type: 'event_based',
    templateId: 'TMP-1001',
    criteria: 'event=order.shipped',
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
  },
];

export const getTemplates = () => templates;
export const updateTemplateStatus = (id: string, status: NotificationTemplate['status']) => {
  const template = templates.find((item) => item.id === id);
  if (template) {
    template.status = status;
    template.updatedAt = new Date().toISOString();
  }
  return template;
};

export const getUserPreferences = () => userPreferences;
export const updatePreference = (userId: string, channel: Channel, optedIn: boolean) => {
  const profile = userPreferences.find((pref) => pref.userId === userId);
  if (!profile) return null;
  const entry = profile.preferences.find((p) => p.channel === channel);
  if (entry) {
    entry.optedIn = optedIn;
    entry.updatedAt = new Date().toISOString();
  }
  return profile;
};

export const getDeliveryLogs = () => deliveryLogs;
export const getTriggerRules = () => triggerRules;
export const toggleTrigger = (id: string, active: boolean) => {
  const trigger = triggerRules.find((item) => item.id === id);
  if (trigger) {
    trigger.active = active;
  }
  return trigger;
};
