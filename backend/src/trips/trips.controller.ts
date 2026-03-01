import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}
  @Post()
  async create(
    @CurrentUser() user: { id: number },
    @Body() createTripDto: CreateTripDto,
  ) {
    return this.tripsService.create(user.id, createTripDto);
  }

  @Get('my')
  getMyTrips(@CurrentUser() user: { id: number }) {
    return this.tripsService.findMyTrips(user.id);
  }

  @Delete(':id')
  delete(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) tripId: number,
  ) {
    return this.tripsService.delete(tripId, user.id);
  }
}
