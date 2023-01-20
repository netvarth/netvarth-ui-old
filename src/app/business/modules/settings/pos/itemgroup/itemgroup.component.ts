import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SharedFunctions } from "../../../../../shared/functions/shared-functions";
import { Location } from "@angular/common";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { FormMessageDisplayService } from "../../../../../shared//modules/form-message-display/form-message-display.service";
import { projectConstantsLocal } from "../../../../../shared/constants/project-constants";
import { Messages } from "../../../../../shared/constants/project-messages";
// import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from "../../../../services/provider-services.service";
import { DOCUMENT } from "@angular/common";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ImageTransform } from "../interfaces/image-transform.interface";
import { FileService } from "../../../../../shared/services/file-service";

@Component({
  selector: "app-itemgroup",
  templateUrl: "./itemgroup.component.html",
  styleUrls: ["./itemgroup.component.css"],
})
export class ItemgroupComponent implements OnInit {
  isFrom;
  profimg_exists = false;
  blogo: any = [];
  amForm: UntypedFormGroup;
  item_pic: any = {
    files: [],
    base64: null,
  };
  imageToShow = "../../assets/images/no_image_icon.png";
  itemGroup_pic = {
    files: [],
    base64: null,
    caption: [],
  };
  selitem_pic = "";
  @ViewChild("closebutton") closebutton;
  formfields;
  success_error = null;
  error_list = [];
  error_msg = "";
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  disableButton = false;
  bProfile = null;
  showProfile = false;
  api_error = null;
  api_success = null;
  edit_cap = Messages.EDIT_BTN;
  change_cap = Messages.BPROFILE_CHANGE_CAP;
  delete_btn = Messages.DELETE_BTN;
  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  add_cap = Messages.ADD_BTN;
  profile_pic_cap = Messages.GROUP_PICTURE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  provider_label = "";
  loadSymbol = false;
  imageChangedEvent: any;
  imgType = false;
  fileToReturn: any;
  croppedImage: any;
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  spinner_load = false;
  groupDetails: any;
  formStatus = "";
  itemGroupId;
  imgRes: any;
  counter = 0;
  constructor(
    private activated_route: ActivatedRoute,
    private sharedfunctionobj: SharedFunctions,
    public location: Location,
    private fb: UntypedFormBuilder,
    public fed_service: FormMessageDisplayService,
    // private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
    @Inject(DOCUMENT) public document,
    private snackbarService: SnackbarService,
    private fileService: FileService
  ) {
    this.activated_route.queryParams.subscribe((qParams) => {
      this.isFrom = qParams.type;
      console.log("Params :", qParams);
    });
    this.activated_route.params.subscribe((params) => {
      console.log("Id  :", params.id);
      this.itemGroupId = params.id;
      //if (this.itemGroupId) {
      // this.getItemGroupById(params.id);
      // this.updateForm();
      //  }
    });
  }

