import { Controller, Get, Put, Body } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ActiveUser } from '../../shared/decorators/activeUser.decorator.js'
import { UpdateProfileDto, ResProfileDto, ChangePassWordDto } from './profile.dto.js'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from '~/shared/dtos/response.dto.js';
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,

  ) { }
  @Get()
  @ZodSerializerDto(ResProfileDto)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId)
  }
  @Put(':id')
  @ZodSerializerDto(ResProfileDto)
  update(@Body() body: UpdateProfileDto, @ActiveUser('userId') userId: number) {
    return this.profileService.updateProfile(body, userId)
  }
  @Put('change-password/:id')
  @ZodSerializerDto(MessageResDTO)
  changePassword(@Body() body: ChangePassWordDto, @ActiveUser('userId') userId: number) {
    return this.profileService.changePassword(body, userId)
  }
}