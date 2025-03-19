import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/user/infrastructure/repositories/role.repository';
import { CreateRoleRequestDto } from '../dtos/CreateRoleRequest.dto';
import { Role } from 'src/user/domain/entities/Role.entity';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) { }

    creteRole(request: CreateRoleRequestDto) {
        return this.roleRepository.save(
            this.roleRepository.create({
                name: request.name
            })
        )
    }

    getRoleByName(name: string) {
        return this.roleRepository.findOneBy({ name: name });
    }

    getRoleByUuid(uuid: string) {
        return this.roleRepository.findOneBy({ uuid: uuid });
    }

    getRoles() {
        return this.roleRepository.find({order:{hierarchy: 'ASC'}});
    }

    deleteRole(uuid: string) {
        return this.roleRepository.softDelete({uuid: uuid});
    }

    updateRole(role: Role) {
        return this.roleRepository.save(role);
    }
}
