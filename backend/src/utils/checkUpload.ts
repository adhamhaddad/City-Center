import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';

const uploadFolders = [
  'uploads',
  'profile-pictures',
  'card-images',
  'job-documents',
  'post-images',
  'post-videos'
];

export const checkFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const folder of uploadFolders) {
      const folderPath = path.join(__dirname, '..', '..', folder);
      try {
        await fs.access(folderPath);
      } catch {
        await fs.mkdir(folderPath);
      }
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
