import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProvider } from './common/database/providers/Database.provider';
import { BranchModule } from './branch/Branch.module';
import { CheckListModule } from './checkList/CheckList.module';
import { ScheduleLocalModule } from './schedule/ScheduleLocal.module';
import { UserModule } from './user/User.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './Task.Service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync(databaseProvider),
    ScheduleModule.forRoot(),
    BranchModule,
    CheckListModule,
    ScheduleLocalModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
