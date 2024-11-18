import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordController } from './running_record.controller';
import { RunningRecordService } from './running_record.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import { UpdateRunningRecordDto } from './dto/update-running_record.dto';
import { RunningRecord } from './entities/running_record.entity';
import { User } from '../auth/entities/user.entity';
import { request } from 'express';

describe('RunningRecordController', () => {
  let controller: RunningRecordController;
  let service: RunningRecordService;

  beforeEach(async () => {
    const mockRunningRecordService = {
      create: jest.fn(),
      findAll: jest.fn(),
      getWeeklySummary: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunningRecordController],
      providers: [
        {
          provide: RunningRecordService,
          useValue: mockRunningRecordService,
        },
      ],
    }).compile();

    controller = module.get<RunningRecordController>(RunningRecordController);
    service = module.get<RunningRecordService>(RunningRecordService);
  });

  it('should create a running record', async () => {
    const mockRequest = { user: { userId: '1' } };
    const mockDto: CreateRunningRecordDto = {
      userId: null,
      distance: 5,
      workoutTime: "00:30:00",
      date: new Date(),
    };
    jest.spyOn(service, "create").mockResolvedValue()

    await controller.create(mockRequest, mockDto);

    expect(service.create).toHaveBeenCalledWith({...mockDto, userId: +mockRequest.user.userId});
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should get all running records for a user', async () => {

    const records: RunningRecord[] = [{
      user: {id: 1, password: "1234", email: "example@example.com", name: "Example"},
      id:1, userId: 1, distance: 5, workoutTime: '00:30:00', date: new Date() }];

    jest.spyOn(service, "findAll").mockResolvedValue(records);

    const response = await controller.findAll({user: {userId: 1}});
    expect(response).toEqual(records);
    expect(service.findAll).toHaveBeenCalledWith(records[0].userId);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should get weekly summary', async () => {
    const summary = [{ weekNumber: 1, averageSpeed: '5.6', averageTime: '00:30:00', totalDistance: 5 }];
    const user = { user: { userId: 1 } }

    jest.spyOn(service, "getWeeklySummary").mockResolvedValue(summary);

    const response = await controller.getWeeklySummary(user);
    expect(response).toEqual(summary);
    expect(service.getWeeklySummary).toHaveBeenCalledWith(user.user.userId);
    expect(service.getWeeklySummary).toHaveBeenCalledTimes(1);
  });

  it('should get a single running record by ID', async () => {
    const record = { user: {id: 1, password: "1234", email: "example@example.com", name: "Example"},
      id:1, userId: 1, distance: 5, workoutTime: '00:30:00', date: new Date() };

    jest.spyOn(service, "findOne").mockResolvedValue(record)

    const response = await controller.findOne('1', { user: { userId: 1 } });
    expect(response).toEqual(record);
    expect(service.findOne).toHaveBeenCalledWith(record.id, record.user.id)
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a running record', async () => {
    const updateDto: UpdateRunningRecordDto = { distance: 6, workoutTime: '00:35:00', date: new Date() };

    jest.spyOn(service, 'update').mockResolvedValue();

    await controller.update('1', updateDto, { user: { userId: 1 } });

    expect(service.update).toHaveBeenCalledWith(1, 1, updateDto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('should delete a running record', async () => {

    jest.spyOn(service, 'remove').mockResolvedValue();

    await controller.remove('1', { user: { userId: 1 } });

    expect(service.remove).toHaveBeenCalledWith(1, 1);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });

  it('should throw UnauthorizedException if record is not found', async () => {
    const user = { user: { userId: 1 }, }

    jest.spyOn(service, 'findOne').mockRejectedValue(new UnauthorizedException('Workout not found'))

    await expect(controller.findOne('999', user )).rejects.toThrow(UnauthorizedException);
    expect(service.findOne).toHaveBeenCalledWith(999, user.user.userId);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });
});
