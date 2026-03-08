import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatusEvent, StatusEventSchema } from './schemas/status-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StatusEvent.name, schema: StatusEventSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class TimelineModule {}