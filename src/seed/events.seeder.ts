import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { EventsService } from '../events/events.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  /**
   * Function to populate database with events randomly generated with Faker
   */
  const app = await NestFactory.createApplicationContext(AppModule);

  const eventsService = app.get(EventsService);

  const eventTypes = [
    'page_view',
    'signup',
    'checkout',
    'add_to_cart',
    'logout',
    'click',
  ];
  const devices = ['mobile', 'tablet', 'desktop'];
  const urls = [
    '/home',
    '/dashboard',
    '/checkout',
    '/profile',
    '/product-detail',
  ];
  const referrers = ['/home', '/signin', '/', 'signup'];
  const browsers = [
    'Chrome',
    'Edge',
    'Firefox',
    'Opera',
    'Safare',
    'Chromium',
    'Brave',
  ];
  const users = [
    'uid_111111',
    'uid_222222',
    'uid_333333',
    'uid_555555',
    'uid_666666',
  ];
  const sessions = [
    'sid_111111',
    'sid_222222',
    'sid_333333',
    'sid_444444',
    'sid_555555',
  ];

  const events: CreateEventDto[] = [];

  for (let i = 0; i < 1000; i++) {
    const userId = faker.helpers.arrayElement(users);
    const sessionId = faker.helpers.arrayElement(sessions);
    const event = faker.helpers.arrayElement(eventTypes);
    const timestamp = faker.date.recent({ days: 10 });

    const metadata = {
      url: faker.helpers.arrayElement(urls),
      referrer: faker.helpers.arrayElement(referrers),
      device: faker.helpers.arrayElement(devices),
      browser: faker.helpers.arrayElement(browsers),
    };

    events.push({ userId, sessionId, event, timestamp, metadata });
  }

  await eventsService.createBatch(events);

  console.log(`${events.length} created successfuly`);

  await app.close();
}

bootstrap();
