import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoItemDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
