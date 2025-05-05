import axios from 'axios';
import FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpfsService {
  private readonly pinataApiKey: string;
  private readonly pinataSecretApiKey: string;
  private readonly pinataBaseUrl: string = 'https://api.pinata.cloud';

  constructor(private readonly configService: ConfigService) {
    this.pinataApiKey = this.configService.get<string>('PINATA_API_KEY');
    this.pinataSecretApiKey = this.configService.get<string>(
      'PINATA_SECRET_API_KEY',
    );
  }

  async uploadFileToIPFS(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, { filename: fileName });

      const metadata = JSON.stringify({
        name: fileName,
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretApiKey,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to upload file to IPFS: ${response.statusText}`,
        );
      }

      // Return the IPFS URL
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error.message || error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSONToIPFS(
    jsonData: object,
    metadataName: string,
  ): Promise<string> {
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: metadataName,
        },
        pinataContent: jsonData,
      });

      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretApiKey,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to upload JSON to IPFS: ${response.statusText}`,
        );
      }

      // Return the IPFS URL
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error.message || error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  // Helper method to convert IPFS URL to HTTP gateway URL for easier access
  convertToGatewayURL(ipfsUrl: string): string {
    if (!ipfsUrl.startsWith('ipfs://')) {
      return ipfsUrl; // Return as is if not an IPFS URL
    }

    const cid = ipfsUrl.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
}
