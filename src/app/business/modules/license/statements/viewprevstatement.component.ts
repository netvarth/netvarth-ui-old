import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-viewprevstatement',
    templateUrl: './viewprevstatement.component.html'
})
export class ViewPrevStatementComponent implements OnInit {
    amount_cap = Messages.AMOUNT_CAP;
    gateway_cap = Messages.GATEWAY_CAP;
    payment_cap = Messages.PAYMENT_CAP;
    mode_cap = Messages.MODE_CAP;
    date_cap = Messages.DATE_COL_CAP;
    ref_id_cap = Messages.REF_ID_CAP;
    status_cap = Messages.COUPONS_STATUS_CAP;
    apiloading = false;
    invoice;
    jaldeeegst_data: any = [];
    serv_period = Messages.SERV_PERIOD_CAP;
    gstNumber = '';
    gstDetails: any = [];
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    credt_debtJson: any = null;
    credt_debtDetls = '';
    latestInvoiceDiscount: any = [];
    licenseDiscounts: any = null;
    pay_data = {
        amount: 0,
        uuid: null,
        refno: null,
        purpose: null
    };
    showPreviousDue = false;
    mergeinvoicerefno: any = [];
    payment_modes: any = [];
    payment_detail: any = [];
    payment_loading = false;
    bname;
    constructor(
        private activated_route: ActivatedRoute,
        private providerServices: ProviderServices,
        public shared_functions: SharedFunctions,
        private router: Router, public location: Location,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
    ) {
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.apiloading = true;
                this.getInvoiceDetails(qParams.InvoiceRefNo);
            });
    }
    ngOnInit() {
        const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
        if (bdetails) {
            this.bname = bdetails.bn || '';
        }
        this.getgst();
        this.getTaxpercentage();
    }
    getInvoiceDetails(refNo) {
        const filter = { 'invoiceRefNumber-eq': refNo };
        this.providerServices.getInvoiceStatus(filter).subscribe(data => {
            this.invoice = data[0];
            this.apiloading = false;
            this.pay_data.amount = this.invoice.amount;
            this.pay_data.uuid = this.invoice.ynwUuid;
            this.pay_data.refno = this.invoice.invoiceRefNumber;
            if (this.invoice.creditDebitJson) {
                this.credt_debtJson = this.invoice.creditDebitJson;
                this.credt_debtDetls = this.credt_debtJson.creditDebitDetails;
            }
            if (this.invoice.discount) {
                this.licenseDiscounts = this.invoice.discount;
                this.licenseDiscounts.discount.forEach(discountObj => {
                    this.latestInvoiceDiscount.push(discountObj);
                });
            }
            if (this.invoice.licensePaymentStatus === 'NotPaid') {
                this.payment_loading = true;
                this.getPaymentModes();
            } else if (this.invoice.licensePaymentStatus === 'Paid') {
                this.getPaymentDetails();
            }
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }

        );
    }
    getPaymentModes() {
        this.providerServices.getPaymentModes()
            .subscribe(
                data => {
                    this.payment_modes = data;
                    this.payment_loading = false;
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getPaymentDetails() {
        this.providerServices.getPaymentDetail(this.pay_data.uuid)
            .subscribe(
                data => {
                    this.payment_detail = data;
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }

    PreviousInvoiceReferenceNo(invoicerefno) {
        this.showPreviousDue = !this.showPreviousDue;
        this.providerServices.getMergestatement(invoicerefno).subscribe(data => {
            this.mergeinvoicerefno = data;
        });
    }
    togglePreviousDue() {
        this.showPreviousDue = !this.showPreviousDue;
    }
    getgst() {
        this.providerServices.getgst()
            .subscribe(
                data => {
                    this.jaldeeegst_data = data;
                }
            );
    }
    getTaxpercentage() {
        this.providerServices.getTaxpercentage()
            .subscribe(data => {
                this.gstDetails = data;
                if (this.gstDetails && this.gstDetails.gstNumber) {
                    this.gstNumber = this.gstDetails.gstNumber || '';
                }
            },
                () => {
                });
    }
    previousRefstmt(mergeinvoicerefno) {
        this.showPreviousDue = false;
        this.credt_debtJson = null;
        this.credt_debtDetls = '';
        this.latestInvoiceDiscount = [];
        const navigationExtras: NavigationExtras = {
            queryParams: {
                InvoiceRefNo: mergeinvoicerefno
            }
        };
        this.router.navigate(['provider', 'license', 'viewstatement'], navigationExtras);
    }
    goBack() {
        this.location.back();
    }
}
