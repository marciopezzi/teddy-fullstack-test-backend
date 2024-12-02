import 'dotenv/config';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Client } from './clients/entities/client.entity';


const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Client],
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected!');

    const clientRepository = AppDataSource.getRepository(Client);

    const clients: Partial<Client>[] = [];
    for (let i = 0; i < 100; i++) {
      clients.push({
        name: faker.person.fullName(),
        salary: parseFloat(faker.finance.amount({
          dec: 2, min: 2000, max: 90000
        })),
        companyValue: parseFloat(faker.finance.amount({
          dec: 2, min: 20000, max: 900000000
        })),
      });
    }

    await clientRepository.insert(clients);
    console.log('🎉 Database seeded with fake data!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
