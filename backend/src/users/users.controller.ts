import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/profile/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  getMe(@CurrentUser() user: { id: number; email: string }) {
    return this.usersService.findMe(user.id);
  }

  @Patch('/me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  updateMe(
    @CurrentUser() user: { id: number; email: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}