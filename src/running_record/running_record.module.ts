import { Module } from '@nestjs/common';
import { RunningRecordService } from './running_record.service';
import { RunningRecordController } from './running_record.controller';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      TypeOrmModule.forFeature([])
  ],
  controllers: [RunningRecordController],
  providers: [RunningRecordService],
})
export class RunningRecordModule {}
