import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../shared/services/file-service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { ConsumerServices } from '../../services/consumer-services.service';
import { PreviewuploadedfilesComponent } from '../../../business/modules/jaldee-drive/previewuploadedfiles/previewuploadedfiles.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.css']
})
export class PrescriptionsComponent implements OnInit {

  accountId: any;
  customId: any;
  theme: any;
  prescriptions: any;
  loading = true;
  fileviewdialogRef: any;
  loggedIn = true;  // To check whether user logged in or not
  accountConfig;
  constructor(
    private consumerService: ConsumerServices,
    private groupStorageService: GroupStorageService,
    private activatedRoute: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private fileService: FileService,
    private dialog: MatDialog,
    private location: Location,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.accountId = params['accountId'];
      }
      if (params['customId']) {
        this.customId = params['customId'];
      }
      if (params['theme']) {
        this.theme = params['theme'];
      }
    }
    )
  }

  initPrescriptions() {
    this.authService.goThroughLogin().then((status) => {
      console.log("Status:", status);
      if (status) {
        this.loggedIn = true;
        const activeUser = this.groupStorageService.getitemFromGroupStorage('ynw-user');
        console.log(activeUser);
        this.consumerService.getPrescriptions(activeUser.providerConsumer, this.accountId).subscribe(
          (prescriptions: any) => {
            this.prescriptions = prescriptions;
            this.loading = false;
          }, error => {
            this.loading = false;
          }
        )
      } else {
        this.loggedIn = false;
        this.loading = false;
      }
    });
  }
  ngOnInit(): void {
    this.initPrescriptions();
  }
  getImageType(prescription) {
    console.log(prescription.fileType);
    if (prescription.fileType == 'jpeg' || prescription.fileType == 'png' || prescription.fileType == 'jpg') {
      return prescription.thumbnail;
    } else {
      return this.fileService.getImageByType(prescription.fileType);
    }
  }
  actionPerformed(event) {
    this.shared_functions.sendMessage({ ttype: 'updateuserdetails' })
    this.initPrescriptions();
  }
  preview(file) {
    if (
      file.fileType === "jpg" || file.fileType === "jpeg" || file.fileType === "png" || file.fileType === "bmp" || file.fileType === "webp" || file.fileType === "image/png" ||
      file.fileType === "image/jpeg" ||
      file.fileType === "image/jpg" ||
      file.fileType === "jfif"
    ) {
      this.fileviewdialogRef = this.dialog.open(PreviewuploadedfilesComponent, {
        panelClass: [
          "popup-class",
          "commonpopupmainclass",
          "uploadfilecomponentclass"
        ],
        disableClose: true,
        data: {
          file: file
        }
      });
      this.fileviewdialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    } else {
      const a = document.createElement("a");
      a.href = file.filePath;
      a.download = file.filePath.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return '<a [href]="file.filePath" target="_blank" [download]="file.fileName"></a>';
    }
  }
  goback() {
    this.location.back();
  }
}
