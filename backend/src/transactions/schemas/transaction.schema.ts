import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {

  @Prop({ required: true })
  transactionId: string;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true })
  merchantId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    enum: ['Successful', 'Failed', 'Pending', 'Refunded'],
    default: 'Pending'
  })
  status: string;

  @Prop({ required: true })
  transactionDate: Date;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);