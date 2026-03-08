import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '../..', '.env') });
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { MerchantSchema, Merchant } from '../merchants/schemas/merchant.schema';

const Transaction = mongoose.model('Transaction', TransactionSchema);
const MerchantModel = mongoose.model(Merchant.name, MerchantSchema);

const statuses = ['Successful', 'Failed', 'Pending'];

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/merchant-refund';
  if (!mongoUri) {
  throw new Error('❌ MONGODB_URI is not defined in .env');
}
  await mongoose.connect(mongoUri);

  // Fetch merchants from DB
  const merchants = await MerchantModel.find({}, '_id').lean();
  if (merchants.length === 0) {
    throw new Error('No merchants found. Seed merchants first!');
  }

  const merchantIds = merchants.map(m => m._id.toString());

  const transactions: Array<{
    transactionId: string;
    merchantId: string;
    amount: number;
    status: string;
    transactionDate: Date;
  }> = [];

  for (let i = 0; i < 500; i++) {
    transactions.push({
      transactionId: faker.string.uuid(),
      merchantId: merchantIds[Math.floor(Math.random() * merchantIds.length)],
      amount: faker.number.int({ min: 100, max: 5000 }),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      transactionDate: faker.date.recent({ days: 60 }),
    });
  }

  await Transaction.insertMany(transactions);

  console.log('✅ Seeded 500 transactions');
  process.exit();
}

seed().catch(err => {
  console.error('❌ Error seeding transactions:', err);
  process.exit(1);
});