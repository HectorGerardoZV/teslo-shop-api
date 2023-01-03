
export interface IFiles {
    uploadFile(file: Express.Multer.File): string;
    getFilePath(fileName: string, folder: string): string;
}