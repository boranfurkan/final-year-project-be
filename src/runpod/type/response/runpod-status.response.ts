import { ApiProperty } from '@nestjs/swagger';

export class RunpodStatusResponse {
  @ApiProperty({
    description: 'Whether the RunPod endpoint is running',
    example: true,
    type: Boolean,
  })
  isRunning: boolean;

  @ApiProperty({
    description: 'Worker status information',
    example: { idle: 0, running: 1 },
    type: Object,
  })
  workers: {
    idle: number;
    running: number;
  };

  @ApiProperty({
    description: 'Job status information',
    example: {
      completed: 10,
      failed: 2,
      inProgress: 1,
      inQueue: 3,
      retried: 0,
    },
    required: false,
    type: Object,
  })
  jobs?: {
    completed: number;
    failed: number;
    inProgress: number;
    inQueue: number;
    retried: number;
  };

  @ApiProperty({
    description: 'Error message if status check failed',
    example: 'Failed to check endpoint status',
    required: false,
    type: String,
  })
  error?: string;
}
