import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProvider } from './common/database/providers/Database.provider';
import { BranchModule } from './branch/Branch.module';
import { CheckListModule } from './checkList/CheckList.module';
import { ScheduleModule } from './schedule/Schedule.module';
import { UserModule } from './user/User.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync(databaseProvider),
    BranchModule,
    CheckListModule,
    ScheduleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
