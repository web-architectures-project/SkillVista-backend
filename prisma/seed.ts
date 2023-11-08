import { PrismaClient, UserType } from '@prisma/client';
import { encodePassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'johnDoe',
      password: encodePassword('securePass123'),
      email: 'john.doe@email.com',
      user_type: UserType.user,
      Profile: {
        create: {
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '1234567891',
          address: '123 main st',
          city: 'Sample City',
          county: 'Sample County',
          Eircode: 'A96NV96',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'janeDoe',
      password: encodePassword('securePass123'),
      email: 'jane.doe@email.com',
      user_type: 'user',
      Profile: {
        create: {
          first_name: 'Jane',
          last_name: 'Doe',
          phone_number: '1234567892',
          address: '123 main st',
          city: 'Sample City',
          county: 'Sample County',
          Eircode: 'A96NV95',
        },
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'jimDoe',
      password: encodePassword('securePass123'),
      email: 'jim.doe@email.com',
      user_type: 'user',
      Profile: {
        create: {
          first_name: 'Jim',
          last_name: 'Doe',
          phone_number: '1234567893',
          address: '123 main st',
          city: 'Sample City',
          county: 'Sample County',
          Eircode: 'A96NV94',
        },
      },
    },
  });

  const provider1 = await prisma.user.create({
    data: {
      username: 'janeProvider',
      password: encodePassword('providerPass456'),
      email: 'jane.provider@email.com',
      user_type: 'service_provider',
      Profile: {
        create: {
          first_name: 'Jane',
          last_name: 'Smith',
          phone_number: '0987654321',
          address: '456 secondary st',
          city: 'Provider City',
          county: 'Provider County',
          Eircode: 'A96NV93',
        },
      },
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      username: 'johnProvider',
      password: encodePassword('providerPass789'),
      email: 'john.provider@email.com',
      user_type: 'service_provider',
      Profile: {
        create: {
          first_name: 'John',
          last_name: 'Smith',
          phone_number: '0987654322',
          address: '456 secondary st',
          city: 'Provider City',
          county: 'Provider County',
          Eircode: 'A96NV92',
        },
      },
    },
  });

  const provider3 = await prisma.user.create({
    data: {
      username: 'janeDoeProvider',
      password: encodePassword('providerPass123'),
      email: 'jane.doe.provider@email.com',
      user_type: 'service_provider',
      Profile: {
        create: {
          first_name: 'Jane',
          last_name: 'Doe',
          phone_number: '0987654323',
          address: '456 secondary st',
          city: 'Provider City',
          county: 'Provider County',
          Eircode: 'A96NV91',
        },
      },
    },
  });

  const serviceCategory1 = await prisma.serviceCategory.create({
    data: {
      service_name: 'Plumbing',
      description: 'Fixing pipes and other plumbing services',
    },
  });

  const serviceCategory2 = await prisma.serviceCategory.create({
    data: {
      service_name: 'Electrical',
      description: 'Installation and repair of electrical systems',
    },
  });

  const serviceCategory3 = await prisma.serviceCategory.create({
    data: {
      service_name: 'Landscaping',
      description:
        'Garden maintenance, lawn mowing, and other landscaping services',
    },
  });

  const service1 = await prisma.service.create({
    data: {
      provider_id: provider1.user_id,
      service_type_id: serviceCategory1.service_category_id,
      description: 'Pipe fixing',
      pricing: 49.99,
      availability: 'Weekdays 9am-5pm',
    },
  });

  const service2 = await prisma.service.create({
    data: {
      provider_id: provider2.user_id,
      service_type_id: serviceCategory2.service_category_id,
      description: 'Wiring repair',
      pricing: 59.99,
      availability: 'Weekdays 10am-6pm',
    },
  });

  const service3 = await prisma.service.create({
    data: {
      provider_id: provider3.user_id,
      service_type_id: serviceCategory3.service_category_id,
      description: 'Lawn mowing',
      pricing: 34.99,
      availability: 'Weekends 8am-3pm',
    },
  });

  await prisma.contact.create({
    data: {
      user_id: user1.user_id,
      provider_id: provider1.user_id,
      who: 'user',
      message_content: 'Can you fix my sink?',
    },
  });

  await prisma.contact.create({
    data: {
      user_id: user2.user_id,
      provider_id: provider2.user_id,
      who: 'user',
      message_content: 'Do you do electrical inspections?',
    },
  });

  await prisma.contact.create({
    data: {
      user_id: user3.user_id,
      provider_id: provider3.user_id,
      who: 'user',
      message_content: 'Can you help with garden maintenance?',
    },
  });

  await prisma.review.create({
    data: {
      service_id: service1.service_id,
      reviewer_id: user1.user_id,
      rating: 4.5,
      comment: 'Great service!',
      date_posted: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      service_id: service2.service_id,
      reviewer_id: user2.user_id,
      rating: 4.7,
      comment: 'Prompt and professional service!',
      date_posted: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      service_id: service3.service_id,
      reviewer_id: user3.user_id,
      rating: 4.2,
      comment: 'Did a decent job with the lawn, but missed a few spots.',
      date_posted: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
