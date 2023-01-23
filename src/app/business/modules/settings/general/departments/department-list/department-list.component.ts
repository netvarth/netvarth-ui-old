import { Component, OnInit,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../functions/provider-shared-functions';
import { ProviderServices } from '../../../../../services/provider-services.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from "../../../../../../shared/components/confirm-box/confirm-box.component";
import { MatDialog } from "@angular/material/dialog";
import { ProPicPopupComponent } from "../../../bprofile/pro-pic-popup/pro-pic-popup.component";

@Component({
    'selector': 'app-department-list',
    'templateUrl': './department-list.component.html',
    styleUrls: ['./department-list.component.css']

})
export class DepartmentListComponent implements OnInit {
    departments: any = [];
    deptObj;
    loading = true;
    tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
    add_button = Messages.ADD_DEPT;
    isCheckin;
    domain: any;
    notedialogRef: any;
    imageToShow = "../../assets/images/no_image_icon.png";
    fileobj: any;
    active_user:any;
    screenWidth: number;
    small_device_display = false;
    constructor(public router: Router,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        private dialog: MatDialog,
        ) {

    }
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.screenWidth = window.innerWidth;
    //   if (this.screenWidth <= 767) {
    //   } else {
    //     this.small_device_display = false;
    //   }
      if (this.screenWidth <= 767) {
        this.small_device_display = true;
      } else {
        this.small_device_display = false;
      }
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.loading = true;
        this.getDepartments();
        this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
        // this.loading = false;
        this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");
    }
    gotoDepartmentDetails(dept) {
        this.router.navigate(['provider', 'settings', 'general',
            'department', dept.departmentId]);
    }
    getDepartments() {
        this.loading = false;
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.deptObj = data;
                    this.departments = this.deptObj.departments;
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }

    departmentStatusChange(depart) {
        console.log("department selected :",depart);
        let status = '';
        if(depart.departmentStatus === 'ACTIVE'){
          status = 'disable'
        }
        if(depart.departmentStatus === 'INACTIVE'){
          status = 'enable'
        }
        const itemdialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: "50%",
          panelClass: [
            "popup-class",
            "commonpopupmainclass",
            "confirmationmainclass",
          ],
          disableClose: true,
          data: {
            message: `Are you sure you want to ${status}?`,
            type: "yes/no",
          },
        });
        itemdialogRef.afterClosed().subscribe((result) => {
          if (result) {
          this.changeDepartmentStatus(depart);
          }
        });
      }
    changeDepartmentStatus(dept) {
        if (dept.departmentStatus === 'ACTIVE') {
            this.provider_services.disableDepartment(dept.departmentId).subscribe(
                () => {
                    this.snackbarService.openSnackBar('Department and its services disabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.enableDepartment(dept.departmentId).subscribe(
                () => {
                    this.snackbarService.openSnackBar('Department and its services enabled successfully', { 'panelClass': 'snackbarnormal' });
                    this.getDepartments();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    performActions(action) {
        if (action === 'addDepartment') {
            this.router.navigate(['provider', 'settings', 'general',
                'department', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/general->departments']);

        }
    }
    redirecToDepartments() {
        this.router.navigate(['provider', 'settings' , 'general' , 'departments']);
    }
    addDept() {
        this.router.navigate(['provider', 'settings', 'general', 'department', 'add']);
    }

     // Change pro pic
    changeDepartImg(image,depart) {
    console.log("Imageeee :",image);
    this.notedialogRef = this.dialog.open(ProPicPopupComponent, {
      width: "50%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        //'userdata': this.bProfile,
        departId: depart.departmentId,
        img_type: image,
        //'logoExist': (this.blogo[0]) ? true : false
      },
    });
    this.notedialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Ressss Item Image :", result);
      this.fileobj = result;
        // this.getItemGroups();
       this.getDepartments();
      } 
    });
  }



  deleteDepartImg(depart) {
    console.log("itemsss :",depart);
    // this.itemGroupId = itemGroup.itemGroupId;
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass",
      ],
      disableClose: true,
      data: {
        message: "Do you want to remove this department icon?",
      },
    });
    dialogrefd.afterClosed().subscribe((result) => {
      if (result) {
    let dataToSend = [];
        // const size = this.fileobj["size"] / 1024;
        const data = {
          owner: depart.departmentLogo[0].owner,
          fileName: depart.departmentLogo[0].fileName,
          fileSize: depart.departmentLogo[0].fileSize,
          action:'remove',
          caption: depart.departmentLogo[0].caption,
          fileType: depart.departmentLogo[0].fileType,
          order: depart.departmentLogo[0].order
        };
        dataToSend.push(data);
        console.log("deleting data :",dataToSend);
        this.provider_services
          .removeDepartmentIcon(depart.departmentId,dataToSend)
          .subscribe((data) => {
            // this.getItemGroupPhoto();
            console.log("Data",data);
            this.getDepartments();
            this.snackbarService.openSnackBar('Department icon deleted successfully', {
              panelClass: "snackbarnormal",
            });
          },
          (error) => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror",
            });
          }
          );
    }
    });
  }
}
