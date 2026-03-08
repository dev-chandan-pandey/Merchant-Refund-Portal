import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StatusEventDocument = StatusEvent & Document;

@Schema({ timestamps: true })
export class StatusEvent {

  @Prop({ type: Types.ObjectId, ref: 'Transaction', required: true })
  transactionId: Types.ObjectId;

  @Prop({
    enum: ['Initiated', 'Processing', 'Successful', 'Failed', 'Refunded']
  })
  status: string;

  @Prop({ required: true })
  timestamp: Date;

}

export const StatusEventSchema = SchemaFactory.createForClass(StatusEvent);