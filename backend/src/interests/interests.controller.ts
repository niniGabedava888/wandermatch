import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { RespondInterestDto } from './dto/respond-interest.dto';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  async send(@CurrentUser() user: { id: number }, @Body() dto: CreateInterestDto) {
    return this.interestsService.send(user.id, dto);
  }

  @Get('received')
  async getReceived(@CurrentUser() user: { id: number }) {
    return this.interestsService.getReceived(user.id);
  }

  @Get('sent')
  async getSent(@CurrentUser() user: { id: number }) {
    return this.interestsService.getSent(user.id);
  }

  @Patch(':id/respond')
  async respond(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) interestId: number,
    @Body() dto: RespondInterestDto
  ) {
    return this.interestsService.respond(interestId, user.id, dto);
  }
}
