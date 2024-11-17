import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import {Repository} from "typeorm";
import {RunningRecord} from "./entities/running_record.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateRunningRecordDto} from "./dto/update-running_record.dto";

@Injectable()
export class RunningRecordService {
  constructor(
      @InjectRepository(RunningRecord)
      private recordRepository: Repository<RunningRecord>
  ) {}

  async create(runningRecordDto: CreateRunningRecordDto) {
    await this.recordRepository.save(runningRecordDto);
  }

  async findAll(userId: number) {
    return await this.recordRepository.find({
      where: {userId},
    });
  }

  async findOne(id: number, userId: number) {
    const record = await this.recordRepository.findOne({
      where: {id, userId}
        }
    )

    if (!record) {
      throw new UnauthorizedException('Workout not found or you do not have permission to access it');
    }

    return record;
  }

  async update(id: number, userId: number, updateRunningRecordDto: UpdateRunningRecordDto) {
    const record = await this.recordRepository.findOne({
          where: {id, userId}
        }
    )

    if (!record) {
      throw new UnauthorizedException('Workout not found or you do not have permission to access it');
    }

    return await this.recordRepository.update(id, updateRunningRecordDto);
  }

  async remove(id: number, userId: number) {
    const record = await this.recordRepository.findOne({
          where: {id, userId}
        }
    )

    if (!record) {
      throw new UnauthorizedException('Workout not found or you do not have permission to access it');
    }

    return await this.recordRepository.delete(id);
  }
}
