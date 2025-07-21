import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { WorkAreaRepository } from 'src/user/infrastructure/repositories/workArea.repository';

@Injectable()
export class WorkAreaService {
  constructor(private readonly workAreaRepository: WorkAreaRepository) { }

  getAllWorkArea() {
    return this.workAreaRepository.find()
  }

  getWorkAreaByUuid(uuid: string) {
    return this.workAreaRepository.findOneBy({uuid: uuid})
  }

}
