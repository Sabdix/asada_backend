import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Branch } from '../../branch/domain/entities/Branch.entity';
import { BranchReview } from '../../branch/domain/entities/BranchReview.entity';
import { CheckList } from '../../checkList/domain/entities/CheckList.entity';
import { CheckListGroup } from '../../checkList/domain/entities/CheckListGroup.entity';
import { CheckListGroupCheckList } from '../../checkList/domain/entities/CheckListGroupCheckList.entity';
import { CheckListHistory } from '../../checkList/domain/entities/CheckListHistory';
import { CheckListItem } from '../../checkList/domain/entities/CheckListItem.entity';
import { CheckListItemCriteria } from '../../checkList/domain/entities/CheckListItemCriteria.entity';
import { CheckListItemCriteriaAnswers } from '../../checkList/domain/entities/CheckListItemCriteriaAnswers.entity';
import { CheckListUser } from '../../checkList/domain/entities/CheckListUser.entity';
import { CheckListUserAnswers } from '../../checkList/domain/entities/CheckListUserAnswers';
import { Recipe } from '../../recipe/domain/entities/Recipe.entity';
import { RecipeCategory } from '../../recipe/domain/entities/RecipeCategory.entity';
import { Schedule } from '../../schedule/domain/entities/Schedule.entity';
import { ScheduleCalendar } from '../../schedule/domain/entities/ScheduleCalendar.entity';
import { ProductCategory } from '../../stock/domain/entities/ProductCategory.entity';
import { Stock } from '../../stock/domain/entities/Stock.entity';
import { StockHistory } from '../../stock/domain/entities/StockHistory.entity';
import { StockProduct } from '../../stock/domain/entities/StockProduct.entity';
import { Role } from '../../user/domain/entities/Role.entity';
import { User } from '../../user/domain/entities/User.entity';
import { WorkArea } from '../../user/domain/entities/WorkArea.entity';
import { SnakeNamingStrategy } from './snake-naming.strategy';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Branch,
    BranchReview,
    User,
    Role,
    Schedule,
    ScheduleCalendar,
    CheckList,
    CheckListItem,
    CheckListItemCriteria,
    CheckListItemCriteriaAnswers,
    CheckListUser,
    CheckListHistory,
    CheckListUserAnswers,
    CheckListGroup,
    CheckListGroupCheckList,
    Recipe,
    RecipeCategory,
    ProductCategory,
    StockProduct,
    Stock,
    StockHistory,
    WorkArea,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
