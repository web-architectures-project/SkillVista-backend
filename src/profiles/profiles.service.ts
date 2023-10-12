import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const { user_id, ...otherData } = createProfileDto;

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found.`);
    }

    // Check if the user already has a profile
    const existingProfile = await this.prisma.profile.findUnique({
      where: { user_id: user_id },
    });
    if (existingProfile) {
      throw new BadRequestException(
        `User with ID ${user_id} already has a profile.`,
      );
    }

    // Create the profile
    await this.prisma.profile.create({
      data: {
        ...otherData,
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });

    return { message: 'Profile created successfully', statusCode: 201 };
  }

  async findAll() {
    return await this.prisma.profile.findMany();
  }

  async findOne(profile_id: number) {
    profile_id = Number(profile_id);

    const profile = await this.prisma.profile.findUnique({
      where: { profile_id: profile_id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return { profile: profile, statusCode: 200 };
  }

  async update(profile_id: number, updateData: CreateProfileDto) {
    profile_id = Number(profile_id);

    const existingProfile = await this.prisma.profile.findUnique({
      where: { profile_id: profile_id },
    });

    if (!existingProfile) {
      throw new NotFoundException(`Profile with ID ${profile_id} not found.`);
    }

    await this.prisma.profile.update({
      where: { profile_id: profile_id },
      data: updateData,
    });

    return { message: 'Profile updated successfully', statusCode: 200 };
  }

  async remove(profile_id: number) {
    profile_id = Number(profile_id);

    const existingProfile = await this.prisma.profile.findUnique({
      where: { profile_id: profile_id },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    await this.prisma.profile.delete({
      where: { profile_id: profile_id },
    });

    return { message: 'Profile removed successfully', statusCode: 200 };
  }
}
