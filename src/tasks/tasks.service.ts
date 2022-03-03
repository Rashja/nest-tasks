import { Get, Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id:string):ITask{
    return this.tasks.find(task => task.id === id)
  }

  createTasks(createTaskDto:CreateTaskDto): ITask {
    const task: ITask = {
      ...createTaskDto,
      id: uuid(),
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
