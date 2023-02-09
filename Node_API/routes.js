import { Router } from "express";

import { GetAll, FindOneById, CreateOne, UpdateOneById, DeleteOne } from "./controllers/EmployeeController.js";

const router = Router();

router.get("/employee/", GetAll);
router.get("/employee/:id", FindOneById);
router.post("/employee/", CreateOne);
router.put("/employee/:id", UpdateOneById);
router.delete("/employee/:id", DeleteOne);

export { router }