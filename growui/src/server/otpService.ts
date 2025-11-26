import bcrypt from 'bcryptjs';

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

type OtpRecord = {
  hash: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

const normalize = (value: string) => value.replace(/\D/g, '');

export const createAadhaarOtp = async (aadhaarNumber: string) => {
  const normalized = normalize(aadhaarNumber);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otp, 10);
  const expiresAt = Date.now() + OTP_TTL_MS;
  otpStore.set(normalized, { hash, expiresAt });
  return { otp, expiresAt, aadhaar: normalized };
};

export const verifyAadhaarOtp = async (aadhaarNumber: string, otp: string) => {
  const normalized = normalize(aadhaarNumber);
  const record = otpStore.get(normalized);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }
  const valid = await bcrypt.compare(otp, record.hash);
  if (valid) {
    otpStore.delete(normalized);
  }
  return valid;
};

export const hasActiveOtp = (aadhaarNumber: string) => {
  const normalized = normalize(aadhaarNumber);
  const record = otpStore.get(normalized);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }
  return true;
};
