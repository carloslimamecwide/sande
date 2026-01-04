import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const carsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().default("1"),
  pageSize: z.string().default("12"),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  make: z.string().optional(),
  year: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
});

export async function getCars(req: Request, res: Response) {
  try {
    const query = carsQuerySchema.parse(req.query);
    const page = parseInt(query.page);
    const pageSize = parseInt(query.pageSize);
    const skip = (page - 1) * pageSize;

    const where: any = { isPublished: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { make: { contains: query.search, mode: "insensitive" } },
        { model: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.make) {
      where.make = { contains: query.make, mode: "insensitive" };
    }

    if (query.year) {
      where.year = parseInt(query.year);
    }

    if (query.fuel) {
      where.fuel = { contains: query.fuel, mode: "insensitive" };
    }

    if (query.transmission) {
      where.transmission = { contains: query.transmission, mode: "insensitive" };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: pageSize,
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
      }),
      prisma.car.count({ where }),
    ]);

    return res.json({
      cars,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getCarById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id, isPublished: true },
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

    if (!car) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    return res.json(car);
  } catch (error) {
    throw error;
  }
}
