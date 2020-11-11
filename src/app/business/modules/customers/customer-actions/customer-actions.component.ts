import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { LastVisitComponent } from '../../medicalrecord/last-visit/last-visit.component';

@Component({
    selector: 'app-customer-actions',
    templateUrl: './customer-actions.component.html',
    styleUrls: ['./customer-actions.component.css']
})
export class CustomerActionsComponent implements OnInit {
    domain;
    customerDetails: any = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private shared_functions: SharedFunctions, private router: Router,
        public dialog: MatDialog, private provider_shared_functions: ProviderSharedFuctions,
        public dialogRef: MatDialogRef<CustomerActionsComponent>) {
    }
    ngOnInit() {
        this.customerDetails = this.data.customer;
        console.log(this.customerDetails);
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    }
    prescription() {
        this.closeDialog();
        const customerDetails = this.customerDetails;
        const customerId = customerDetails[0].id;
        const mrId = 0;
        const bookingType = 'FOLLOWUP';
        const bookingId = 0;
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'],{ queryParams: { 'calledfrom': 'patient' } });
        // const navigationExtras: NavigationExtras = {
        //     queryParams: { 'customerDetail': JSON.stringify(this.customerDetails[0]), 'mrId': 0, back_type: 'consumer', 'booking_type': 'FOLLOWUP' }
        // };
        // this.shared_functions.removeitemfromLocalStorage('mrId');
        // this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    }
    medicalRecord() {
    this.closeDialog();
    console.log(this.customerDetails);
    const customerDetails = this.customerDetails;
    const customerId = customerDetails[0].id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;

    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes'], { queryParams: { 'calledfrom': 'patient' } });
       // this.closeDialog();
        // const navigationExtras: NavigationExtras = {
        //     queryParams: { 'customerDetail': JSON.stringify(this.customerDetails[0]), 'mrId': 0, back_type: 'consumer', 'booking_type': 'FOLLOWUP' }
        // };
        // this.shared_functions.removeitemfromLocalStorage('mrId');
        // this.router.navigate(['provider', 'customers', 'medicalrecord'], navigationExtras);
    }
    lastvisits() {
        this.closeDialog();
        const mrdialogRef = this.dialog.open(LastVisitComponent, {
            width: '80%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                patientId: this.customerDetails[0].id,
                customerDetail: this.customerDetails[0],
                back_type: 'consumer'
            }
        });
        mrdialogRef.afterClosed().subscribe(result => {
            console.log(JSON.stringify(result));
            if (result.type === 'prescription') {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], result.navigationParams);
            } else if (result.type === 'clinicalnotes') {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], result.navigationParams);
            }
        });
    }
    listMedicalrecords() {
        this.closeDialog();
        const customerDetails = this.customerDetails;
        const customerId = customerDetails[0].id;
        const mrId = 0;
        const bookingType = 'FOLLOWUP';
        const bookingId = 0;
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'list'], { queryParams: { 'calledfrom': 'list' } });
    //     const navigationExtras: NavigationExtras = {
    //         queryParams: { 'id': this.customerDetails[0].id }
    //     };
    //     this.router.navigate(['provider', 'customers', 'medicalrecord', 'list'], navigationExtras);
    }
    editCustomer() {
        this.dialogRef.close('edit');
    }
    closeDialog() {
        this.dialogRef.close();
    }
    CustomersInboxMessage() {
        this.closeDialog();
        this.provider_shared_functions.ConsumerInboxMessage(this.customerDetails, 'customer-list')
            .then(
                () => { },
                () => { }
            );
    }
}
