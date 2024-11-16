import { Injectable } from '@nestjs/common';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import { UpdateRunningRecordDto } from './dto/update-running_record.dto';

@Injectable()
export class RunningRecordService {
  create(createRunningRecordDto: CreateRunningRecordDto) {
    return 'This action adds a new runningRecord';
  }

  findAll() {
    return `This action returns all runningRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} runningRecord`;
  }

  update(id: number, updateRunningRecordDto: UpdateRunningRecordDto) {
    return `This action updates a #${id} runningRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} runningRecord`;
  }
}
