import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@site.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";

  // Verifica se já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Super admin já existe: ${adminEmail}`);
    return;
  }

  // Criar super admin
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✅ Super admin criado: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
