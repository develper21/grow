export type Channel = 'email' | 'sms' | 'push' | 'in_app';
export type TemplateStatus = 'draft' | 'active' | 'archived';
export type TriggerType = 'time_based' | 'event_based';
export type DeliveryStatus = 'queued' | 'sent' | 'bounced' | 'failed';

export interface LocalizationVariant {
  locale: string;
  subject?: string;
  title?: string;
  body: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: Channel;
  status: TemplateStatus;
  tags: string[];
  updatedAt: string;
  variants: LocalizationVariant[];
}

export interface PreferenceEntry {
  channel: Channel;
  optedIn: boolean;
  updatedAt: string;
}

export interface UserPreference {
  userId: string;
  email: string;
  segments: string[];
  preferences: PreferenceEntry[];
}

export interface DeliveryLog {
  id: string;
  templateId: string;
  channel: Channel;
  recipient: string;
  status: DeliveryStatus;
  sentAt: string;
  metadata?: Record<string, string | number>;
}

export interface TriggerRule {
  id: string;
  name: string;
  type: TriggerType;
  templateId: string;
  criteria: string;
  active: boolean;
  createdAt: string;
}
