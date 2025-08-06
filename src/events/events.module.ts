import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventRepository } from './repositories/event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';

@Module({
  controllers: [EventsController],
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [EventsService, EventRepository],
  exports: [EventRepository],
})
export class EventsModule {}
