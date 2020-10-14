import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { LastVisitComponent } from './last-visit/last-visit.component';
import { MedicalrecordService } from './medicalrecord.service';
import { projectConstants } from '../../../app.component';

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {

  mrDate: Date;
  serviceName: any;
  department: any;
  data: any;
  mrId: any;
  routeLinks: any[];
  activeLinkIndex = -1;
  userId;
  customerDetails: any;
  uuid: any;
  mrdialogRef: any;
  PatientId: any;
  gender: any;
  patientFirstName: any;
  patientLastName: number;
  PatientDob: any;
  isLoaded = false;
  mrlist;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  constructor( // private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private medicalService: MedicalrecordService
  ) {
    this.activated_route.queryParams.subscribe(
      (qparams) => {
        if (qparams.mrId !== 0 && qparams.mr_mode === 'view') {
          this.getMedicalRecordUsingMR(qparams.mrId);
        } else {
          this.customerDetails = JSON.parse(qparams.customerDetail);
          console.log(this.customerDetails);
          // this.PatientId = this.customerDetails.id;
          this.department = qparams.department;
          this.serviceName = qparams.serviceName;
          // if (this.customerDetails.gender) {
          //   this.gender = this.customerDetails.gender;
          // }
          // if (this.customerDetails.dob) {
          //   this.PatientDob = this.customerDetails.dob;
          // }
          this.mrId = qparams.mrId;
          this.medicalService.setPatientDetailsForMR(qparams);
          this.medicalService.setCurrentMRID(qparams.mrId);
        }
      }

    );

  }


  ngOnInit() {
    this.isLoaded = true;
    this.mrDate = new Date();


  }
  getMedicalRecordUsingMR(mrId) {


    this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          this.mrDate = data.mrConsultationDate;
          this.customerDetails = data.providerConsumer;
          this.medicalService.setPatientDetailsForMR(data);
          this.medicalService.setCurrentMRID(data.mrId);
        }
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getLastVisitList() {
    this.mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId

      }
    });
    this.mrdialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
