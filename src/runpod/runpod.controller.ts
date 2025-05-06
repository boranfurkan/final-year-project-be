import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { RunpodService } from './runpod.service';
import { RunpodHealthResponse } from './type/response/runpod-health.response';
import { RunpodStatusResponse } from './type/response/runpod-status.response';
import { RunpodWakeupResponse } from './type/response/runpod-wakeup.response';

@ApiTags('runpod')
@Controller('runpod')
export class RunpodController {
  constructor(private readonly runpodService: RunpodService) {}

  @Get('health')
  @Public()
  @ApiOperation({
    summary: 'Get RunPod endpoint health details',
    description:
      'Retrieves detailed health information from the RunPod API about the endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed RunPod endpoint health information',
    type: RunpodHealthResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to check RunPod endpoint health',
  })
  async getEndpointHealth(): Promise<RunpodHealthResponse> {
    return this.runpodService.getEndpointHealth();
  }

  @Get('status')
  @Public()
  @ApiOperation({
    summary: 'Check if RunPod endpoint is running',
    description:
      'Returns a simplified status indicating if the endpoint has running workers',
  })
  @ApiResponse({
    status: 200,
    description: 'RunPod endpoint running status',
    type: RunpodStatusResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to check endpoint status',
  })
  async isEndpointRunning(): Promise<RunpodStatusResponse> {
    return this.runpodService.isEndpointRunning();
  }

  @Post('wakeup')
  @Public()
  @ApiOperation({
    summary: 'Wake up the RunPod endpoint',
    description:
      'Sends a wake-up signal to the RunPod endpoint to start processing',
  })
  @ApiResponse({
    status: 200,
    description: 'Wake-up signal sent successfully',
    type: RunpodWakeupResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to wake up RunPod endpoint',
  })
  async wakeUpEndpoint(): Promise<RunpodWakeupResponse> {
    return this.runpodService.wakeUpEndpoint();
  }
}
