import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordController } from './running_record.controller';
import { RunningRecordService } from './running_record.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateRunningRecordDto } from './dto/create-running_record.dto';
import { UpdateRunningRecordDto } from './dto/update-running_record.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { RunningRecord } from './entities/running_record.entity';

describe('RunningRecordService', () => {
  let service: RunningRecordService;

  const mockRunningRecordService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getWeeklySummary: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRunningRecordRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunningRecordController],
      providers: [
        {
          provide: RunningRecordService,
          useValue: mockRunningRecordService,
        },
        {
          provide: getRepositoryToken(RunningRecord),
          useValue: mockRunningRecordRepository,
        },
      ],
    }).compile();

    service = module.get<RunningRecordService>(RunningRecordService);
  });

  it('should create a running record', async () => {
    const createDto: CreateRunningRecordDto = { distance: 5, workoutTime: '00:30:00', date: new Date(), userId: 1 };

    jest.spyOn(mockRunningRecordRepository, 'save').mockResolvedValue(createDto);
    await mockRunningRecordRepository.save(createDto);

    expect(mockRunningRecordRepository.save).toHaveBeenCalledWith(createDto);
    expect(mockRunningRecordRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should get all running records for a user', async () => {
    const records = [{ distance: 5, workoutTime: '00:30:00', date: new Date() }];
    service.findAll = jest.fn().mockResolvedValue(records);

    const response = await service.findAll(1);
    expect(response).toEqual(records);
    expect(service.findAll).toHaveBeenCalledWith(1);
  });

  it('should get weekly summary', async () => {
    const records = [
      { userId: 1, distance: 5, workoutTime: '00:30:00', date: new Date('2024-01-03') },
    ];

    const summary = [
      { weekNumber: 1, averageSpeed: '10.00', averageTime: '00:30:00', totalDistance: 5 },
    ];
    service.getWeeklySummary = jest.fn().mockResolvedValue(summary);

    mockRunningRecordRepository.find.mockResolvedValue(records);

    const response = await service.getWeeklySummary(1);

    expect(response).toEqual(expect.arrayContaining(summary));
  });


  it('should get a single running record by ID', async () => {
    const record = { distance: 5, workoutTime: '00:30:00', date: new Date() };
    service.findOne = jest.fn().mockResolvedValue(record);

    const response = await service.findOne(1, 1);
    expect(response).toEqual(record);
  });

  it('should update a running record', async () => {
    const updateDto: UpdateRunningRecordDto = { distance: 6, workoutTime: '00:35:00', date: new Date() };

    jest.spyOn(mockRunningRecordRepository, 'update').mockResolvedValue(updateDto);
    await mockRunningRecordRepository.update(updateDto);

    expect(mockRunningRecordRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should delete a running record', async () => {

    jest.spyOn(mockRunningRecordRepository, 'delete').mockResolvedValue(undefined);
    await mockRunningRecordRepository.delete(1, 1);

    expect(mockRunningRecordRepository.delete).toHaveBeenCalledWith(1, 1);
    expect(mockRunningRecordRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw UnauthorizedException if record is not found', async () => {
    service.findOne = jest.fn().mockRejectedValue(new UnauthorizedException('Workout not found'));

    await expect(service.findOne(999, 1)).rejects.toThrow(UnauthorizedException);
    expect(service.findOne).toHaveBeenCalledWith(999, 1);
  });
});
