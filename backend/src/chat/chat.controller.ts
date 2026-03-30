import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':interestId/messages')
  getMessages(
    @CurrentUser() user: { id: number },
    @Param('interestId', ParseIntPipe) interestId: number
  ) {
    return this.chatService.getMessages(interestId, user.id);
  }

  @Get('my')
  getMyChats(@CurrentUser() user: { id: number }) {
    return this.chatService.getMyChats(user.id);
  }
}
