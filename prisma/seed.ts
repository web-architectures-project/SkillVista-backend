import { PrismaClient, UserType } from '@prisma/client';
import { encodePassword } from '../src/utils/bcrypt';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function generateRandomUser() {
  const username = faker.internet.userName();
  const password = encodePassword('password');
  const email = faker.internet.email();
  const user_type = faker.helpers.arrayElement([
    UserType.user,
    UserType.service_provider,
  ]);
  const profile = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    county: faker.location.county(),
    Eircode: faker.location.zipCode(),
  };
  const user = await prisma.user.create({
    data: {
      username,
      password,
      email,
      user_type,
      Profile: {
        create: profile,
      },
    },
  });

  const dpt = faker.commerce.department();
  const serviceCategory = await prisma.serviceCategory.create({
    data: {
      service_name: dpt,
      description: faker.lorem.sentence(),
    },
  });

  const service = await prisma.service.create({
    data: {
      provider_id: user.user_id,
      service_type_id: serviceCategory.service_category_id,
      description: dpt,
      pricing: Number.parseInt(faker.commerce.price()),
      availability: faker.helpers.arrayElement([
        'Weekdays 9am-5pm',
        'Weekends 8am-3pm',
      ]),
    },
  });

  await prisma.contact.create({
    data: {
      user_id: user.user_id,
      provider_id: user.user_id - 1 || user.user_id + 1,
      who: 'user',
      message_content: faker.lorem.sentence(),
    },
  });

  await prisma.review.create({
    data: {
      service_id: service.service_id,
      reviewer_id: user.user_id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      date_posted: new Date(),
    },
  });
}

async function main() {
  for (let i = 0; i < 100; i++) {
    await generateRandomUser();
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
