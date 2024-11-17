import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {RunningRecordService} from './running_record.service';
import {CreateRunningRecordDto} from './dto/create-running_record.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UpdateRunningRecordDto} from "./dto/update-running_record.dto";

@UseGuards(JwtAuthGuard)
@Controller('running-record')
export class RunningRecordController {
  constructor(private readonly runningRecordService: RunningRecordService) {}


  @Post()
  create(@Req() request, @Body() createRunningRecordDto: CreateRunningRecordDto) {
    createRunningRecordDto.userId = +request.user.userId;
    return this.runningRecordService.create(createRunningRecordDto);
  }

  @Get()
  findAll(@Req() request) {
    const userId = +request.user.userId;
    return this.runningRecordService.findAll(userId);
  }

  @Get('summary')
  getWeeklySummary(@Req() request) {
    const userId = +request.user.userId;
    return this.runningRecordService.getWeeklySummary(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request) {
    const userId = +request.user.userId;
    return this.runningRecordService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() runningRecordDto: UpdateRunningRecordDto, @Req() request) {
    const userId = +request.user.userId;
    return this.runningRecordService.update(+id, userId, runningRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    const userId = +request.user.userId;
    return this.runningRecordService.remove(+id, userId);
  }
}
