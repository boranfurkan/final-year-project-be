import { ApiProperty } from '@nestjs/swagger';

export class RunpodWakeupResponse {
  @ApiProperty({
    description: 'Status of wake-up operation',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Message describing the wake-up operation result',
    example: 'RunPod endpoint wake-up signal sent successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Data returned from the RunPod API',
    example: {
      id: 'abc123',
      status: 'IN_QUEUE',
    },
    required: false,
  })
  data?: any;
}
