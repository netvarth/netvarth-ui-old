import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { MedicalRecordService } from './medical-record.service';
import { MatDialog } from '@angular/material';
import { ListMedicalRecordComponent } from './list-medical-record/list-medical-record.component';


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
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private medicalService: MedicalRecordService) {
    {

      this.activated_route.queryParams.subscribe(
        (qparams) => {
          this.customerDetails = JSON.parse(qparams.customerDetail);
          this.mrId = qparams.mrId;
          this.medicalService.setPatientDetails(this.customerDetails);
          this.medicalService.setCurrentMRID(qparams.mrId);

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
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
      // this.getCustomerDetail();
    });
  }
  // getCustomerDetail() {
  //   const filter = { 'id-eq': this.customerDetails };
  //   this.provider_services.getProviderCustomers(filter)
  //     .subscribe((data) => {
  //   console.log(data);
  //   },
  //   error => {
  //   this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //   });
  // }
  getLastVisitList() {
    this.mrdialogRef = this.dialog.open(ListMedicalRecordComponent, {
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
    // this.provider_services.smsCheckin(appt.ynwUuid).subscribe(
    //   () => {
    //     this.shared_functions.openSnackBar('Check-in details sent successfully');
    //   },
    //   error => {
    //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //   }
    // );
  }
}
