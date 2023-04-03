import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SharedServices } from "../../../../../../shared/services/shared-services";
import { FileService } from "../../../../../../shared/services/file-service";

@Component({
  selector: "app-select-attachment",
  templateUrl: "./select-attachment.component.html",
  styleUrls: ["./select-attachment.component.css"]
})
export class SelectAttachmentComponent implements OnInit {

  @Output() sendInput = new EventEmitter<any>();

  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  imgCaptions: any = [];

  source: any;
  selectedFiles: FileList;
  progressInfos = [];
  message = "";
  fileInfos: Observable<any>;
  action: string;
  public fileInput: any;
  public fileSelectErrorMsg: any;
  public bUploadFileError: boolean = false;
  file: any;
  api_loading1: boolean;
  constructor(
    public _location: Location,
    public dialogRef: MatDialogRef<SelectAttachmentComponent>,
    // private uploadService: CrmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private fileService: FileService
  ) {
    this.source = this.data.source
  }

  ngOnInit(): void {
    this.api_loading1 = false;
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  filesSelected(event) {
    const _this=this;
    _this.api_loading1 = true;
    _this.action = "attachment";
    let selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
    _this.fileService.getCompressedFiles(event, selectedMessage).then(
      (selectedMessage)=> {
        console.log("SelectedMessage:", selectedMessage);
        for (let i=0;i<selectedMessage['files'].length;i++) {
          _this.selectedMessage.files.push(selectedMessage['files'][i]);
          _this.selectedMessage.base64.push(selectedMessage['base64'][i]);
        }
        _this.api_loading1 = false;
      }
    );
  }
  saveFile() {
    const _this = this;
    _this.api_loading1=true;
    console.log('file', this.selectedMessage.files)
    if (this.selectedMessage.files.length > 0) {
      this.bUploadFileError = false;
      this.fileSelectErrorMsg = ''
      console.log('_this.selectedMessage', _this.selectedMessage);
      this.sendInput.emit(_this.selectedMessage);
    } else {
      _this.api_loading1=false;
      this.bUploadFileError = true;
      this.fileSelectErrorMsg = 'Please select atleast one file to upload';
    }

  }
  getImage(url, file) {
    this.bUploadFileError = false;
    this.fileSelectErrorMsg = ''
    return this.fileService.getImage(url, file);
  }
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = "";
    console.log('this.selectedMessage.files', this.selectedMessage.files.length)
    if (this.selectedMessage.files.length > 0) {
      this.bUploadFileError = false;
      this.fileSelectErrorMsg = ''
    }
    else {
      this.bUploadFileError = true;
      this.fileSelectErrorMsg = 'Please select atleast one file to upload'
    }
  }
  dialogClose() {
    this.dialogRef.close('close');
  }
  goBack() {
    this._location.back();
  }
}
