import { Router } from "express";
import { getCars, getCarById } from "../controllers/carsController";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById);

export default router;
