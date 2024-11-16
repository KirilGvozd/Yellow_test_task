import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordService } from './running_record.service';

describe('RunningRecordService', () => {
  let service: RunningRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunningRecordService],
    }).compile();

    service = module.get<RunningRecordService>(RunningRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
