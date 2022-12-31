import { Inject, Injectable } from '@nestjs/common';
import { FileAdapter } from './file.adapter';
import { IFiles } from './interfaces/files.interface';

@Injectable()
export class FileService {

  constructor(
    @Inject(FileAdapter)
    private readonly fileAdapter: IFiles
  ) { }

  public uploadProductFile(file: Express.Multer.File): string {
    return this.fileAdapter.uploadFile(file);
  }
  public getProductFile(fileName: string) {
    return this.fileAdapter.getFilePath(fileName, "products");
  }
}
