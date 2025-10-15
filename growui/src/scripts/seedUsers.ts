import { User } from '../models/User';
import { Company } from '../models/Company';
import dbConnect from '../utils/db';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  try {
    await dbConnect();
    console.log('Seeding users...');

    // Create sample company
    const company = await Company.create({
      name: 'Demo Mutual Fund Company',
      headId: 'company_head_id',
      settings: {
        annualCommissionRate: 2.0,
        monthlyPayoutDay: 5,
        minWithdrawalAmount: 100,
        maxWithdrawalAmount: 100000
      }
    });

    // Create sample users with different roles
    const users = [
      {
        email: 'company@demo.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Company Head',
        role: 'company_head',
        companyId: (company._id as any).toString(),
        isActive: true
      },
      {
        email: 'admin@demo.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Admin User',
        role: 'admin',
        parentId: 'company_head_id',
        companyId: (company._id as any).toString(),
        isActive: true
      },
      {
        email: 'seller@demo.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Seller User',
        role: 'seller',
        parentId: 'admin_id',
        companyId: (company._id as any).toString(),
        isActive: true
      },
      {
        email: 'customer@demo.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Customer User',
        role: 'customer',
        parentId: 'seller_id',
        companyId: (company._id as any).toString(),
        isActive: true
      }
    ];

    // Insert users (skip if they already exist)
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers();
}

export { seedUsers };
