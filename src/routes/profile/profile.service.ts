import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ProfileRepo } from './profile.repo.js'
import { UpdateProfileDto, ChangePassWordDto } from './profile.dto.js'
import { SharedUserRepo } from '~/shared/reposistory/shared-user-repo.js'
import { HashingService } from '~/shared/services/hashing.service.js'
import { PrismaService } from '~/shared/services/prisma.service.js'
@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepo: ProfileRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly HashingService: HashingService,
    private readonly prismaService: PrismaService,
  ) { }

  async getProfile(userId: number) {
    const user = await this.profileRepo.getProfile(userId)
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại')
    }
    // Làm phẳng mảng permissions từ bảng trung gian
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      status: user.status,
      updatedById: user.id,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map((item) => item.permission),
      },
    }
  }

  async updateProfile(profile: UpdateProfileDto, userId: number) {
    await this.sharedUserRepo.updateUser(userId, {
      ...profile,
      updatedById: userId,
    })

    // Trả về profile hoàn chỉnh sau khi update
    return this.getProfile(userId)
  }
  async changePassword(body: ChangePassWordDto, userId: number) {
    const user = await this.profileRepo.findUser(userId)
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại')
    }
    const { oldPassword, newPassword } = body
    const compare = await this.HashingService.compare(oldPassword, user.password)
    if (!compare) {
      throw new ConflictException('Mật khẩu cũ không chính xác')
    }

    const hashedPassword = await this.HashingService.hash(newPassword)
    const $update = this.sharedUserRepo.updateUser(userId, {
      password: hashedPassword,
    })
    const $delete = this.profileRepo.deletedRefreshToken(userId)
    const [_, __] = await Promise.all([$update, $delete])
    return { message: 'Change password successfully' }

  }
}