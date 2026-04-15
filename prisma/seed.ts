import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient({})

async function main() {
  console.log('Seed jalan...')

  // contoh insert (optional)
  // await prisma.user.create({
  //   data: {
  //     name: 'Admin',
  //     email: 'admin@mail.com',
  //   },
  // })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })