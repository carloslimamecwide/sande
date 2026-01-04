import app from "./app";
import { env } from "./lib/env";
import prisma from "./lib/prisma";

const PORT = parseInt(env.PORT);

async function bootstrap() {
  try {
    // Testar conexão à BD
    await prisma.$connect();
    console.log("✅ Conectado à base de dados");

    // Iniciar servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
      console.log(`📊 Ambiente: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recebido, a encerrar...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recebido, a encerrar...");
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
