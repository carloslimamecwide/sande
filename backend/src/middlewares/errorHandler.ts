import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error("❌ Error:", error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Erro de validação",
      details: error.errors,
    });
  }

  if (error.name === "MulterError") {
    return res.status(400).json({
      error: "Erro no upload de ficheiro",
      message: error.message,
    });
  }

  return res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
