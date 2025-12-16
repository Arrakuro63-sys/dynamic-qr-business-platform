import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password,
      role: "ADMIN"
    }
  });

  const businessUser = await prisma.user.upsert({
    where: { email: "demo@cafe.com" },
    update: {},
    create: {
      email: "demo@cafe.com",
      password,
      role: "BUSINESS",
      business: {
        create: {
          name: "Demo Cafe",
          plan: "PRO"
        }
      }
    },
    include: { business: true }
  });

  const business = await prisma.business.findFirst({
    where: { userId: businessUser.id }
  });

  if (business) {
    await prisma.qrCode.createMany({
      data: [
        {
          uuid: "demo-menu-qr",
          title: "Demo Menü",
          type: "MENU",
          config: JSON.stringify({
            sections: [
              {
                title: "Kahveler",
                items: [
                  { name: "Espresso", price: "45₺" },
                  { name: "Latte", price: "60₺" }
                ]
              }
            ]
          }),
          businessId: business.id
        },
        {
          uuid: "demo-link-qr",
          title: "Instagram",
          type: "LINK",
          config: JSON.stringify({
            url: "https://instagram.com"
          }),
          businessId: business.id
        }
      ]
    });
  }

  console.log("Seed tamamlandı");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


