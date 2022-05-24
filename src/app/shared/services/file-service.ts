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

  FILETYPES_UPLOAD = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/jfif',
    'video/mp4',
    'video/mpeg',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'docx',
    'doc'
  ];

  imageSize = 15000000;
  constructor() { }
  /**
   * Method returns supported formats of files which has to be uploaded
   * @param source image/file
   * @returns available formats
   */
  getSupportedFormats(source) {
    console.log(source);
    let formats = [];
    if (source == 'image') {
      formats = this.IMAGE_FORMATS;
      //return this.IMAGE_FORMATS;
    } else {
      formats = this.FILETYPES_UPLOAD;
      //return this.FILETYPES_UPLOAD;
    }
    console.log(formats);
    return formats;
  }

  /**
   * Method will return the maximum uploadable size of a file/image
   * @returns Maximum size of the image to upload
   */
  getMaximumImageSize() {
    return this.imageSize;
  }

  imageValidation(file, source?) {
    console.log("In Image Validation:", source);
    let file_types = [];
    if (source === 'attachment' || source === 'consumerimages') {
      file_types = this.getSupportedFormats('file');
    } else {
      file_types = this.getSupportedFormats('image');
    }
    const image_max_size = this.getMaximumImageSize();
    const error = [];
    console.log(file_types);
    console.log(file.type);
    let is_error = false;
    if (!file.type || (file.type && file_types.indexOf(file.type) === -1)) {
      error['type'] = true;
      is_error = true;
    }
    if (file.size && file.size > image_max_size) {
      error['size'] = true;
      is_error = true;
    }
    if (is_error === false) {
      return true;
    } else {
      return error;
    }
  }
  getImage(url, file) {
    console.log("File Type :", file.type)
    console.log("File Name :", file.name.includes('docx'))
    if (file.type == 'application/pdf') {
      return './assets/images/pdf.png';
    } else if (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return './assets/images/xls.png';
    } else if (file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/ogg') {
      return './assets/images/audio.png';
    } else if (file.type == 'video/mp4' || file.type == 'video/mpeg') {
      return './assets/images/video.png';
    } else if (file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.includes('docx') || file.name.includes('doc')) {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (file.name.includes('txt')) {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return url;
    }
  }
  getImageByType(type) {
    if (type == 'pdf') {
      return './assets/images/pdf.png';
    } else if (type == 'vnd.ms-excel' || type == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type == 'xls' || type=='xlsx') {
      return './assets/images/xls.png';
    } else if (type == 'mp3' || type == 'mpeg' || type == 'ogg') {
      return './assets/images/audio.png';
    } else if (type == 'mp4' || type == 'mpeg') {
      return './assets/images/video.png';
    } else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type=='docx' || type=='doc') {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (type=='txt') {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return './assets/images/img_uplod.png';
    }
  }
}
