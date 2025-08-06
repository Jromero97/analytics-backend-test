import { Injectable } from '@nestjs/common';
import { IEventRepository } from '../interfaces/event-repository/event-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Event } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class EventRepository
  extends BaseRepository<Event>
  implements IEventRepository
{
  /**
   * Repository to handle the Event Model
   * @param eventModel Model<Event>
   */
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {
    super(eventModel);
  }

  async findAll(): Promise<Event[]> {
    return this.model.find().exec();
  }

  async findByFilter(filter: any): Promise<Event[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<Event>): Promise<Event> {
    return this.model.create(data);
  }

  async createBatch(events: CreateEventDto[]): Promise<Event[]> {
    return this.model.insertMany(events);
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }
}
