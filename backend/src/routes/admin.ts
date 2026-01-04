import { Router } from "express";
import {
  createCar,
  updateCar,
  deleteCar,
  deleteCarImage,
  reorderCarImages,
  getAllCarsAdmin,
} from "../controllers/adminCarsController";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import { uploadImages } from "../middlewares/upload";

const router = Router();

// Todas as rotas requerem autenticação e role SUPER_ADMIN
router.use(authenticate);
router.use(requireRole("SUPER_ADMIN"));

router.get("/cars", getAllCarsAdmin);
router.post("/cars", uploadImages.array("images", 10), createCar);
router.put("/cars/:id", uploadImages.array("images", 10), updateCar);
router.delete("/cars/:id", deleteCar);
router.delete("/cars/:id/images/:imageId", deleteCarImage);
router.patch("/cars/:id/images/reorder", reorderCarImages);

export default router;
