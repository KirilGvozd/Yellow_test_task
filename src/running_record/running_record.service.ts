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

    await this.recordRepository.update(id, updateRunningRecordDto);
  }

  async remove(id: number, userId: number) {
    const record = await this.recordRepository.findOne({
          where: {id, userId}
        }
    )

    if (!record) {
      throw new UnauthorizedException('Workout not found or you do not have permission to access it');
    }

    await this.recordRepository.delete(id);
  }

  async getWeeklySummary(userId: number) {
    const records = await this.recordRepository.find({
      where: {userId},
    });

    const weeklySummaries = Array.from({ length: 52 }, (_, index) => ({
      weekNumber: index + 1,
      totalDistance: 0,
      totalTime: 0,
      totalSpeed: 0,
      recordCount: 0,
    }));

    records.forEach(record => {
      const recordDate = new Date(record.date);
      const weekNumber = this.getWeekNumber(recordDate);

      if (weekNumber >= 1 && weekNumber <= 52) {
        const weekSummary = weeklySummaries[weekNumber - 1];
        weekSummary.totalDistance += record.distance;
        const [hours, minutes, seconds] = record.workoutTime.split(':').map(Number);
        const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
        weekSummary.totalTime += timeInSeconds;

        const speed = record.distance / (timeInSeconds / 3600);
        weekSummary.totalSpeed += speed;
        weekSummary.recordCount++;
      }
    });

    return weeklySummaries.map(summary => ({
      weekNumber: summary.weekNumber,
      averageSpeed: (summary.recordCount > 0 ? summary.totalSpeed / summary.recordCount : 0).toFixed(2),
      averageTime: this.formatSeconds(
          summary.recordCount > 0 ? summary.totalTime / summary.recordCount : 0,
      ),
      totalDistance: summary.totalDistance,
    }));
  }

  private getWeekNumber(recordDate: Date) {
    const firstDayOfYear = new Date(recordDate.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.floor(
        (recordDate.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    return Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
  }

  private formatSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
  }
}
