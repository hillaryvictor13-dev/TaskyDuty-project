import  Express  from "express";
import { CreateTask, getUserTasks, getAllTasks, getASingleTask,updateTask,deleteTask } from "../controller/task.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Express.Router()

router.post("/create", verifyToken, CreateTask);
router.get("/user-tasks", verifyToken, getUserTasks);
router.get("/all-tasks", verifyToken, getAllTasks);
router.get("/:taskId", verifyToken, getASingleTask);
router.patch("/update/:taskId",verifyToken, updateTask);
router.delete("/delete/:taskId", verifyToken, deleteTask);


export default router