  ngOnInit(): void {
    console.log("group comp :", this.isFrom);

    this.createForm();
    if (this.itemGroupId) {
      this.getItemGroupById(this.itemGroupId);
      // this.updateForm();
    }
  }
  getItemGroupById(itemGroupId) {
    this.provider_services.getItemGroupById(itemGroupId).subscribe((res) => {
      this.groupDetails = res;
      console.log("item group by id :", this.groupDetails);
      this.amForm.get("groupName").setValue(this.groupDetails.groupName);
      this.amForm.get("groupDesc").setValue(this.groupDetails.groupDesc);
      this.updateForm();

      //this.showimg(this.groupDetails);
    });
  }
  createForm() {
    this.formfields = {
      groupName: ["", Validators.compose([Validators.required])],
      // username: [''],
      groupDesc: ["", Validators.compose([Validators.required])],
    };
    this.amForm = this.fb.group(this.formfields);
    // this.prov_curstatus = this.bProfile.status;
    if (this.groupDetails) {
      this.updateForm();
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  updateForm() {
    this.amForm.get("groupName").setValue(this.groupDetails.groupName);
    this.amForm.get("groupDesc").setValue(this.groupDetails.groupDesc);

    this.amForm.setValue({
      groupName: this.groupDetails.groupName,
      groupDesc: this.groupDetails.groupDesc,
    });
  }
  // Method to handle the add / edit for bprofile
  onSubmit(form_data) {
    this.counter = this.counter + 1;
    const blankpatterm = projectConstantsLocal.VALIDATOR_BLANK;
    form_data.groupName = form_data.groupName.trim();
    if (blankpatterm.test(form_data.groupName)) {
      this.api_error = "Please enter group name";
      this.document.getElementById("groupName").focus();
      return;
    }
    if (form_data.groupDesc) {
      form_data.groupDesc = form_data.groupDesc.trim();
    }

    if (
      form_data.groupName.length >
      projectConstantsLocal.BUSINESS_NAME_MAX_LENGTH
    ) {
      //  this.api_error = this.wordProcessor.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
      this.api_error = "max length of group name is 50";
    }

    // else if (form_data.groupDesc && form_data.groupDesc.length > projectConstantsLocal.BUSINESS_DESC_MAX_LENGTH) {
    // //  this.api_error = this.wordProcessor.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
    // this.api_error = 'Please enter group description';

    // }
    //if( this.itemGroup_pic.files.length === 0){
    // this.snackbarService.openSnackBar('Please u', {
    //   panelClass: "snackbarerror",
    // });
    // }
    if (this.counter === 2) {
      this.snackbarService.openSnackBar(Messages.ITEM_GROUP_CREATED);
      this.redirectToBack();
    } else {
      const post_itemdata = {
        groupName: form_data.groupName,
        groupDesc: form_data.groupDesc,
      };

      // calling the method to update the primarty fields in bProfile edit page
      if (this.groupDetails) {
        this.updateItemGroup(this.itemGroupId, post_itemdata);
      } else {
        this.createItemGroup(post_itemdata);
      }
    }
  }
  // updating the primary field from the bprofile edit page
  createItemGroup(pdata) {
    this.disableButton = true;
    this.provider_services.addItemGroup(pdata).subscribe(
      (res) => {
        console.log("Resssss :", res);
        this.itemGroupId = res;
        // this.snackbarService.openSnackBar(Messages.ITEM_GROUP_CREATED);
        this.disableButton = false;
        //   if(this.selitem_pic === undefined || this.selitem_pic === ''){
        //     this.snackbarService.openSnackBar('Please upload group photo', {
        //      panelClass: "snackbarerror",
        //    });
        //  }
        //(this.selitem_pic === undefined || this.selitem_pic === '') ||
        // if((this.selitem_pic !== undefined || this.selitem_pic !== '') || (this.imgRes !== undefined ||  this.imgRes !== '')){
        //    this.redirectToBack();
        // }
        this.formStatus = "edit";
        if (this.counter === 2) {
          this.redirectToBack();
        }
      },
      (error) => {
        this.snackbarService.openSnackBar(error.error, {
          panelClass: "snackbarerror",
        });
        this.disableButton = false;
      }
    );
  }

  updateItemGroup(itemGroupId, pdata) {
    this.disableButton = true;
    this.provider_services.updateItemGroup(itemGroupId, pdata).subscribe(
      (res) => {
        console.log("resssss update :", res);
        // this.api_success = this.wordProcessor.getProjectMesssages('BPROFILE_UPDATED');
        this.snackbarService.openSnackBar(Messages.ITEM_GROUP_UPDATED);
        this.disableButton = false;
        this.redirectToBack();
      },
      (error) => {
        this.snackbarService.openSnackBar(error.error, {
          panelClass: "snackbarerror",
        });
        this.disableButton = false;
      }
    );
  }
  redirectToBack() {
    this.location.back();
  }

  showimg() {
    let logourl = "";
    this.profimg_exists = false;
    if (this.itemGroup_pic.base64) {
      this.profimg_exists = true;
      return this.itemGroup_pic.base64;
    } else {
      if (this.groupDetails.itemGroupImages[0]) {
        this.profimg_exists = true;
        // const today = new Date();
        // logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
        logourl = this.groupDetails.itemGroupImages[0].url
          ? this.groupDetails.itemGroupImages[0].url
          : "";
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }
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
          this.updateItemGroup(this.itemGroupId, submit_data);
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
        // console.log(this.bProfile);
        // console.log(this.user_arr);
        // if (this.user_arr.status === 'ACTIVE' || this.user_arr.status === 'INACTIVE') { // case now in bprofile edit page
        // generating the data to be submitted to change the logo
        // console.log('inside bprofile');
        const submit_data: FormData = new FormData();
        console.log("before submit :", submit_data);
        submit_data.append("files", this.selitem_pic, this.selitem_pic["name"]);
        // const propertiesDet = {
        //     'caption': '',
        //     // 'displayImage':true
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
        console.log("After submit :", submit_data);

        // {"propertiesMap":{"0":{"caption":"","displayImage":true}}}
        const blobPropdata = new Blob([JSON.stringify(propertiesDet)], {
          type: "application/json",
        });
        submit_data.append("properties", blobPropdata);
        console.log(" blobPropdata :", blobPropdata);
        console.log("submitted :", submit_data);

        // if (this.imgType) {
        //     console.log('cover');
        // } else {
        // if (this.data.userId) {
        //     this.uploadUserLogo(submit_data);
        // } else {
        //     this.uploadLogo(submit_data);
        // }
        console.log("Submit data :", submit_data);
        if (this.itemGroupId) {
          this.uploadLogo(this.itemGroupId, submit_data);
        }
        // }
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
  uploadLogo(itemGroupId, passdata) {
    // this.provider_services.uploadLogo(passdata)
    console.log("passdata :", itemGroupId, passdata);
    this.provider_services
      .uploadItemGroupImage(itemGroupId, passdata)
      .subscribe(
        (data) => {
          console.log("Res :", data);
          this.imgRes = data;
          this.api_success = Messages.GROUP_IMAGE_UPLOAD;
          this.spinner_load = false;
          setTimeout(() => {
            this.closeGroupDialog();
            //  this.redirectToBack();
            this.getItemGroupById(itemGroupId);
          }, 2000);
          // this.getBusinessProfileLogo();
        },
        (error) => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror",
          });
          // this.api_error = error.error;
        }
      );
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
    this.api_success = "";
  }
}
