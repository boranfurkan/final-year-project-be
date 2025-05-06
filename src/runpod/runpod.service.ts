import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RunpodHealthResponse } from './type/response/runpod-health.response';
import { RunpodStatusResponse } from './type/response/runpod-status.response';
import { RunpodWakeupResponse } from './type/response/runpod-wakeup.response';

@Injectable()
export class RunpodService {
  private readonly runpodToken: string;
  private readonly runpodEndpointId: string;
  private readonly runpodBaseUrl: string = 'https://api.runpod.ai/v2';

  constructor(private readonly configService: ConfigService) {
    this.runpodToken = this.configService.get<string>('RUNPOD_TOKEN');
    this.runpodEndpointId =
      this.configService.get<string>('RUNPOD_ENDPOINT_ID');
  }

  async getEndpointHealth(): Promise<RunpodHealthResponse> {
    try {
      const response = await axios.get(
        `${this.runpodBaseUrl}/${this.runpodEndpointId}/health`,
        {
          headers: {
            Authorization: `Bearer ${this.runpodToken}`,
          },
        },
      );

      return response.data as RunpodHealthResponse;
    } catch (error) {
      console.error(
        'Error checking RunPod endpoint health:',
        error.message || error,
      );
      throw new Error('Failed to check RunPod endpoint health');
    }
  }

  async wakeUpEndpoint(): Promise<RunpodWakeupResponse> {
    try {
      const response = await axios.post(
        `${this.runpodBaseUrl}/${this.runpodEndpointId}/runsync`,
        {
          input: {}, // Empty input just to wake up the endpoint
        },
        {
          headers: {
            Authorization: `Bearer ${this.runpodToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        status: 'success',
        message: 'RunPod endpoint wake-up signal sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Error waking up RunPod endpoint:', error.message || error);
      throw new Error('Failed to wake up RunPod endpoint');
    }
  }

  async isEndpointRunning(): Promise<RunpodStatusResponse> {
    try {
      const healthData = await this.getEndpointHealth();

      // Check if there are any running workers
      const isRunning = healthData.workers && healthData.workers.running > 0;

      return {
        isRunning,
        workers: healthData.workers,
        jobs: healthData.jobs,
      };
    } catch (error) {
      console.error(
        'Error checking if RunPod endpoint is running:',
        error.message || error,
      );
      return {
        isRunning: false,
        workers: { idle: 0, running: 0 },
        error: 'Failed to check endpoint status',
      };
    }
  }
}
