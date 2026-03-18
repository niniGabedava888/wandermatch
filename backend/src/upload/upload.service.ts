import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(fileName: string, file: Buffer, mimeType: string) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
          Key: fileName,
          Body: file,
          ContentType: mimeType,
        })
      );

      return `https://${this.configService.getOrThrow('AWS_S3_BUCKET')}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${fileName}`;
    } catch {
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async deleteFile(key: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
          Key: key,
        })
      );
    } catch {
      console.error(`File deletion for ${key} failed!`);
    }
  }
}
