import { IsString, IsDateString, IsOptional } from 'class-validator'

export class CreateTripDto {
  @IsString()
  city: string

  @IsString()
  country: string

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string

  @IsOptional()
  @IsString()
  description?: string
}