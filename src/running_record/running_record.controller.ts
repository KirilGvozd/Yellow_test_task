import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RunningRecordService } from './running_record.service';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import { UpdateRunningRecordDto } from './dto/update-running_record.dto';

@Controller('running-record')
export class RunningRecordController {
  constructor(private readonly runningRecordService: RunningRecordService) {}

  @Post()
  create(@Body() createRunningRecordDto: CreateRunningRecordDto) {
    return this.runningRecordService.create(createRunningRecordDto);
  }

  @Get()
  findAll() {
    return this.runningRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runningRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRunningRecordDto: UpdateRunningRecordDto) {
    return this.runningRecordService.update(+id, updateRunningRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runningRecordService.remove(+id);
  }
}
