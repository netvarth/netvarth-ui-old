import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  mrlist;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private medicalService: MedicalrecordService
  ) {
    this.routeLinks = [
      {
        label: 'Clinical Notes',
        link: './clinicalnotes',
        index: 0
      }, {
        label: 'Prescription',
        link: './prescription',
        index: 1
      }
    ];

    this.activated_route.queryParams.subscribe(
      (qparams) => {
        if (qparams['customerDetail']) {
          // tslint:disable-next-line:radix
          this.mrId = parseInt(qparams.mrId);
            this.customerDetails = JSON.parse(qparams.customerDetail);
            this.PatientId = this.customerDetails.id;
            if (qparams.department) {
              this.department = qparams.department;
            }
            if (qparams.serviceName) {
              this.serviceName = qparams.serviceName;
            }
            console.log(this.mrId);

            this.medicalService.setPatientDetailsForMR(qparams);
            this.medicalService.setCurrentMRID(this.mrId);

          } else {
          this.medicalService.patient_data.subscribe(res => {
            this.customerDetails = JSON.parse(res.customerDetail);
            this.PatientId = this.customerDetails.id;
            if (res.department) {
              this.department = res.department;
            }
            if (res.serviceName) {
              this.serviceName = res.serviceName;
            }
            if (res.mrId) {
              // tslint:disable-next-line:radix
              this.mrId = parseInt(res.mrId);
            }


          });


        }

      });

  }


  ngOnInit() {
    const queryParams = this.activated_route.snapshot['queryParams'];
    console.log(queryParams);

    this.mrDate = new Date();
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });


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
  VisitList() {
    console.log(this.PatientId);
    this.mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        patientId: this.PatientId

      }
    });
    this.mrdialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
