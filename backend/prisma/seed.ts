import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");
    //既存DB内容を削除
    await prisma.reservation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.hotel.deleteMany();

    //Testデータ作成
    await prisma.hotel.create({
        data: {
            name: 'Osaka Test Hotel',
            prefecture: '大阪府',
            description: 'Test Hotel for development',
            rooms: {
                create: [
                    {
                        name: 'Single Room',
                        capacity: 1,
                        price_per_night: 12000,
                    },
                    {
                        name: 'Double Room',
                        capacity: 2,
                        price_per_night: 20000,
                    },
                ],
            },
        },
    });

    await prisma.hotel.create({
        data: {
            name: 'Tokyo Test Hotel',
            prefecture: '東京都',
            description: 'Another test hotel',
            rooms: {
                create: [
                    {
                        name: 'Standard Room',
                        capacity: 2,
                        price_per_night: 15000,
                    },
                    {
                        name: 'Suite Room',
                        capacity: 4,
                        price_per_night: 40000,
                    },
                ],
            },
        },
    });

    console.log('Seeding finished!');
}

//接続を切断 
main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) =>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});