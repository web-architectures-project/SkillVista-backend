import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Dummy data for User
  const user1 = await prisma.user.create({
    data: {
      username: 'johnDoe',
      password: 'securePass123',
      email: 'john.doe@email.com',
      user_type: 'user',
      Profile: {
        create: {
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '1234567890',
          address: '123 Main St',
          city: 'Sample City',
          county: 'Sample County',
          Eircode: '12345',
        },
      },
    },
  });

  // Dummy data for Provider
  const provider1 = await prisma.provider.create({
    data: {
      username: 'janeProvider',
      password: 'providerPass456',
      email: 'jane.provider@email.com',
      user_type: 'service_provider',
      Profile: {
        create: {
          first_name: 'Jane',
          last_name: 'Smith',
          phone_number: '0987654321',
          address: '456 Secondary St',
          city: 'Provider City',
          county: 'Provider County',
          Eircode: '54321',
        },
      },
    },
  });

  // Dummy data for ServiceCategory
  const serviceCategory1 = await prisma.serviceCategory.create({
    data: {
      service_name: 'Plumbing',
      description: 'Fixing pipes and other plumbing services',
    },
  });

  // Dummy data for Service
  const service1 = await prisma.service.create({
    data: {
      provider_id: provider1.provider_id,
      service_type_id: serviceCategory1.service_category_id,
      description: 'Pipe fixing',
      pricing: 49.99,
      availability: 'Weekdays 9am-5pm',
    },
  });

  // Dummy data for Contact
  await prisma.contact.create({
    data: {
      user_id: user1.user_id,
      provider_id: provider1.provider_id,
      who: 'user',
      message_content: 'Can you fix my sink?',
    },
  });

  // Dummy data for Review
  await prisma.review.create({
    data: {
      service_id: service1.service_id,
      reviewer_id: user1.user_id,
      rating: 4.5,
      comment: 'Great service!',
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
