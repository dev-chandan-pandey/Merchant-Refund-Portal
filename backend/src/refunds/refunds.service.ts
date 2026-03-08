import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';

import { Refund, RefundDocument } from './schemas/refund.schema';
import { Transaction, TransactionDocument } from '../transactions/schemas/transaction.schema';
import { StatusEvent } from '../timeline/schemas/status-event.schema';

@Injectable()
export class RefundsService {

  constructor(
    @InjectModel(Refund.name)
    private refundModel: Model<RefundDocument>,

    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,

    @InjectModel(StatusEvent.name)
    private statusEventModel: Model<any>,
  ) {}

  async createRefund(
  merchantId: string,
  transactionId: string,
  amount: number,
  reason: string
) {
  // ✅ Find by custom transactionId field, not _id
 const transaction = await this.transactionModel.findOne({ transactionId, merchantId: new Types.ObjectId(merchantId) });

  if (!transaction) {
    throw new NotFoundException('Transaction not found');
  }

  // RULE 1
  if (transaction.status !== 'Successful') {
    throw new BadRequestException(
      'Only successful transactions are eligible for refund',
    );
  }

  // RULE 2
  const existingRefund = await this.refundModel.findOne({ transactionId });
  if (existingRefund) {
    throw new BadRequestException(
      'Refund already processed for this transaction',
    );
  }

  // RULE 3
  const days =
    (Date.now() - transaction.transactionDate.getTime()) /
    (1000 * 60 * 60 * 24);

  if (days > 30) {
    throw new BadRequestException('Refund window expired (30 days)');
  }

  // RULE 4
  if (amount > transaction.amount) {
    throw new BadRequestException(
      'Refund amount cannot exceed transaction amount',
    );
  }

  // Create refund
  const refund = await this.refundModel.create({
    merchantId,
    transactionId,
    amount,
    reason,
  });

  // Update transaction status
  transaction.status = 'Refunded';
  await transaction.save();

  // Add timeline event
  await this.statusEventModel.create({
    transactionId,
    status: 'Refunded',
    timestamp: new Date(),
  });

  return {
    success: true,
    data: refund,
  };
}
}