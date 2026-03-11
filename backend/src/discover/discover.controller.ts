import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DiscoveryQueryDto } from './dto/discover-query.dto';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}
  @Get()
  async findTravs(
    @CurrentUser() user: { id: number },
    @Query() query: DiscoveryQueryDto,
  ) {
    return await this.discoverService.findTravellers(user.id, query);
  }
}
