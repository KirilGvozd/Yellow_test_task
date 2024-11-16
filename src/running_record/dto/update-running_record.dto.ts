import { PartialType } from '@nestjs/mapped-types';
import { CreateRunningRecordDto } from './create-running_record.dto';

export class UpdateRunningRecordDto extends PartialType(CreateRunningRecordDto) {}
