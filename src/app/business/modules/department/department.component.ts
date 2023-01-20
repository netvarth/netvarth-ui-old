import { Component, OnChanges, OnInit, Input, Output, EventEmitter ,ViewChild} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ImageTransform } from "./interfaces/image-transform.interface";
import { FileService } from "../../../shared/services/file-service";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
// import { DOCUMENT } from "@angular/common";
import { GroupStorageService } from "../../../shared/services/group-storage.service";
// import { Router } from '@angular/router';

@Component({
    'selector': 'app-jaldee-department',
    'templateUrl': './department.component.html',
    styleUrls: ['./department.component.css']

})
export class DepartmentComponent implements OnInit, OnChanges {
    deptForm: UntypedFormGroup;
    @Input() action;
    @Input() department;
    @Output() actionPerformed = new EventEmitter<any>();
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    success_error = null;
    error_list = [];
    error_msg = "";
    showProfile = false;
    api_error = null;
    api_success = null;
    spinner_load = false;
    dept_data;
    cancel_btn = Messages.CANCEL_BTN;
    edit_cap = Messages.EDIT_BTN;
    change_cap = Messages.BPROFILE_CHANGE_CAP;
    delete_btn = Messages.DELETE_BTN;
    business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
    add_cap = Messages.ADD_BTN;
    profile_pic_cap = Messages.DEPART_PICTURE_CAP;
    pic_cap = Messages.DEPART_ICON_CAP;
    profimg_exists = false;
    maxcharDept_name = projectConstantsLocal.VALIDATOR_MAX100_DEPT_NME;
    maxcharDept_code = projectConstantsLocal.VALIDATOR_MAX15_DEPT_CDE;
    button_title = 'Save';
    provider_label = "";
  loadSymbol = false;
  imageChangedEvent: any;
  imgType = false;
  fileToReturn: any;
  croppedImage: any;
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  @ViewChild("closebutton") closebutton;
  imageToShow = "../../assets/images/no_image_icon.png" ;
   itemGroup_pic = {
    files: [],
    base64: null,
    caption: [],
  };
  selitem_pic = "";
  active_user:any;
    constructor(
        private fb: UntypedFormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private fileService: FileService,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        // private router : Router


    ) { }
    ngOnInit() {
        this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");
        // console.log("Active user :",this.active_user);

    }
    ngOnChanges() {
        if (this.action === 'add') {
            this.department = null;
            this.createForm();
        } else {
            this.dept_data = this.department;
            if (this.dept_data) {
                // if(this.dept_data && this.dept_data.departmentLogo[0] && this.dept_data.departmentLogo[0].s3path){
                //     this.profimg_exists = true;
                // }
                // else{
                //     this.profimg_exists = false;
                // }
                console.log("details :",this.dept_data);
                this.createForm();
                this.updateForm();
            }
        }
    }
    getDepartmentDetailsById(id){
        this.provider_services.getDepartmentById(id).
        subscribe((data :any)=>{
            console.log("Depart details :",data);
            this.dept_data = data;
        })

    }
    showimg() {
        let logourl = '';
        this.profimg_exists = false;
        // if (this.itemGroup_pic.base64) {
        //  this.profimg_exists = true;
        //   return this.itemGroup_pic.base64;
        // } else {
          if (this.dept_data && this.dept_data.departmentLogo[0]) {
            this.profimg_exists = true;
            logourl = (this.dept_data.departmentLogo[0].s3path) ? this.dept_data.departmentLogo[0].s3path : '';
          }
         return this.sharedfunctionobj.showlogoicon(logourl);
        //  }
      }
    updateForm() {
        this.deptForm.setValue({
            'departmentName': this.dept_data['departmentName'] || this.deptForm.get('departmentName').value,
            'departmentDescription': this.dept_data['departmentDescription'] || this.deptForm.get('departmentDescription').value,
            'departmentCode': this.dept_data['departmentCode'] || this.deptForm.get('departmentCode').value
        });
    }
    setDescFocus() {
        this.isfocused = true;
        this.char_count = this.max_char_count - this.deptForm.get('departmentDescription').value.length;
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        this.char_count = this.max_char_count - this.deptForm.get('departmentDescription').value.length;
    }
    editDepartment() {
        const data = {};
        data['action'] = 'edit';
        this.actionPerformed.emit(data);
    }
    onSubmit(form_data) {
        const data = {};
        data['department'] = form_data;
        data['action'] = this.action;
        this.actionPerformed.emit(data);
    }
    onCancel() {
        const data = {};
        data['action'] = 'close';
        if (this.action === 'add') {
            data['source'] = 'add';
        } else {
            data['source'] = 'edit';
        }
        this.actionPerformed.emit(data);
    }

