syarat Utama Iintall for dev
1. DB MYSQL
2. NODE version 22


node:
1. nvm intall 22  ==> install node
1. nvm use 22 ==> ganti node version


FOR Prisma
1. npx prisma generate-->Generate COde Prisama 
2. npx prisma db seed --->Untuk masukan isi DB Pertama
3. npx prisma migrate dev --name init     ====>Untuk memebuat Migrasi hany untuk init atau perama kali
4. npx prisma migrate dev --name add_customer_table   ===gunkan ini untuk tabahan data base
4. npx prisma migrate reset     ===> RESET Migrasi



for all

1.npm run dev ---> run dev
2.npm run prisma:all ---> generate and migrate prpisma to db
