import { Injectable } from '@angular/core';
import { projectConstantsLocal } from '../constants/project-constants';
import { SnackbarService } from './snackbar.service';
import { NgxImageCompressService } from 'ngx-image-compress';
// import { projectConstantsLocal } from '../constants/project-constants';

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
  constructor(private snackbarService: SnackbarService,
    private imageCompress: NgxImageCompressService,) { }
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

  selectFile(event: any,selectedFiles) {
    const _this = this;
    return new Promise((resolve, reject) => {
      let input;
      if (event.target.files) {
        input = event.target.files;
      }
      console.log('input', input);
      if (input) {
        // resolve(input);
        for (const file of input) {
          console.log('file', file)
          if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
            // _this.snackbarService.openSnackBar("Please upload images with size < 10mb", { panelClass: "snackbarerror" });
            return _this.snackbarService.openSnackBar("Please upload images with size < 10mb", { panelClass: "snackbarerror" });
          }
          else {
            _this.file = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
              let localUrl = e.target.result;
              if (file && file['type'] === 'application/pdf') {
                // _this.selectedFiles.files.push(file);
                // _this.selectedFiles.base64.push(e.target["result"]);
                const fileInfoPdf = {
                  'file': file,
                  'base64': e.target['result']
                }
                // _this.snackbarService.openSnackBar('You uploded' + ' ' + file['name']);
                resolve(fileInfoPdf);
                return fileInfoPdf;
              }
              else {
                if (file && file['type'] && file['type'].includes('image')) {
                  if (file && file['type'] && file['type'].includes('webp')) {
                    selectedFiles.files = [];
                    selectedFiles.base64 = [];
                    selectedFiles.caption = [];
                    resolve(false);
                    return _this.snackbarService.openSnackBar("File type not supported", { panelClass: "snackbarerror" });
                  }
                  else {
                    _this.compressFile(localUrl, file['name'], _this.file, selectedFiles).then((element)=>{
                      resolve(element);
                    });
                    
                    // _this.selectedFiles.files.push(_this.file);
                  }

                }
                else {
                  selectedFiles.files = [];
                  selectedFiles.base64 = [];
                  selectedFiles.caption = [];
                  resolve(false);
                  _this.snackbarService.openSnackBar("File type not supported", { panelClass: "snackbarerror" });
                }
              }
            }
            reader.readAsDataURL(file);
            // _this.action = "attachment";
            // console.log('_this.selectedFiles',selectedFiles);
            // if (this.selectedFiles.caption) {
            //   return _this.imgCaptions;
            // } else {
            //   return (_this.imgCaptions = "");
            // }
          }
        }
      }
    })
    
  }
  compressFile(image, fileName,fileInfo,selectedFiles) {
    const _this=this;
    return new Promise((resolve,reject)=>{
      console.log('fileInfo',fileInfo)
      const orientation = -1;
      let sizeOfOriginalImage = _this.imageCompress.byteCount(image) / (1024 * 1024);
      console.warn('Size in bytes is now:', sizeOfOriginalImage);
      _this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          if(result){
            // let imgResultAfterCompress = result;
            // selectedFiles.base64.push(result);
            // selectedFiles.files.push(fileInfo);
            // let localCompressedURl = result;
            let sizeOFCompressedImage = _this.imageCompress.byteCount(result) / (1024 * 1024)
            console.warn('Size in bytes after compression:',sizeOFCompressedImage);
            const fileInfoPdf = {
              'file': fileInfo,
              'base64': result,
              'size':sizeOFCompressedImage
            }
            // fileInfoPdf['file']['size']=sizeOFCompressedImage
            resolve(fileInfoPdf);
            return fileInfoPdf;
            // return _this.snackbarService.openSnackBar('You uploded' + ' ' + fileInfo['name']);
            // fileInfo['size']=this.sizeOFCompressedImage;
          }
        });
    })
  }
}
