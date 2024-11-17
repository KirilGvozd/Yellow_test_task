import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordController } from './running_record.controller';
import { RunningRecordService } from './running_record.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import { UpdateRunningRecordDto } from './dto/update-running_record.dto';

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
    const createDto: CreateRunningRecordDto = { distance: 5, workoutTime: '00:30:00', date: new Date(), userId: 1 };
    const result = { message: 'Record created successfully' };

    service.create = jest.fn().mockResolvedValue(result);

    const response = await controller.create({ user: { userId: 1 } }, createDto);
    expect(response).toEqual(result);
    expect(service.create).toHaveBeenCalledWith({ ...createDto, userId: 1 });
  });

  it('should get all running records for a user', async () => {
    const records = [{ distance: 5, workoutTime: '00:30:00', date: new Date() }];
    service.findAll = jest.fn().mockResolvedValue(records);

    const response = await controller.findAll({ user: { userId: 1 } });
    expect(response).toEqual(records);
    expect(service.findAll).toHaveBeenCalledWith(1);
  });

  it('should get weekly summary', async () => {
    const summary = [{ weekNumber: 1, averageSpeed: '5.6', averageTime: '00:30:00', totalDistance: 5 }];
    service.getWeeklySummary = jest.fn().mockResolvedValue(summary);

    const response = await controller.getWeeklySummary({ user: { userId: 1 } });
    expect(response).toEqual(summary);
    expect(service.getWeeklySummary).toHaveBeenCalledWith(1);
  });

  it('should get a single running record by ID', async () => {
    const record = { distance: 5, workoutTime: '00:30:00', date: new Date() };
    service.findOne = jest.fn().mockResolvedValue(record);

    const response = await controller.findOne('1', { user: { userId: 1 } });
    expect(response).toEqual(record);
    expect(service.findOne).toHaveBeenCalledWith(1, 1);
  });

  it('should update a running record', async () => {
    const updateDto: UpdateRunningRecordDto = { distance: 6, workoutTime: '00:35:00', date: new Date() };
    const result = { message: 'Record updated successfully' };

    service.update = jest.fn().mockResolvedValue(result);

    const response = await controller.update('1', updateDto, { user: { userId: 1 } });
    expect(response).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(1, 1, updateDto);
  });

  it('should delete a running record', async () => {
    const result = { message: 'Record deleted successfully' };

    service.remove = jest.fn().mockResolvedValue(result);

    const response = await controller.remove('1', { user: { userId: 1 } });
    expect(response).toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });

  it('should throw UnauthorizedException if record is not found', async () => {
    service.findOne = jest.fn().mockRejectedValue(new UnauthorizedException('Workout not found'));

    await expect(controller.findOne('999', { user: { userId: 1 } })).rejects.toThrow(UnauthorizedException);
  });
});
