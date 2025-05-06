import { ApiProperty } from '@nestjs/swagger';

export class WorkersStatus {
  @ApiProperty({
    description: 'Number of idle workers',
    example: 0,
    type: Number,
  })
  idle: number;

  @ApiProperty({
    description: 'Number of running workers',
    example: 1,
    type: Number,
  })
  running: number;
}

export class JobsStatus {
  @ApiProperty({
    description: 'Number of completed jobs',
    example: 10,
    type: Number,
  })
  completed: number;

  @ApiProperty({
    description: 'Number of failed jobs',
    example: 2,
    type: Number,
  })
  failed: number;

  @ApiProperty({
    description: 'Number of jobs in progress',
    example: 1,
    type: Number,
  })
  inProgress: number;

  @ApiProperty({
    description: 'Number of jobs in queue',
    example: 3,
    type: Number,
  })
  inQueue: number;

  @ApiProperty({
    description: 'Number of retried jobs',
    example: 0,
    type: Number,
  })
  retried: number;
}

export class RunpodHealthResponse {
  @ApiProperty({
    description: 'Status of workers',
    type: WorkersStatus,
  })
  workers: WorkersStatus;

  @ApiProperty({
    description: 'Status of jobs',
    type: JobsStatus,
  })
  jobs: JobsStatus;
}
