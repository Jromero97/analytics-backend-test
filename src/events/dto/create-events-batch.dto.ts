import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

export class CreateEventsBatchDto {
  /**
   * DTO for create batch endpoint
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
