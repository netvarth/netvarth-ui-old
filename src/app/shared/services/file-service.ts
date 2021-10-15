import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * 
 */
export class FileService {
 // Supported images types
  IMAGE_FORMATS = [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp'
  ];
  // Types of files images/pdf
  FILETYPES_UPLOAD: [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'application/pdf'
  ];
  
  imageSize = 15000000;
  constructor() {}
  /**
   * Method returns supported formats of files which has to be uploaded
   * @param source image/file
   * @returns available formats
   */
  getSupportedFormats (source) {
    let formats;
    if (source == 'image') {
      formats = this.IMAGE_FORMATS;
      //return this.IMAGE_FORMATS;
    } else {
      formats = this.FILETYPES_UPLOAD;
      //return this.FILETYPES_UPLOAD;
    }
    return formats;
  }

  /**
   * Method will return the maximum uploadable size of a file/image
   * @returns Maximum size of the image to upload
   */
  getMaximumImageSize() {
    return this.imageSize;
  }

}
