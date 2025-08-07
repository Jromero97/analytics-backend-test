import { Injectable } from '@nestjs/common';
import { EventRepository } from './repositories/event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { EventsCount } from './models/events-count.model';
import { AverageSessionDuration } from './models/average-session-duration.model';
import { EventsGroupedBySession } from './models/events-grouped-by-session.model';
import { EventsCountByDevice } from './models/events-count-by-device.model';
import { EventsCountByPage } from './models/events-count-by-page.model';
import { TopPages } from './models/top-pages.model';
import { NavigationFlowBySession } from './models/navigation-flow-by-session.model';

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
   * Find average session duration
   * @returns Promise<AverageSessionDuration>
   */
  async getAverageSessionDurationByUserId(
    userId: string,
  ): Promise<AverageSessionDuration[]> {
    return (await this.eventRepo.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$sessionId',
          minTime: { $min: '$timestamp' },
          maxTime: { $max: '$timestamp' },
        },
      },
      {
        $project: {
          sessionId: '$_id',
          durationInMs: { $subtract: ['$maxTime', '$minTime'] },
          _id: 0,
        },
      },
      {
        $addFields: {
          userId: userId,
          durationInHours: {
            $divide: ['$durationInMs', 1000 * 60 * 60],
          },
        },
      },
      {
        $project: {
          sessionId: 1,
          userId: 1,
          durationInHours: 1,
        },
      },
    ])) as AverageSessionDuration[];
  }

  /**
   * Events by session and time
   */
  async getEventsGroupedBySession(
    userId: string,
  ): Promise<EventsGroupedBySession[]> {
    return (await this.eventRepo.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: '$sessionId',
          events: {
            $push: {
              event: '$event',
              timestamp: '$timestamp',
              metadata: '$metadata',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          events: 1,
        },
      },
    ])) as EventsGroupedBySession[];
  }

  /**
   * Event Counts By Device
   */
  async getEventsCountByDevice(userId: string): Promise<EventsCountByDevice[]> {
    return (await this.eventRepo.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: '$metadata.device',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          device: '$_id',
          total: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ])) as EventsCountByDevice[];
  }

  /**
   * Events Count by Page (url)
   */
  async getEventsCountByPage(userId: string): Promise<EventsCountByPage[]> {
    return (await this.eventRepo.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: '$metadata.url',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          page: '$_id',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ])) as EventsCountByPage[];
  }

  /**
   * Get top pages
   */
  async getTopPageViews(userId: string): Promise<TopPages[]> {
    return (await this.eventRepo.aggregate([
      {
        $match: { userId, event: 'page_view' },
      },
      {
        $group: {
          _id: '$metadata.url',
          views: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          page: '$_id',
          views: 1,
        },
      },
      {
        $sort: { views: -1 },
      },
    ])) as TopPages[];
  }

  /**
   * Get navigation flow by session
   */
  async getNavigationFlow(userId: string): Promise<NavigationFlowBySession[]> {
    return (await this.eventRepo.aggregate([
      {
        $match: { userId, event: 'page_view' },
      },
      {
        $sort: {
          sessionId: 1,
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: '$sessionId',
          urls: { $push: '$metadata.url' },
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          urls: 1,
        },
      },
    ])) as NavigationFlowBySession[];
  }

  /**
   * Enable custom aggregations passed through the controller
   * @param pipeline any[]
   * @returns any[]
   */
  aggregateEvents(pipeline: any[]): Promise<any[]> {
    return this.eventRepo.aggregate(pipeline);
  }
}
