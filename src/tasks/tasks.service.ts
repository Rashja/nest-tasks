import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];
  constructor(@InjectModel('Task') private readonly taskModel: Model<ITask>) {}

  async getAllTasks(): Promise<ITask[]> {
    const tasks = await this.taskModel.find().exec();

    return tasks;
  }

  async getTaskById(id: string): Promise<ITask> {
    let found;
    try {
      found = await this.taskModel.findById(id);
    } catch (error) {
      throw new NotFoundException(`Not found task by ID "${id}"`);
    }
    if (!found) {
      throw new NotFoundException(`Not found task by ID "${id}"`);
    }

    return found;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result=await this.taskModel.deleteOne({ _id:id }).exec();
    
    if(result.deletedCount === 0){
      throw new NotFoundException(`Not found task by ID "${id}"`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<ITask> {
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }

  async getTasksByFilters(filterDto: GetTasksFilterDto): Promise<ITask[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  async createTasks(createTaskDto: CreateTaskDto): Promise<ITask> {
    const newTask = new this.taskModel({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });

    const result = await newTask.save();

    return result;
  }
}