    createForm() {
        this.deptForm = this.fb.group({
            departmentName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxcharDept_name)])],
            departmentDescription: ['', Validators.compose([Validators.maxLength(500)])],
            departmentCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxcharDept_code)])]
        });
    }
    resetApiErrors() {
    }


    imageSelect1(event: any): void {
        this.loadSymbol = true;
        this.imageChangedEvent = event;
      }
      clearModalData(source?) {
        this.imageChangedEvent = "";
        if (source) {
          this.imgType = true;
        }
        this.api_success = false;
        this.api_error = false;
      }
      imageSelect(input) {
        this.success_error = null;
        this.error_list = [];
        this.error_msg = "";
        if (input.files && input.files[0]) {
          for (const file of input.files) {
            this.success_error = this.fileService.imageValidation(file);
            if (this.success_error === true) {
              const reader = new FileReader();
              this.itemGroup_pic.files = input.files[0];
              this.selitem_pic = input.files[0];
              const fileobj = input.files[0];
              reader.onload = (e) => {
                this.itemGroup_pic.base64 = e.target["result"];
              };
              reader.readAsDataURL(fileobj);
              // if (this.user_arr.status === 'ACTIVE' || this.user_arr.status === 'INACTIVE') { // case now in bprofile edit page
              // generating the data to be submitted to change the logo
              const submit_data: FormData = new FormData();
              submit_data.append(
                "files",
                this.selitem_pic,
                this.selitem_pic["name"]
              );
              // const propertiesDet = {
              //   'caption': ''
              // };
              const propertiesDetob = {};
              // let i = 0;
              //  for (const pic of this.item_pic.files) {
              // submit_data.append('files', pic, pic['name']);
              let properties = {};
              properties = {
                caption: this.itemGroup_pic.caption[0] || "",
                displayImage: true,
              };
              propertiesDetob[0] = properties;
              //  i++;
              // }
    
              const propertiesDet = {
                propertiesMap: propertiesDetob,
              };
              const blobPropdata = new Blob([JSON.stringify(propertiesDet)], {
                type: "application/json",
              });
              submit_data.append("properties", blobPropdata);
             // this.updateItemGroup(this.itemGroupId, submit_data);
              // }
            } else {
              this.error_list.push(this.success_error);
              if (this.error_list[0].type) {
                this.error_msg = "Selected image type not supported";
              } else if (this.error_list[0].size) {
                this.error_msg = "Please upload images with size less than 15mb";
              }
              // this.error_msg = 'Please upload images with size < 5mb';
              this.snackbarService.openSnackBar(this.error_msg, {
                panelClass: "snackbarerror",
              });
            }
          }
        }
      }
    
      imageCropped(event: ImageCroppedEvent) {
        this.loadSymbol = false;
        this.fileToReturn = "";
        this.croppedImage = event.base64; // preview
        this.fileToReturn = this.base64ToFile(
          event.base64,
          this.imageChangedEvent.target.files[0].name
        );
        return this.fileToReturn;
      }
      imageLoaded() {
        // show cropper
      }
      cropperReady() {
        // cropper ready
      }
      loadImageFailed() {
        // show message
      }
      base64ToFile(imgdata, filename) {
        const arr = imgdata.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
    
      rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
      }
      rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
      }
      zoomOut() {
        this.scale -= 0.1;
        this.transform = {
          ...this.transform,
          scale: this.scale,
        };
      }
      zoomIn() {
        this.scale += 0.1;
        this.transform = {
          ...this.transform,
          scale: this.scale,
        };
      }
      private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH,
        };
      }
    
      // Save pro pic
      saveImages() {
        console.log("save imgsss");
        this.spinner_load = true;
        const file = this.fileToReturn;
        this.success_error = null;
        this.error_list = [];
        this.error_msg = "";
        if (file) {
          console.log("inside file");
          this.success_error = this.fileService.imageValidation(file);
          if (this.success_error === true) {
            console.log("inside success err");
            const reader = new FileReader();
            this.itemGroup_pic.files = file;
            this.selitem_pic = file;
            const fileobj = file;
            reader.onload = (e) => {
              this.itemGroup_pic.base64 = e.target["result"];
            };
            console.log("File obj:", fileobj);
            reader.readAsDataURL(fileobj);
            // let i = 0;
            let dataToSend = [];
                const size = fileobj["size"] / 1024;
                const data = {
                  owner: this.active_user.id,
                  fileName: fileobj["name"],
                  fileSize: size / 1024,
                  action:'add',
                  caption: this.itemGroup_pic.caption[0] ? this.itemGroup_pic.caption[0] : "",
                  fileType: fileobj["type"].split("/")[1],
                  order: 0
                };
                dataToSend.push(data);
            console.log("After submit :", dataToSend);
           if (this.dept_data.departmentId) {
              this.uploadDepartLogo(this.dept_data.departmentId, dataToSend);
            }
          } else {
            this.error_list.push(this.success_error);
            if (this.error_list[0].type) {
              this.error_msg = "Selected image type not supported";
            } else if (this.error_list[0].size) {
              this.error_msg = "Please upload images with size less than 15mb";
            }
            this.snackbarService.openSnackBar(this.error_msg, {
              panelClass: "snackbarerror",
            });
          }
        } else {
          this.error_msg = "Selected image type not supported";
          this.snackbarService.openSnackBar(this.error_msg, {
            panelClass: "snackbarerror",
          });
        }
      }
      uploadDepartLogo(departId, passdata) {
        // this.provider_services.uploadLogo(passdata)
        console.log("passdata :", departId, passdata);
        this.provider_services
          .uploadDepartmentIcon(departId, passdata)
          .subscribe(
            (s3UrlsObj: any) => {
              console.log("Res :", s3UrlsObj);
              this.api_success = Messages.DEPART_ICON_UPLOAD;
              this.spinner_load = false;
              this.uploadFilesToS3(s3UrlsObj);
              setTimeout(() => {
                this.closeGroupDialog();
              //  this.redirecTo();
              }, 2000);
            },
            (error) => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror",
              });
              // this.api_error = error.error;
            }
          );
      }
      uploadFile(file, url) {
        const _this = this;
        return new Promise(function(resolve, reject) {
          _this.provider_services.videoaudioS3Upload(file, url).subscribe(
            () => {
              resolve(true);
            },
            () => {
              resolve(false);
            }
          );
        });
      }
      async uploadFilesToS3(s3Urls) {
        const _this = this;
        let count = 0;
        //for (let i = 0; i < s3Urls.length; i++) {
          // this.itemGroup_pic["files"][s3Urls[i].orderId]
          await _this
            .uploadFile(
              this.itemGroup_pic["files"],
              s3Urls[0].url
            )
            .then(() => {
              count++;
              console.log("Count=", count);
              console.log(s3Urls.length);
              //this.ngOnChanges();
                this.getDepartmentDetailsById(this.dept_data.departmentId);
            //   if (count === s3Urls.length) {
                _this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, {
                  panelClass: "snackbarnormal"
                });
                // this.router.navigate(['provider', 'settings', 'general',
                // 'department', this.dept_data.departmentId]);
                _this.itemGroup_pic = { files: [], base64: [], caption: [] };
                // _this.getfiles();
                // _this.apiloading = false;
            //   }
            });
       // }
      }
      closeGroupDialog() {
        this.closebutton.nativeElement.click();
        this.api_success = "";
      }
}
