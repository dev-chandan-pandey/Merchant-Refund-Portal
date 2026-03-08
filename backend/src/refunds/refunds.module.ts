import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Refund, RefundSchema } from './schemas/refund.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { StatusEvent, StatusEventSchema } from '../timeline/schemas/status-event.schema';

import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Refund.name, schema: RefundSchema },
      { name: Transaction.name, schema: TransactionSchema },   // ✅ TransactionModel
      { name: StatusEvent.name, schema: StatusEventSchema },   // ✅ StatusEventModel
    ]),
  ],
  providers: [RefundsService],
  controllers: [RefundsController],
  exports: [RefundsService],
})
export class RefundsModule {}
