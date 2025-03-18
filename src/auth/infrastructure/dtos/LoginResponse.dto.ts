import { Exclude, Expose, Type } from "class-transformer";
import { UserDto } from "src/user/application/dtos/User.dto";
import { User } from "src/user/domain/entities/User.entity";

export class LoginResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public user: UserDto
  ) { }
  // @Expose()
  // name: string;

  // @Expose()
  // last_name: string;

  // @Expose()
  // second_last_name: string;

  // @Expose()
  // phone: string;

  // @Expose()
  // mail: string;

  // // @Exclude()
  // // password: string;

  // // @Exclude()
  // // refresh_token: string;

  // // @Exclude()
  // // secret: string;

  // @Expose()
  // uuid_role: string;

  // @Exclude()
  // uuid_schedule: string;

  // @Expose()
  // uuid_user: string;

  // @Expose()
  // uuid_branch: string;

  // @Expose()
  // change_password: boolean;

  @Expose()
  @Type(() => UserDto)
  userData: UserDto;
}
