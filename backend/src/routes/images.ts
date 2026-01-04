import { Router } from "express";
import { getImage } from "../controllers/imageController";

const router = Router();

router.get("/:imageId", getImage);

export default router;
