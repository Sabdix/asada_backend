import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { CreateUserRequestDto } from '../dtos/CreateUserRequest.dto';
import { User } from 'src/user/domain/entities/User.entity';
import * as crypto from 'crypto';
import { ChangePasswordRequestDto } from '../dtos/ChangePasswordRequest.dto';
import { Branch } from 'src/branch/domain/entities/Branch.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  getUserByMailAndPassword(request: LoginRequestDto) {
    return this.userRepository.getUserByMailAndPassword(request)
  }

  getUserByUuidAndPassword(request: ChangePasswordRequestDto, uuid: string) {
    return this.userRepository.getUserByUuidAndPassword(request, uuid)
  }

  getUsers() {
    return this.userRepository.find({ relations: ['role', 'manager', 'branch', 'schedule'] });
  }

  getUserByMail(mail: string) {
    return this.userRepository.findOneBy({ mail: mail })
  }

  getUserByUuid(uuid: string) {
    return this.userRepository.findOne(
      { where: { uuid: uuid }, relations: ['role', 'manager', 'branch', 'schedule'] }
    );
  }

  creteUser(request: CreateUserRequestDto) {
    return this.userRepository.save(
      this.userRepository.create({
        name: request.name,
        last_name: request.last_name,
        second_last_name: request.second_last_name,
        mail: request.mail,
        password: crypto.createHash('sha256').update(request.password).digest('hex'),
        phone: request.phone,
        secret: crypto.randomBytes(64).toString('hex'),
        uuid_role: request.uuid_role,
        uuid_branch: request.uuid_branch
      })
    )
  }

  deleteUser(uuid: string) {
    return this.userRepository.softDelete({ uuid: uuid });
  }

  UpdateUser(user: User) {
    return this.userRepository.save(user);
  }

  getUsersByBranch(uuid_branch: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.uuid_branch = :uuid_branch', { uuid_branch: uuid_branch })
      .innerJoinAndSelect('user.role', 'role')
      .orderBy('role.hierarchy', 'ASC')
      .getMany();
  }

}
