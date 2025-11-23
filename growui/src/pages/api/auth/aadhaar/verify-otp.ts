import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import { User } from '@/models/User';
import { verifyAadhaarOtp } from '@/server/otpService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { aadhaarNumber, otp } = req.body as { aadhaarNumber?: string; otp?: string };
  if (!aadhaarNumber || !otp) {
    return res.status(400).json({ message: 'Aadhaar and OTP are required' });
  }

  const normalized = aadhaarNumber.replace(/\D/g, '');
  if (normalized.length !== 12 || otp.length !== 6) {
    return res.status(400).json({ message: 'Invalid Aadhaar or OTP format' });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ aadhaarNumber: normalized });

    if (!user) {
      return res.status(404).json({ message: 'No account is linked to this Aadhaar number' });
    }

    const verified = await verifyAadhaarOtp(normalized, otp);
    if (!verified) {
      return res.status(401).json({ message: 'Incorrect or expired OTP' });
    }

    return res.status(200).json({
      message: 'OTP verified',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Aadhaar OTP verify error:', error);
    return res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
  }
}
