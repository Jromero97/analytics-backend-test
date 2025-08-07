import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateEventsBatchDto } from './dto/create-events-batch.dto';

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
  createBatch(@Body() dtos: CreateEventsBatchDto) {
    return this.eventsService.createBatch(dtos.events);
  }

  @Get('stats/event-types-per-user')
  @ApiOperation({ summary: 'Get events count by type per user' })
  getEventsCountByTypePerUser(@Query('userId') userId: string) {
    return this.eventsService.getEventsCountByTypePerUser(userId);
  }

  @Get('stats/event-by-date-range')
  @ApiOperation({ summary: 'Get events by date range ' })
  getEventsByDateRange(@Query('start') start: Date, @Query('end') end: Date) {
    return this.eventsService.findEventsByDateRange(start, end);
  }

  @Get('stats/event-types')
  @ApiOperation({ summary: 'Get events count by type global' })
  getEventsCountByType() {
    return this.eventsService.getEventsCountByType();
  }

  @Get('stats/session-avg')
  @ApiOperation({ summary: 'Get the average of sessions per user' })
  getAverageSessionDurationByUser(@Query('userId') userId: string) {
    return this.eventsService.getAverageSessionDurationByUserId(userId);
  }

  @Get('stats/activity')
  @ApiOperation({ summary: 'Get the events grouped by session' })
  getEventsBySession(@Query('userId') userId: string) {
    return this.eventsService.getEventsGroupedBySession(userId);
  }

  @Get('stats/page-views')
  @ApiOperation({ summary: 'Get events count by page visited' })
  getEventsCountByPage(@Query('userId') userId: string) {
    return this.eventsService.getEventsCountByPage(userId);
  }

  @Get('stats/device-views')
  @ApiOperation({ summary: 'Get events count by device used' })
  getEventsCountByDevice(@Query('userId') userId: string) {
    return this.eventsService.getEventsCountByDevice(userId);
  }

  @Get('stats/user-navigation-flow')
  @ApiOperation({ summary: 'Get the navigation flow per session' })
  getNavigationFlowPerSession(@Query('userId') userId: string) {
    return this.eventsService.getNavigationFlow(userId);
  }

  @Get('stats/top-pages-visited')
  @ApiOperation({ summary: 'Get the top pages visited' })
  getTopPagesVisited(@Query('userId') userId: string) {
    return this.eventsService.getTopPageViews(userId);
  }
}
