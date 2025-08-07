import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateEventDto } from './create-event.dto';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class CreateEventsBatchDto {
  /**
   * DTO for create batch endpoint
   */
  @ApiProperty({
    example: [
      {
        userId: 'uid_111111',
        sessionId: 'sid_111111',
        event: 'page_view',
        timestamp: new Date(),
        metadata: {
          url: '/login',
          referrer: '/',
          device: 'mobile',
          browser: 'Edge',
        },
      },
    ],
  } as ApiPropertyOptions)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
