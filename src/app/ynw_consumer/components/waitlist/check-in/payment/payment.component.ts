import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';

@Component({
    selector: 'app-consumer-payment',
    templateUrl: './payment.component.html'
})
export class ConsumerPaymentComponent implements OnInit {
    uuid: any;
    accountId: any;

    breadcrumbs;
    breadcrumb_moreoptions: any = [];
    activeWt: any;

    constructor(public router: Router,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices
    ) {
        this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
        this.route.queryParams.subscribe(
            params => {
                this.accountId = params.account_id;
            });
    }

    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'Checkin',
                url: ''
            },
            {
                title: 'Payment'
            }
        ];
        this.shared_services.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                console.log(this.activeWt);

                //   if (this.sel_ser_det.isPrePayment) {
                //     let len = this.waitlist_for.length;
                //     if (this.waitlist_for.length === 0) {
                //       len = 1;
                //     }

                //   this.liveTrack = true;
                //   this.resetApi();
            },
            () => {
            }
        );
    }
    prePaymentcheckin(retUUID) {



        // if (this.paytype !== '' && retUUID && this.sel_ser_det.isPrePayment && this.sel_ser_det.minPrePaymentAmount > 0) {
        // //   this.dialogRef.close();
        //   // this.sel_ser_det.minPrePaymentAmount
        //   const payData = {
        //     'amount': this.prepaymentAmount,
        //     // 'paymentMode': this.paytype,
        //     'uuid': retUUID,
        //     'accountId': this.accountId,
        //     'purpose': 'prePayment'
        //   };
        // //   const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
        // //     width: '50%',
        // //     panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        // //     disableClose: true,
        // //     data: {
        // //       'details': payData,
        // //       'origin': 'consumer'
        // //     }
        // //   });
        // } else {
        //   this.api_error = this.shared_functions.getProjectMesssages('CHECKIN_ERROR');
        //   this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
        //   this.api_loading = false;
        // }
        // if (this.shareLoc) {
        //   this.sharedFunctionobj.openSnackBar(this.shared_functions.getProjectMesssages('TRACKINGCANCELENABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
        // } else {
        //   this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('TRACKINGCANCELDISABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
        // }
    }

}
