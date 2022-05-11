import { IMimeTypeDetector } from '../interfaces';
import { fileTypeFromBuffer, fileTypeFromFile, fileTypeFromStream } from 'file-type';
import { extname } from 'path';
import { getType as getMimeType } from 'mime';
import { Readable as ReadableStream, Stream } from 'stream';

export class FInfoMimeTypeDetector implements IMimeTypeDetector {
  public async detectMimeType(path: string, contents?: string | Buffer | Stream): Promise<string | void> {
    if (contents) {
      const mimetype = await this.detectMimeTypeFromBuffer(contents);
      if (mimetype) {
        return mimetype;
      }
    }

    const mimetype = await this.detectMimeTypeFromFile(path);
    if (mimetype) {
      return mimetype;
    }

    return this.detectMimeTypeFromPath(path);
  }

  public async detectMimeTypeFromBuffer(contents: string | Buffer | Stream): Promise<string | void> {
    let mimetype;
    if (contents instanceof Stream) {
      mimetype = await fileTypeFromStream(contents as ReadableStream);
    } else {
      mimetype = await fileTypeFromBuffer(contents as Buffer);
    }
    if (mimetype) {
      return mimetype.mime;
    }
  }

  public async detectMimeTypeFromFile(path: string): Promise<string | void> {
    const mimetype = await fileTypeFromFile(path);
    if (mimetype) {
      return mimetype.mime;
    }
  }

  detectMimeTypeFromPath(path: string): string | void {
    const ext = extname(path);

    if (ext) {
      const mime = getMimeType(ext);
      if (mime) {
        return mime;
      }
    }
  }
}
