import { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

const createCarSchema = z.object({
  title: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.string().regex(/^\d{4}$/),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  mileage: z.string().regex(/^\d+$/),
  fuel: z.string().min(1),
  transmission: z.string().min(1),
  description: z.string().min(1),
  isPublished: z.string().optional(),
});

const updateCarSchema = createCarSchema.partial();

export async function createCar(req: AuthRequest, res: Response) {
  try {
    const data = createCarSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Pelo menos uma imagem é necessária" });
    }

    // Criar carro
    const car = await prisma.car.create({
      data: {
        title: data.title,
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        mileage: parseInt(data.mileage),
        fuel: data.fuel,
        transmission: data.transmission,
        description: data.description,
        isPublished: data.isPublished === "true",
      },
    });

    // Criar imagens em base64
    const imagePromises = files.map((file, index) => {
      const base64 = file.buffer.toString("base64");
      return prisma.carImage.create({
        data: {
          carId: car.id,
          filename: file.originalname,
          mimeType: file.mimetype,
          base64,
          sortOrder: index,
        },
      });
    });

    await Promise.all(imagePromises);

    // Retornar carro com imagens
    const carWithImages = await prisma.car.findUnique({
      where: { id: car.id },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return res.status(201).json(carWithImages);
  } catch (error) {
    throw error;
  }
}

export async function updateCar(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const data = updateCarSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    // Atualizar campos do carro
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.make) updateData.make = data.make;
    if (data.model) updateData.model = data.model;
    if (data.year) updateData.year = parseInt(data.year);
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.mileage) updateData.mileage = parseInt(data.mileage);
    if (data.fuel) updateData.fuel = data.fuel;
    if (data.transmission) updateData.transmission = data.transmission;
    if (data.description) updateData.description = data.description;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished === "true";

    await prisma.car.update({
      where: { id },
      data: updateData,
    });

    // Adicionar novas imagens se fornecidas
    if (files && files.length > 0) {
      const existingImagesCount = await prisma.carImage.count({ where: { carId: id } });

      const imagePromises = files.map((file, index) => {
        const base64 = file.buffer.toString("base64");
        return prisma.carImage.create({
          data: {
            carId: id,
            filename: file.originalname,
            mimeType: file.mimetype,
            base64,
            sortOrder: existingImagesCount + index,
          },
        });
      });

      await Promise.all(imagePromises);
    }

    const updatedCar = await prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return res.json(updatedCar);
  } catch (error) {
    throw error;
  }
}

export async function deleteCar(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    await prisma.car.delete({ where: { id } });

    return res.json({ message: "Carro eliminado com sucesso" });
  } catch (error) {
    throw error;
  }
}

export async function deleteCarImage(req: AuthRequest, res: Response) {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.carImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.carId !== id) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    await prisma.carImage.delete({ where: { id: imageId } });

    return res.json({ message: "Imagem eliminada com sucesso" });
  } catch (error) {
    throw error;
  }
}

export async function reorderCarImages(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { imageIds } = z.object({ imageIds: z.array(z.string()) }).parse(req.body);

    // Verificar se todas as imagens pertencem ao carro
    const images = await prisma.carImage.findMany({
      where: { carId: id },
    });

    const imageIdsSet = new Set(images.map((img: { id: string }) => img.id));
    const allValid = imageIds.every((id: string) => imageIdsSet.has(id));

    if (!allValid) {
      return res.status(400).json({ error: "IDs de imagem inválidos" });
    }

    // Atualizar sortOrder
    const updates = imageIds.map((imageId, index) =>
      prisma.carImage.update({
        where: { id: imageId },
        data: { sortOrder: index },
      })
    );

    await Promise.all(updates);

    return res.json({ message: "Ordem das imagens atualizada" });
  } catch (error) {
    throw error;
  }
}

export async function getAllCarsAdmin(req: AuthRequest, res: Response) {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return res.json({ cars });
  } catch (error) {
    throw error;
  }
}
