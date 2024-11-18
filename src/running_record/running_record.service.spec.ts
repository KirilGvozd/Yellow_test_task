import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordService } from './running_record.service';
import { Repository } from 'typeorm';
import { RunningRecord } from './entities/running_record.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';

describe('RunningRecordService', () => {
  let service: RunningRecordService;
  let recordRepository: Repository<RunningRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunningRecordService,
        {
          provide: getRepositoryToken(RunningRecord),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RunningRecordService>(RunningRecordService);
    recordRepository = module.get<Repository<RunningRecord>>(
      getRepositoryToken(RunningRecord),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should save a running record with valid data', async () => {
      const saveSpy = jest.spyOn(recordRepository, 'save').mockResolvedValue(undefined);

      const dto = {
        distance: 5.5,
        userId: 1,
        workoutTime: '00:30:00',
        date: new Date('2024-11-01'),
      };
      await service.create(dto);

      expect(saveSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all running records for a user', async () => {
      const mockRecords = [
        {
          user: {
            id: 1,
            email: 'test@test.com',
            password: 'password',
            name: 'Name'
          },
          id: 1, userId: 1, distance: 5.5, workoutTime: '00:30:00', date: new Date('2024-11-01') },
      ];
      const findSpy = jest.spyOn(recordRepository, 'find').mockResolvedValue(mockRecords);

      const result = await service.findAll(1);

      expect(result).toEqual(mockRecords);
      expect(findSpy).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return a record if it exists and belongs to the user', async () => {
      const mockRecord = {
        user: {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          name: 'Name'
        },
        id: 1, userId: 1, distance: 5.5, workoutTime: '00:30:00', date: new Date('2024-11-01') };
      const findOneSpy = jest.spyOn(recordRepository, 'findOne').mockResolvedValue(mockRecord);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockRecord);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });

    it('should throw UnauthorizedException if record is not found', async () => {
      jest.spyOn(recordRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    it('should update a record with valid data', async () => {
      const mockRecord = {
        user: {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          name: 'Name'
        },
        id: 1, userId: 1, distance: 5.5, workoutTime: '00:30:00', date: new Date('2024-11-01') };
      jest.spyOn(recordRepository, 'findOne').mockResolvedValue(mockRecord);
      const updateSpy = jest.spyOn(recordRepository, 'update').mockResolvedValue(undefined);

      const updateDto = { distance: 6.0, workoutTime: '00:35:00', date: new Date('2024-11-02') };
      await service.update(1, 1, updateDto);

      expect(updateSpy).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw UnauthorizedException if record is not found', async () => {
      jest.spyOn(recordRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(1, 1, { distance: 6.0, workoutTime: '00:35:00', date: new Date('2024-11-02') }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should delete a record if it exists and belongs to the user', async () => {
      const mockRecord = {
        user: {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          name: 'Name'
        },
        id: 1, userId: 1, distance: 5.5, workoutTime: '00:30:00', date: new Date('2024-11-01') };
      jest.spyOn(recordRepository, 'findOne').mockResolvedValue(mockRecord);
      const deleteSpy = jest.spyOn(recordRepository, 'delete').mockResolvedValue(undefined);

      await service.remove(1, 1);

      expect(deleteSpy).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if record is not found', async () => {
      jest.spyOn(recordRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getWeeklySummary', () => {
    it('should return weekly summaries with valid calculations', async () => {
      const mockRecords = [
        {
          id: 1,
          user: {
            id: 1,
            email: 'test@test.com',
            password: 'password',
            name: 'Name'
          },
          userId: 1,
          date: new Date('2024-01-03'),
          distance: 10.0,
          workoutTime: '01:00:00',
        },
        {
          id: 2,
          user: {
            id: 1,
            email: 'test@test.com',
            password: 'password',
            name: 'Name'
          },
          userId: 1,
          date: new Date('2024-01-10'),
          distance: 5.0,
          workoutTime: '00:30:00',
        },
      ];
      jest.spyOn(recordRepository, 'find').mockResolvedValue(mockRecords);

      const result = await service.getWeeklySummary(1);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            weekNumber: 1,
            totalDistance: 10,
            averageTime: '01:00:00',
            averageSpeed: '10.00',
          }),
          expect.objectContaining({
            weekNumber: 2,
            totalDistance: 5,
            averageTime: '00:30:00',
            averageSpeed: '10.00',
          }),
        ]),
      );
    });
  });

  describe('getWeekNumber', () => {
    it('should calculate the correct week number', () => {
      const date = new Date('2024-01-03');
      const result = service['getWeekNumber'](date);
      expect(result).toBe(1);
    });
  });

  describe('formatSeconds', () => {
    it('should format seconds into HH:mm:ss correctly', () => {
      const time: number = 3661;
      const result: string = service['formatSeconds'](time);
      expect(result).toBe('01:01:01');
    });
  });
});
