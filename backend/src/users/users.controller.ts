import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/profile/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getMe(@CurrentUser() user: { id: number; email: string }) {
    return this.usersService.findMe(user.id);
  }

  @Patch('/me')
  async updateMe(
    @CurrentUser() user: { id: number; email: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get(':id')
  async getUser(id: number) {
    return this.usersService.findById(id);
  }
}
