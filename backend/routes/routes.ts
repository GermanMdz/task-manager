import { Router } from "express";
// import { createTaskOnPost } from "../controllers/taskController";

const taskController = require("../controllers/taskController");
export const router = Router();

// RUTAS 
router.get("/", taskController.home);

router.get("/task", taskController.createTaskOnGet);
router.post("/task", taskController.createTaskOnPost);

router.get("/task/:id", taskController.taskDetail);
router.post("/task/:id/completed", taskController.setCompleted);
router.get("/tasks/:id?", taskController.taskList);
router.get("/pendings/:id?", taskController.pendindTask);     // id corresponde a la pagina
router.get("/completed/:id?", taskController.completedTask);  // id corresponde a la pagina
