import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { User } from 'src/user/domain/entities/User.entity';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { ChangePasswordRequestDto } from 'src/user/application/dtos/ChangePasswordRequest.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
  getUserByMailAndPassword(request : LoginRequestDto) {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.branch', 'branch')
      .leftJoinAndSelect('user.role','role')
      .where('user.mail = :mail', { mail: request.mail })
      .andWhere('user.password = :password', { password: crypto.createHash('sha256').update(request.password).digest('hex') })
      .getOne();
  }

  getUserByUuidAndPassword(request : ChangePasswordRequestDto, uuid: string) {
    return this.repo
      .createQueryBuilder('user')
      .where('user.uuid = :uuid', { uuid: uuid })
      .andWhere('user.password = :password', { password: crypto.createHash('sha256').update(request.oldPassword).digest('hex') })
      .getOne();
  }

}