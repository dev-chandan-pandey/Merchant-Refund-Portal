import { IsNumber, IsString, Min } from 'class-validator';

export class CreateRefundDto {

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  reason: string;

}