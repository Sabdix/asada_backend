import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { CreateUserRequestDto } from '../dtos/CreateUserRequest.dto';
import { User } from 'src/user/domain/entities/User.entity';
import * as crypto from 'crypto';
import { ChangePasswordRequestDto } from '../dtos/ChangePasswordRequest.dto';
import { ForgotPasswordRequestDto } from 'src/auth/infrastructure/dtos/ForgotPaswordRequest.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  getUserByMailAndPassword(request: LoginRequestDto) {
    return this.userRepository.getUserByMailAndPassword(request)
  }

  getUserByUuidAndPassword(request: ChangePasswordRequestDto, uuid: string) {
    return this.userRepository.getUserByUuidAndPassword(request, uuid)
  }

  getUserByMailAndPhone(request: ForgotPasswordRequestDto) {
    return this.userRepository.findOne({ where: { mail: request.mail, phone: request.phone } })
  }

  getUsers() {
    // return this.userRepository.find({
    //   relations: ['role', 'manager', 'branch', 'schedule'],
    //   withDeleted: true
    // });

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.deletedAt IS NOT NULL OR role.deletedAt IS NULL')
      .leftJoinAndSelect('user.manager', 'manager', 'manager.deletedAt IS NOT NULL OR manager.deletedAt IS NULL')
      .leftJoinAndSelect('user.branch', 'branch', 'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL')
      .leftJoinAndSelect('user.schedule', 'schedule', 'schedule.deletedAt IS NOT NULL OR schedule.deletedAt IS NULL')
      .leftJoinAndSelect('user.workArea', 'workArea', 'workArea.deletedAt IS NOT NULL OR workArea.deletedAt IS NULL')
      .where('user.deletedAt IS NULL')
      .getMany();
  }

  getUserByMail(mail: string) {
    return this.userRepository.findOneBy({ mail: mail })
  }

  getUserByUuid(uuid: string) {
    // return this.userRepository.findOne({
    //   where: { uuid: uuid },
    //   relations: ['role', 'manager', 'branch', 'schedule'],
    //   withDeleted: true
    // });

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.deletedAt IS NOT NULL OR role.deletedAt IS NULL')
      .leftJoinAndSelect('user.manager', 'manager', 'manager.deletedAt IS NOT NULL OR manager.deletedAt IS NULL')
      .leftJoinAndSelect('user.branch', 'branch', 'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL')
      .leftJoinAndSelect('user.schedule', 'schedule', 'schedule.deletedAt IS NOT NULL OR schedule.deletedAt IS NULL')
      .leftJoinAndSelect('user.workArea', 'workArea', 'workArea.deletedAt IS NOT NULL OR workArea.deletedAt IS NULL')
      .where('user.uuid = :uuid', { uuid })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
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
        uuid_branch: request.uuid_branch,
        uuid_work_area: request.uuid_work_area
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
      .leftJoinAndSelect('user.role', 'role', 'role.deletedAt IS NOT NULL OR role.deletedAt IS NULL')
      .leftJoinAndSelect('user.manager', 'manager', 'manager.deletedAt IS NOT NULL OR manager.deletedAt IS NULL')
      .leftJoinAndSelect('user.branch', 'branch', 'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL')
      .leftJoinAndSelect('user.workArea', 'workArea', 'workArea.deletedAt IS NOT NULL OR workArea.deletedAt IS NULL')
      .orderBy('role.hierarchy', 'ASC')
      .getMany();
  }

  getUserMannagerByUuid(uuid: string, uuid_manager: string) {
    // return this.userRepository.findOne({
    //   where: { uuid: uuid },
    //   relations: ['role', 'manager', 'branch', 'schedule'],
    //   withDeleted: true
    // });

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.deletedAt IS NOT NULL OR role.deletedAt IS NULL')
      .leftJoinAndSelect('user.manager', 'manager', 'manager.deletedAt IS NOT NULL OR manager.deletedAt IS NULL')
      .leftJoinAndSelect('user.branch', 'branch', 'branch.deletedAt IS NOT NULL OR branch.deletedAt IS NULL')
      .leftJoinAndSelect('user.schedule', 'schedule', 'schedule.deletedAt IS NOT NULL OR schedule.deletedAt IS NULL')
      .leftJoinAndSelect('user.workArea', 'workArea', 'workArea.deletedAt IS NOT NULL OR workArea.deletedAt IS NULL')
      .where('user.uuid = :uuid', { uuid })
      .andWhere('manager.uuid = :uuid_manager', { uuid_manager })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  UnassignManager(user: User) {
    return this.userRepository.update({ uuid: user.uuid }, { manager: new User, uuid_user: null });
  }
}
