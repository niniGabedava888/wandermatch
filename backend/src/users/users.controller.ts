import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/profile/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService
  ) {}

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
    @Body() updateProfileDto: UpdateProfileDto
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

  @Patch('/me/avatar')
  @UseInterceptors(FileInterceptor('File'))
  @ApiOperation({ summary: 'Upload user profile picture' })
  async uploadFile(
    @CurrentUser() user: { id: number },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const currentUser = await this.usersService.findById(user.id);
    if (currentUser.profilePhoto) {
      const oldKey = this.extractS3Key(currentUser.profilePhoto);
      if (oldKey) await this.uploadService.deleteFile(oldKey);
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `avatars/${user.id}-${Date.now()}.${ext}`;
    const url = await this.uploadService.upload(fileName, file.buffer, file.mimetype);

    return this.usersService.updateProfile(user.id, { profilePhoto: url });
  }

  private extractS3Key(url: string): string | null {
    try {
      const urlObject = new URL(url);
      // pathname is '/avatars/5-1234567890.jpg'
      // slice(1) removes the leading slash
      return urlObject.pathname.slice(1);
    } catch {
      return null;
    }
  }
}
