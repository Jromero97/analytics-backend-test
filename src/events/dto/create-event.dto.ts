/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateEventDto {
  /**
   * DTO to create endpoint
   */
  @ApiProperty({ example: 'uid_111111' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'sid_111111' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ example: 'page_view' })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ example: '2025-07-31T00:00:00Z' })
  @IsISO8601()
  timestamp: Date;

  @ApiProperty({
    example: {
      url: '/dashboard',
      referref: '/auth',
      device: 'mobile',
      browser: 'Firefox',
    },
    type: 'object',
  } as ApiPropertyOptions)
  @IsObject()
  metadata: Record<string, any>;
}
