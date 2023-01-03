import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "fs";
import { join } from "path";
import { IFiles } from "./interfaces/files.interface";

@Injectable()
export class FileAdapter implements IFiles {
    constructor(
        private readonly configService: ConfigService
    ) { }
    uploadFile(file: Express.Multer.File): string {
        if (!file) throw new BadRequestException('Plase check the mimtype or send a valid image');
        const secureUrl: string = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;
        return secureUrl;
    }
    getFilePath(fileName: string, folder: string): string {
        const path: string = join(__dirname, `../../static/${folder}`, fileName);        
        if (!existsSync(path)) throw new NotFoundException(`Error: the image ${fileName} doesn't exist`);
        return path;
    }

}