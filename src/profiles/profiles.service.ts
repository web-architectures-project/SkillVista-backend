import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
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
    } catch (error) {
      // Check if the error is an instance of Nest's built-in exceptions
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Check if the error is related to a foreign key constraint
      if (error.message.includes('violate the required relation')) {
        // This is a bad request
        throw new BadRequestException(
          'Invalid user ID or relationship constraint violated.',
        );
      }
      // If not, throw a generic internal server error
      throw new InternalServerErrorException(
        `Error creating profile: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.profile.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching profiles: ${error.message}`,
      );
    }
  }

  async findOne(profile_id: number) {
    profile_id = Number(profile_id);

    try {
      const profile = await this.prisma.profile.findUnique({
        where: { profile_id: profile_id },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return { profile: profile, statusCode: 200 };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException to be handled by NestJS
      }
      throw new InternalServerErrorException(
        `Error fetching profile: ${error.message}`,
      );
    }
  }

  async update(profile_id: number, updateData: CreateProfileDto) {
    profile_id = Number(profile_id);

    try {
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
    } catch (error) {
      if (
        error.message.includes(
          'Foreign key constraint failed on the field: `user_id`',
        )
      ) {
        throw new BadRequestException(
          'Foreign key constraint failed: Invalid user ID or relation constraint violated.',
        );
      }
      throw new InternalServerErrorException(
        `Error updating profile: ${error.message}`,
      );
    }
  }

  async remove(profile_id: number) {
    profile_id = Number(profile_id);

    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      }
      throw new InternalServerErrorException(
        `Error deleting profile: ${error.message}`,
      );
    }
  }
}
