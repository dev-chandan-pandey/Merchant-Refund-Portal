import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryTransactionsDto {

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

}