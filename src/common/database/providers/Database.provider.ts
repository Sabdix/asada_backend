import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Branch } from 'src/branch/domain/entities/Branch.entity';
import { CheckList } from 'src/checkList/domain/entities/CheckList.entity';
import { CheckListItem } from 'src/checkList/domain/entities/CheckListItem.entity';
import { CheckListItemCriteria } from 'src/checkList/domain/entities/CheckListItemCriteria.entity';
import { CheckListItemCriteriaAnswers } from 'src/checkList/domain/entities/CheckListItemCriteriaAnswers.entity';
import { CheckListUser } from 'src/checkList/domain/entities/CheckListUser.entity';
import { Schedule } from 'src/schedule/domain/entities/Schedule.entity';
import { ScheduleCalendar } from 'src/schedule/domain/entities/ScheduleCalendar.entity';
import { Role } from 'src/user/domain/entities/Role.entity';
import { User } from 'src/user/domain/entities/User.entity';
import { DataSourceOptions } from 'typeorm';

export const databaseProvider: TypeOrmModuleAsyncOptions = {
  /*type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USER,
  password: '',
  database: process.env.DB_DATABASE,
  entities: [
    Branch,
    User,
    Role,
    Schedule,
    ScheduleCalendar,
    CheckList,
    CheckListItem,
    CheckListItemCriteria,
    CheckListItemCriteriaAnswers,
    CheckListUser
  ],
  synchronize: true,
  logging: true,
  migrationsTableName: 'migrations',*/
  
    imports: [ConfigModule],
    inject: [ConfigService],
    
    useFactory: (configService: ConfigService) => ({
      type: 'mysql', // Change this to 'postgres' if using PostgreSQL
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [
        Branch,
        User,
        Role,
        Schedule,
        ScheduleCalendar,
        CheckList,
        CheckListItem,
        CheckListItemCriteria,
        CheckListItemCriteriaAnswers,
        CheckListUser
      ],
      synchronize: false,
      logging: false,
    })
};