import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/user/domain/entities/Role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(@InjectRepository(Role) private readonly repo: Repository<Role>) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  
}