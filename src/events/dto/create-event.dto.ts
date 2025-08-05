/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsISO8601, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsISO8601()
  timestamp: string;

  @IsObject()
  metadata: Record<string, any>;
}
