// backend/src/seed/seed-merchants.ts

import * as dotenv from 'dotenv';
dotenv.config();

import { connect, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Merchant, MerchantSchema } from '../merchants/schemas/merchant.schema';

async function seedMerchants() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('❌ MONGODB_URI is not defined in .env');
  }

  await connect(uri);

  const MerchantModel = model(Merchant.name, MerchantSchema);

  const merchants = [
    { email: 'merchant1@test.com', password: 'Test@1234', name: 'Merchant One' },
    { email: 'merchant2@test.com', password: 'Test@1234', name: 'Merchant Two' },
  ];

  for (const merchant of merchants) {
    const passwordHash = await bcrypt.hash(merchant.password, 10);

    await MerchantModel.updateOne(
      { email: merchant.email },
      {
        $setOnInsert: {
          email: merchant.email,
          passwordHash,
          name: merchant.name,
        },
      },
      { upsert: true }
    );
  }

  console.log('✅ Merchants seeded successfully');
  process.exit(0);
}

seedMerchants().catch((err) => {
  console.error('❌ Error seeding merchants:', err);
  process.exit(1);
});
