/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */





import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Ejemplo de prueba: obtener todos los usuarios
  const users = await prisma.users.findMany();
  console.log('Usuarios:', users);

  // Cerrar la conexión
  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log('Conectado a Prisma ');
  })
  .catch(async (error) => {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
