import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<ITask[]> {
    if (Object.keys(filterDto).length) {
      const filterTasks = await this.taskService.getTasksByFilters(filterDto);
      return filterTasks;
    } else {
      const tasks = await this.taskService.getAllTasks();
      return tasks;
    }
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<ITask> {
    const taskById = await this.taskService.getTaskById(id);
    return taskById;
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<ITask> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<ITask> {
    return this.taskService.createTasks(createTaskDto);
  }
}
