import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsService } from './trips.service';

@ApiTags('Trips')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@CurrentUser() user: { id: number }, @Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(user.id, createTripDto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user trips' })
  @ApiResponse({ status: 200, description: 'List of user trips' })
  getMyTrips(@CurrentUser() user: { id: number }) {
    return this.tripsService.findMyTrips(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trip by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Trip deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  delete(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) tripId: number) {
    return this.tripsService.delete(tripId, user.id);
  }
}
