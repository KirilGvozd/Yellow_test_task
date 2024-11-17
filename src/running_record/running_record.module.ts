import { Module } from '@nestjs/common';
import { RunningRecordService } from './running_record.service';
import { RunningRecordController } from './running_record.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RunningRecord} from "./entities/running_record.entity";
import {JwtStrategy} from "../auth/jwt.strategy";

@Module({
  imports: [
      TypeOrmModule.forFeature([RunningRecord]),
  ],
  controllers: [RunningRecordController],
  providers: [RunningRecordService, JwtStrategy],
})
export class RunningRecordModule {}
