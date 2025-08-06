import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { Event } from 'src/events/schemas/event.schema';

export interface IEventRepository {
  /**
   * Create function for Event Schema
   * @param data: Partial<Event>
   */
  create(data: Partial<Event>): Promise<Event>;
  /**
   * Create batch function for Event Schema
   * @param events CreateEventDto[]
   */
  createBatch(events: CreateEventDto[]): Promise<Event[]>;
  /**
   * Find All function for Event Schema
   */
  findAll(): Promise<Event[]>;
  /**
   * Find with custom filter for Event Schema
   * @param filter any
   */
  findByFilter(filter: any): Promise<Event[]>;
  /**
   * Find custom aggregations for Event Schema
   * @param pipeline any[]
   */
  aggregate(pipeline: any[]): Promise<any[]>;
}
