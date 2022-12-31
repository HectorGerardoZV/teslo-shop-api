import { Request } from "express";
import { v4 as uuid } from 'uuid';

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    const validExtensions: string[] = ['jpg', 'jpeg', 'png', 'svg'];
    if (!file) return cb(null, false);
    const fileExtension = file.mimetype.split("/")[1];
    if (!validExtensions.includes(fileExtension)) return cb(null, false);
    cb(null, true);
}

export const fileNamer = (req: Request, file: Express.Multer.File, cb: Function) => {
    const fileExtension = file.mimetype.split("/")[1];
    const newFileName = `${uuid()}.${fileExtension}`;
    cb(null, newFileName);
}
