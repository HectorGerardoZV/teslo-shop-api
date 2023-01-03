import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileAdapter } from './file.adapter';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FileController],
  providers: [FileService, FileAdapter],
  imports:[ConfigModule]
})
export class FileModule {}
