import * as path from 'path';

export function getDocumentsStoragePath(
  configuredPath = process.env.STORAGE_PATH,
): string {
  return configuredPath
    ? path.resolve(configuredPath)
    : path.resolve(process.cwd(), '../secure_storage');
}
