import { Injectable } from '@angular/core';
import { NgxImageCompressService} from 'ngx-image-compress';

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

  COMPRESSION_SUPPORTED = [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp'
  ];

  FILETYPES_UPLOAD = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'application/pdf',
    'application/jfif',
    'video/mp4',
    'video/mpeg',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/doc',
    'application/ms-doc',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'docx',
    'doc'
  ];

  imageSize = 15000000;
  FILE_MAX_SIZE = 10000000;
  file: any;
  constructor(
    private imageCompress: NgxImageCompressService) { }
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
  getImage(url, fileObj) {
    let file = fileObj;
    if (fileObj && fileObj['mimeType']) {
      file['type'] = fileObj['mimeType'];
    }
    // console.log("File :", file);
    // console.log("File Type :", file.type)
    // console.log("File Name :", file.name.includes('docx'))
    if (file.type) {
      if (file.type == 'application/pdf') {
        return './assets/images/pdf.png';
      } else if (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return './assets/images/xls.png';
      } else if (file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/ogg') {
        return './assets/images/audio.png';
      } else if (file.type == 'video/mp4' || file.type == 'video/mpeg') {
        return './assets/images/video.png';
      } else if (file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type.includes('docx') || file.type.includes('doc')) {
        return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
      } else if (file.type.includes('txt')) {
        return './assets/images/ImgeFileIcon/docTxt.png';
      } else {
        return url;
      }
    }
    return url;
  }
  getImageByType(type) {
    if (type == 'pdf') {
      return './assets/images/pdf.png';
    } else if (type == 'vnd.ms-excel' || type == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type == 'xls' || type == 'xlsx') {
      return './assets/images/xls.png';
    } else if (type == 'mp3' || type == 'mpeg' || type == 'ogg') {
      return './assets/images/audio.png';
    } else if (type == 'mp4' || type == 'mpeg') {
      return './assets/images/video.png';
    } else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type == 'docx' || type == 'doc' || type == 'msword') {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (type == 'txt') {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return './assets/images/img_uplod.png';
    }
  }

  filesSelected(event, selectedMessage) {
    console.log("Event 2", event)
    const _this = this;
    return new Promise(function (resolve, reject) {
      var input = event.files;
      if (event.target && event.target.files) {
        var input = event.target.files;
      }
      console.log("File Selected :", input);
      if (input) {
        let count = 0;
        let filesCount = input.length;
        for (const file of input) {
          if (_this.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
            reject("Selected file type not supported");
          } else if (file.size > _this.FILE_MAX_SIZE) {
            reject("Please upload files with size < 10mb");
          } else {
            selectedMessage.files.push(file);
            const reader = new FileReader();
            reader.onload = e => {
              selectedMessage.base64.push(e.target["result"]);
              count++;
              if (count === filesCount) {
                resolve(true);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    })
  }
  dataURItoBlob(dataURI, type) {
    console.log("DataURI:", dataURI);
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
  }
  compressFile(image, file, selectedMessage) {
    const _this = this;
    return new Promise(function(resolve){
      var orientation = -1;
      _this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          console.log("Result:", result);
          file['size'] = _this.imageCompress.byteCount(result) / (1024 * 1024);
          const imageBlob = _this.dataURItoBlob(result, file['type']);
          file['file'] = imageBlob;
          selectedMessage['files'].push(file);
          selectedMessage['base64'].push(result);
          resolve(selectedMessage);
        });
    })
    
  }
  getCompressedFiles(event, selectedMessage) {
    const _this = this;
      return new Promise(function(resolve) {
        if (event && event.target && event.target.files && event.target.files.length) {
          for (let i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            reader.onload = e => {
              console.log(_this.COMPRESSION_SUPPORTED.indexOf(event.target.files[i].type));
              if (_this.COMPRESSION_SUPPORTED.indexOf(event.target.files[i].type) === -1) {
                selectedMessage['files'].push(event.target.files[i]);
                selectedMessage['base64'].push(e.target["result"]);
                console.log(selectedMessage);
                if (selectedMessage['files'].length === event.target.files.length) {
                  resolve(selectedMessage);
                }
              } else {
                let file = {
                  'name': event.target.files[i]["name"],
                  'type': event.target.files[i].type,
                  'caption': ''
                }
                _this.compressFile(e.target["result"], file, selectedMessage).then(
                  (selectedMessage)=> {
                    if (selectedMessage['files'].length === event.target.files.length) {
                      resolve(selectedMessage);
                    }                    
                  }
                );
              }
            };
            reader.readAsDataURL(event.target.files[i]);
          }
        } else {
          resolve(false);
        }
      })
  }
}
