import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DiscoveryQueryDto } from './dto/discover-query.dto';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}
  @Get()
  async findTravs(
    @CurrentUser() user: { id: number },
    @Query() query: DiscoveryQueryDto,
  ) {
    return await this.discoveryService.findTravellers(user.id, query);
  }
}
