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
import { RecipeModule } from './recipe/Recipe.module';
import { StockModule } from './stock/Stock.module';
import { NotificationModule } from './notification/notification.module';
import { DashboardModule } from './dashboard/dashboard.module';

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
    RecipeModule,
    StockModule,
    NotificationModule,
    DashboardModule
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
