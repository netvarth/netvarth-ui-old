import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { LastVisitComponent } from '../../medicalrecord/last-visit/last-visit.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ApplyLabelComponent } from '../../check-ins/apply-label/apply-label.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-customer-actions',
    templateUrl: './customer-actions.component.html',
    styleUrls: ['./customer-actions.component.css']
})
export class CustomerActionsComponent implements OnInit {
    domain;
    customerDetails: any = [];
    subdomain;
    action = '';
    providerLabels: any = [];
    loading = false;
    showMessage = false;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
     private router: Router,
        public dialog: MatDialog, private provider_shared_functions: ProviderSharedFuctions,
        public dialogRef: MatDialogRef<CustomerActionsComponent>) {
    }
    ngOnInit() {
        this.getLabel();
        this.customerDetails = this.data.customer;
        if (this.customerDetails[0].phoneNo || this.customerDetails[0].email) {
            this.showMessage = true;
        }
        if (this.data.type && this.data.type === 'label') {
            this.action = 'label';
        }
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.subdomain = user.subSector;
    }
    prescription() {
        this.closeDialog();
        const customerDetails = this.customerDetails;
        const customerId = customerDetails[0].id;
        const mrId = 0;
        const bookingType = 'FOLLOWUP';
        const bookingId = 0;
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], { queryParams: { 'calledfrom': 'patient' } });
        // const navigationExtras: NavigationExtras = {
        //     queryParams: { 'customerDetail': JSON.stringify(this.customerDetails[0]), 'mrId': 0, back_type: 'consumer', 'booking_type': 'FOLLOWUP' }
        // };
        // this.lStorageService.removeitemfromLocalStorage('mrId');
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
        // this.lStorageService.removeitemfromLocalStorage('mrId');
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
    getLabel() {
        this.loading = true;
        this.providerLabels = [];
        this.provider_services.getLabelList().subscribe((data: any) => {
            this.providerLabels = data.filter(label => label.status === 'ENABLED');
            this.loading = false;
            if (this.customerDetails.length === 1) {
                this.labelSelection();
            }
        });
    }
    gotoLabel() {
        this.router.navigate(['provider', 'settings', 'general', 'labels'], { queryParams: { source: 'customer' } });
        this.dialogRef.close();
    }
    addLabelvalue(source) {
        const labeldialogRef = this.dialog.open(ApplyLabelComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
            disableClose: true,
            autoFocus: true,
            data: {
                source: source,
            }
        });
        labeldialogRef.afterClosed().subscribe(data => {
            if (data) {
                const ids = [];
                for (const customer of this.customerDetails) {
                    ids.push(customer.id);
                }
                this.addLabel(data.label, ids);
            }
            this.getLabel();
        });
    }
    addLabeltoPatient(label, event) {
        if (event.checked) {
            const ids = [];
            for (const customer of this.customerDetails) {
                ids.push(customer.id);
            }
            this.addLabel(label, ids);
        } else {
            this.deleteLabel(label, this.customerDetails[0].id);
        }
    }
    addLabel(label, ids) {
        const postData = {
            'labelName': label,
            'labelValue': 'true',
            'proConIds': ids
        };
        this.provider_services.addLabeltoCustomer(postData).subscribe(data => {
            this.dialogRef.close();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    deleteLabel(label, id) {
        this.provider_services.deleteLabelFromCustomer(id, label).subscribe(data => {
            this.dialogRef.close();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    showLabelSection() {
        this.action = 'label';
    }
    labelSelection() {
        const values = [];
        if (this.customerDetails[0].label) {
            Object.keys(this.customerDetails[0].label).forEach(key => {
                values.push(key);
            });
            for (let i = 0; i < this.providerLabels.length; i++) {
                for (let k = 0; k < values.length; k++) {
                    if (this.providerLabels[i].label === values[k]) {
                        this.providerLabels[i].selected = true;
                    }
                }
            }
        }
    }
}
