import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Refund, RefundSchema } from '../refunds/schemas/refund.schema';
import { TimelineModule } from '../timeline/timeline.module';

import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Refund.name, schema: RefundSchema }, // ✅ register Refund
    ]),
    TimelineModule, // ✅ brings in StatusEventModel
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
