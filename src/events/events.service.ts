import { Injectable } from '@nestjs/common';
import { EventRepository } from './repositories/event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { EventsCount } from './models/events-count.model';

@Injectable()
export class EventsService {
  /**
   * Events Service to manage endpoints functionality
   */
  constructor(private readonly eventRepo: EventRepository) {}

  /**
   * Create an event
   * @param data: CreateEventDto
   * @returns Promise<Event>
   */
  createEvent(data: CreateEventDto): Promise<Event> {
    return this.eventRepo.create(data);
  }

  /**
   * Create a batch of events
   * @param events: CreateEventDto[]
   * @returns Promise<Event[]>
   */
  createBatch(events: CreateEventDto[]): Promise<Event[]> {
    return this.eventRepo.createBatch(events);
  }

  /**
   * Find events in a date range
   * @param start Date
   * @param end Date
   * @returns Promise<Event[]>
   */
  findEventsByDateRange(start: Date, end: Date): Promise<Event[]> {
    return this.eventRepo.findByFilter({
      timestamp: { $gte: start, $lte: end },
    });
  }

  /**
   * Find events with a predefined filter (if empty returns all events)
   * @param filter Record<string, any>
   * @returns Promise<Event[]>
   */
  findEventsByFilter(filter: Record<string, any>): Promise<Event[]> {
    return this.eventRepo.findByFilter(filter);
  }

  /**
   * Count events by type per user id
   * @param userId string
   * @returns Promise<EventsCount[]>
   */
  async getEventsCountByTypePerUser(userId: string): Promise<EventsCount[]> {
    const result = await this.eventRepo.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result.map((item: { _id: string; count: number }) => ({
      event: item._id,
      count: item.count,
    }));
  }

  /**
   * Count all events by type
   * @returns Promise<EventsCount[]>
   */
  async getEventsCountByType(): Promise<EventsCount[]> {
    const result = await this.eventRepo.aggregate([
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return result.map((item: { _id: string; count: number }) => ({
      event: item._id,
      count: item.count,
    }));
  }

  /**
   * Enable custome aggregations passed through the controller
   * @param pipeline any[]
   * @returns any[]
   */
  aggregateEvents(pipeline: any[]): Promise<any[]> {
    return this.eventRepo.aggregate(pipeline);
  }
}
