import { Test, TestingModule } from '@nestjs/testing';
import { RunningRecordController } from './running_record.controller';
import { RunningRecordService } from './running_record.service';

describe('RunningRecordController', () => {
  let controller: RunningRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunningRecordController],
      providers: [RunningRecordService],
    }).compile();

    controller = module.get<RunningRecordController>(RunningRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
