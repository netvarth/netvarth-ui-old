import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
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
        public dialog: MatDialog,
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
        const navigationExtras: NavigationExtras = {
            queryParams: { 'customerDetail': JSON.stringify(this.customerDetails[0]), 'mrId': 0, back_type: 'consumer', 'booking_type': 'FOLLOWUP' }
        };
        this.shared_functions.removeitemfromLocalStorage('mrId');
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    }
    medicalRecord() {
        this.closeDialog();
        const navigationExtras: NavigationExtras = {
            queryParams: { 'customerDetail': JSON.stringify(this.customerDetails[0]), 'mrId': 0, back_type: 'consumer', 'booking_type': 'FOLLOWUP' }
        };
        this.shared_functions.removeitemfromLocalStorage('mrId');
        this.router.navigate(['provider', 'customers', 'medicalrecord'], navigationExtras);
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
        const navigationExtras: NavigationExtras = {
            queryParams: { 'id': this.customerDetails[0].id }
        };
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'list'], navigationExtras);
    }
    editCustomer() {
        this.dialogRef.close('edit');
    }
    closeDialog() {
        this.dialogRef.close();
    }
}
