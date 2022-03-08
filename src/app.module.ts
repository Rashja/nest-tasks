import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule,MongooseModule.forRoot('mongodb+srv://nest-tasks:zrU6pXkSQZh2PVH6@cluster0.l0syj.mongodb.net/nest-tasks?retryWrites=true&w=majority')],
})
export class AppModule {}
