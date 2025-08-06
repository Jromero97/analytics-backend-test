import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a single event' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create a batch of events' })
  createBatch(@Body() dtos: CreateEventDto[]) {
    return this.eventsService.createBatch(dtos);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Get events by filter' })
  getByFilter(@Query() query: any) {
    return this.eventsService.findEventsByFilter(query);
  }

  @Get('analytics/event-types-per-user')
  @ApiOperation({ summary: 'Get events count by type per user' })
  getEventsCountByTypePerUser(@Query('userId') userId: string) {
    return this.eventsService.getEventsCountByTypePerUser(userId);
  }

  @Get('analytics/event-types')
  @ApiOperation({ summary: 'Get events count by type global' })
  getEventsCountByType() {
    return this.eventsService.getEventsCountByType();
  }
}
