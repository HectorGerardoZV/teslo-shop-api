import { Controller, Get, Post, Param, UploadedFile, Res, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from "./helpers/file.helper";
import { diskStorage } from 'multer';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  public uploadProductFile(
    @UploadedFile()
    file: Express.Multer.File
  ): string {
    return this.fileService.uploadProductFile(file);
  }

  @Get('product/:fileName')
  public getProductFile(
    @Res() res: Response,
    @Param('fileName') fileName: string
  ) {    
    const path = this.fileService.getProductFile(fileName);
    return res.sendFile(path);
  }
}
