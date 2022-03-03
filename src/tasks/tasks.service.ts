import { Get, Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id: string): ITask {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTaskById(id: string): ITask[] {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks;
  }

  updateTaskStatus(id: string, status: TaskStatus): ITask {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  getTasksByFilters(filterDto: GetTasksFilterDto): ITask[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = this.tasks.filter((task) => task.status === status);
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

  createTasks(createTaskDto: CreateTaskDto): ITask {
    const task: ITask = {
      ...createTaskDto,
      id: uuid(),
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
