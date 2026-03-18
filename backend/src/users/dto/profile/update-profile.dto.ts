import { IsString, IsOptional, IsInt, IsEnum, IsArray, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TravelStyle } from '../../entities/user.entity';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nini Gabedava' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 24, minimum: 18, maximum: 99 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  age?: number;

  @ApiPropertyOptional({ example: 'Female' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'Georgian' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    example: 'Solo traveler who loves hiking and meeting new people',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'URL of the profile photo',
  })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({
    enum: TravelStyle,
    example: TravelStyle.ADVENTUROUS,
  })
  @IsOptional()
  @IsEnum(TravelStyle)
  travelStyle?: TravelStyle;

  @ApiPropertyOptional({
    example: ['Hiking', 'Photography', 'Food'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({
    example: ['English', 'Georgian'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}
