import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/db';
import { User } from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, password, aadhaarNumber } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    aadhaarNumber?: string;
  };

  if (!firstName || !lastName || !email || !password || !aadhaarNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const normalizedAadhaar = aadhaarNumber.replace(/\D/g, '');
  if (normalizedAadhaar.length !== 12) {
    return res.status(400).json({ message: 'Invalid Aadhaar number' });
  }

  try {
    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const existingAadhaar = await User.findOne({ aadhaarNumber: normalizedAadhaar });
    if (existingAadhaar) {
      return res.status(409).json({ message: 'This Aadhaar number is already linked to another account' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`.trim();

    const user = await User.create({
      email,
      password: hashedPassword,
      name: fullName,
      aadhaarNumber: normalizedAadhaar,
      role: 'customer',
      isActive: true,
    });

    return res.status(201).json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Failed to create account' });
  }
}
