import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { MedicalrecordService } from './medicalrecord.service';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { LastVisitComponent } from './last-visit/last-visit.component';

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.css']
})
export class MedicalrecordComponent implements OnInit {

  mrId: any;
  routeLinks: any[];
  activeLinkIndex = -1;
  userId;
  customerDetails: any;
  uuid: any;
  mrdialogRef: any;
  PatiendId: any;
  gender: any;
  patientFirstName: any;
  patientLastName: number;
  PatientDob: any;
  isLoaded = false;
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    // private medicalService: MedicalrecordService
  ) {
    {
      this.activated_route.queryParams.subscribe(
        (qparams) => {
          this.customerDetails = JSON.parse(qparams.customerDetail);
          // this.patientFirstName = this.customerDetails.firstName ;
          // this.patientLastName  = this.customerDetails.lastName ;
          // this.PatiendId = this.customerDetails.id;
          // if (this.customerDetails.gender) {
          // this.gender = this.customerDetails.gender;
          // }
          //  if (this.customerDetails.dob) {
          //  this.PatientDob = this.customerDetails.dob;
          // }
          // this.medicalService.setPatientDetails(this.customerDetails);

        }

      );
    }
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
  }
  ngOnInit() {
    this.isLoaded = true;
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
    // this.getallMedicalRecordsofthisPatient();
  }
  getallMedicalRecordsofthisPatient() {
    const filter = {};
    filter['patientId-eq'] = this.PatiendId;

    this.provider_services.GetMedicalRecordListByUUid(filter)
      .subscribe((data) => {
        console.log(data);
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
