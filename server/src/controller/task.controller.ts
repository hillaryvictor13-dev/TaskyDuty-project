import Task from "../model/task.model.js"
import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors"

export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const { title, description, tag } = req.body

    try {
        if (!title || !description || !tag) {
            return next(createHttpError(400, "Please provide title, description, and tag"))
        }

        if (!userId) {
            return next(createHttpError(401, "Unauthorized user"))
        }

        const task = await Task.create({ usernameId: userId, title, description, tag: tag.toLowerCase() })
        res.status(201).json({ task, message: "Task created successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while creating task"))
    }
}

export const getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id

    try {
        if (!userId) {
            return next(createHttpError(401, "Unauthorized user"))
        }

        const tasks = await Task.find({ usernameId: userId }).lean()
        if (!tasks || tasks.length === 0) {
            return next(createHttpError(404, "No tasks found for the user"))
        }

        res.status(200).json({ tasks, message: "User tasks retrieved successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while retrieving user tasks"))
    }
}

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {

    try {
         const tasks = await Task.find().lean().sort({ _id: -1 })
        if (!tasks || tasks.length === 0) {
            return next(createHttpError(404, "No tasks found for the user"))
        }

        res.status(200).json({ tasks, message: "User tasks retrieved successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while retrieving user tasks"))
    }
}

export const getASingleTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.taskId
    console.log("Params:", req.params);
    console.log("TaskId:", taskId);
    try {
        if (!taskId) {
            return next(createHttpError(400, "Please provide task id"))
        }
        const task = await Task.findById(taskId).lean()
        if (!task) {
            return next(createHttpError(404, "Task not found"))
        }
        res.status(200).json({ task, message: "Task retrieved successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while retrieving task"))
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.taskId
    const usernameId = req.user?.id
    const { title, description, tag } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            return next(createHttpError(404, "Task not found"))
        }
        if (!task.usernameId.equals(usernameId)) {
            return next(createHttpError(403, "Unauthorized to update this task"))
        }
        const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, tag: tag.toLowerCase() }, { new: true }).lean()
        res.status(200).json({ updatedTask, message: "Task updated successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while updating task"))
    }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.taskId
    const usernameId = req.user?.id
    try {
        if (!taskId) {
            return next(createHttpError(400, "Please provide task id"))
        }
        const task = await Task.findById(taskId)
        if (!task) {
            return next(createHttpError(404, "Task not found"))
        }
        if (!task.usernameId.equals(usernameId)) {
            return next(createHttpError(403, "Unauthorized to delete this task"))
        }
        await Task.findByIdAndDelete(taskId)
        res.status(200).json({ message: "Task deleted successfully", success: true })
    } catch (error) {
        return next(createHttpError(500, "Error occurred while deleting task"))
    }
}
