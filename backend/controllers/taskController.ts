import { Request, Response, } from "express";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { AppDataSource } from "../../backend/app";
import { PATHS } from '../constants/paths';
import fs from 'fs';
import path from "path";
const asyncHandler = require("express-async-handler");

interface TaskParams {
    id: Task["id"];
}

exports.home = asyncHandler(async (req: Request, res: Response) => {
    res.sendFile(PATHS.home);
});

exports.createTaskOnPost = asyncHandler(async (req: Request<Task>, res: Response,) => {

    const task: Task = req.body;
    const taskRepository = AppDataSource.getRepository(Task);
    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);

    // Busca el usuario
    let userExistance = await userRepository.findOne({ where: { name: task.user.name } });
    if (userExistance) {
        task.user = userExistance
    }

    // Busca la categoria
    let categoryExistance = await categoryRepository.findOne({ where: { name: task.category.name } });
    if (categoryExistance) {
        task.category = categoryExistance
    }

    // Crea la tarea
    const newTask = taskRepository.create(task);

    await taskRepository.save(newTask);

    res.status(201).json({ message: 'Tarea creada', task: newTask });
});

exports.createTaskOnGet = asyncHandler(async (req: Request, res: Response) => {
    res.sendFile(PATHS.createTask);
});

exports.taskList = asyncHandler(async (req: Request<TaskParams>, res: Response) => {
    const page: number = req.params.id || 1;
    const tasks = await (getPaginatedTask(page));
    const path = PATHS.taskList
    showHtmlListResponce(path, tasks, res);
});

exports.pendindTask = asyncHandler(async (req: Request<TaskParams>, res: Response) => {
    const page: number = req.params.id || 1;
    const condition = { isCompleted: false };
    const tasks = await (getPaginatedTask(page, condition));
    const path = PATHS.taskList
    showHtmlListResponce(path, tasks, res);
});

exports.completedTask = asyncHandler(async (req: Request<TaskParams>, res: Response) => {
    const page: number = req.params.id || 1;
    const condition = { isCompleted: true };
    const tasks = await (getPaginatedTask(page, condition));
    const path = PATHS.taskList
    showHtmlListResponce(path, tasks, res);
});

exports.taskDetail = asyncHandler(async (req: Request<TaskParams>, res: Response) => {
    const task = await AppDataSource.getRepository(Task).findOne({ where: { id: req.params.id }, relations: ["user", "category"] });
    const path = PATHS.taskDetail;
    if(task) showHtmlDetailResponce(path, task, res);
    
});

exports.setCompleted = asyncHandler(async (req: Request<TaskParams>, res: Response) => {
    const task = await AppDataSource.getRepository(Task).findOne({ where: { id: req.params.id }, relations: ["user", "category"] });
    if(task) {
        const path = PATHS.taskDetail;
        task.isCompleted = true;
        await AppDataSource.getRepository(Task).save(task);
        showHtmlDetailResponce(path, task, res);
    }
})




const getPaginatedTask = async (page: number, condition?: any): Promise<Task[]> => {
    const pageSize = 5;
    const skip: number = (page - 1) * pageSize;
    const [tasks, _] = await AppDataSource.getRepository(Task).findAndCount({
        where: condition,
        skip: skip,
        take: pageSize,
    })
    return tasks
}

const showHtmlListResponce = (path: string, tasks: Task[], res: Response) =>{
    fs.readFile(path, 'utf-8', (err, html) => {
        if (err) {
            res.status(500).json({ error: 'Error al cargar la pagina' });
        }
        let htmlRes = '';
        tasks.forEach(task => {
            htmlRes +=
            `<tr>
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td>${task.isCompleted ? 'Completada' : 'Pendiente'}</td>
            </tr>`;
        });
        const finalHtml = html.replace('<!-- TASK_ROWS -->', htmlRes);
        res.send(finalHtml);
    });
}

const showHtmlDetailResponce = (path: string, task: Task, res: Response) =>{
    fs.readFile(path, 'utf-8', (err, html) => {
        if (err) {
            res.status(500).json({ error: 'Error al cargar la pagina' });
        }
        let htmlRes = `<tr>
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td>${task.user.name}</td>
                <td>${task.category.name}</td>
                <td>${task.isCompleted ? 'Completada' : 'Pendiente'}</td>
            </tr>`;
       
        const finalHtml = html.replace('<!-- TASK_DETAIL -->', htmlRes);
        res.send(finalHtml);
    })
}