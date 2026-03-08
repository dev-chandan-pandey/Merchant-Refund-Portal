import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';

import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { StatusEvent } from '../timeline/schemas/status-event.schema';
import { Refund } from '../refunds/schemas/refund.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,

    @InjectModel(StatusEvent.name)
    private statusEventModel: Model<any>,

    @InjectModel(Refund.name)
    private refundModel: Model<any>,
  ) {}

  async findTransactions(merchantId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

   const filter: any = { merchantId: new Types.ObjectId(merchantId) }; // ✅ cast here

    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    if (query.search) {
      filter.transactionId = {
        $regex: query.search,
        $options: 'i',
      };
    }

    if (query.fromDate || query.toDate) {
      filter.transactionDate = {};
      if (query.fromDate) filter.transactionDate.$gte = new Date(query.fromDate);
      if (query.toDate) filter.transactionDate.$lte = new Date(query.toDate);
    }

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(limit),
      this.transactionModel.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getTransactionDetail(transactionId: string, merchantId: string) {
    const transaction = await this.transactionModel.findOne({ 
      transactionId,
       merchantId: new Types.ObjectId(merchantId) });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const timeline = await this.statusEventModel
      .find({ transactionId })
      .sort({ timestamp: 1 });

    let refundEligible = true;
    let reason: string | null = null;

    // RULE 1
    if (transaction.status !== 'Successful') {
      refundEligible = false;
      reason = 'Transaction is not successful';
    }

    // RULE 2
    const refund = await this.refundModel.findOne({ transactionId });
    if (refund) {
      refundEligible = false;
      reason = 'Transaction already refunded';
    }

    // RULE 3
    const days =
      (Date.now() - transaction.transactionDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (days > 30) {
      refundEligible = false;
      reason = 'Refund window expired (30 days)';
    }

    return {
      success: true,
      data: {
        transaction,
        timeline,
        refundEligible,
        reason,
      },
    };
  }
}
