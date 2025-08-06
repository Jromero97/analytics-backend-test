import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: Object, default: {} })
  metadata: {
    url?: string;
    referrer?: string;
    device?: string;
    browser?: string;
    [key: string]: any;
  };
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ timestamp: 1 });
EventSchema.index({ userId: 1, sessionId: 1, timestamp: 1 });
EventSchema.index({ event: 1 });
