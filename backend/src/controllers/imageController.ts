import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getImage(req: Request, res: Response) {
  try {
    const { imageId } = req.params;

    const image = await prisma.carImage.findUnique({
      where: { id: imageId },
      select: {
        base64: true,
        mimeType: true,
        filename: true,
      },
    });

    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    // Converter base64 para buffer
    let base64Data = image.base64;

    // Remover prefixo data:image/...;base64, se existir
    if (base64Data.startsWith("data:")) {
      base64Data = base64Data.split(",")[1];
    }

    const buffer = Buffer.from(base64Data, "base64");

    // Cache headers para performance
    res.setHeader("Content-Type", image.mimeType);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", `"${imageId}"`);

    return res.send(buffer);
  } catch (error) {
    throw error;
  }
}
