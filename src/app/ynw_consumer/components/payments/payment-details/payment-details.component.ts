import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
    selector: 'app-consumer-payment-details',
    templateUrl: './payment-details.component.html'
})
export class ConsumerPaymentDetailsComponent implements OnInit {
    payments: any = [];
    showRefund = false;
    api_loading = false;
    donationDetails: any = [];
    questionnaire_heading = Messages.QUESTIONNAIRE_CONSUMER_HEADING;
    waitlist: any = [];
    provider_name: any;
    constructor(public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        public locationobj: Location,
        private router: Router,
        public dateformat: DateFormatPipe,
        private activated_route: ActivatedRoute,
        private dateTimeProcessor: DateTimeProcessor) {

        this.activated_route.params.subscribe(
            (qParams) => {
                this.api_loading = true;
                if (qParams.id) {
                    this.getPayments(qParams.id);
                }
            });
    }
    ngOnInit() {
    }
    gotoPrev() {
        this.locationobj.back();
    }
    getPayments(id) {
        this.shared_services.getConsumerPaymentById(id).subscribe(
            (payments) => {
                this.payments = payments;
                if (this.payments.txnType === 'Donation') {
                    this.getDonations(this.payments.ynwUuid);
                } else if (this.payments.txnType === 'Appointment') {
                    this.getApptDetails(this.payments.ynwUuid, this.payments.accountId);
                } else if (this.payments.txnType === 'Waitlist') {
                    this.getCheckinDetails(this.payments.ynwUuid, this.payments.accountId);
                } else if (this.payments.txnType === 'Order') {
                    this.getOrderDetails(this.payments.ynwUuid, this.payments.accountId);
                } else {
                    this.api_loading = false;
                }
            }
        );
    }
    stringtoDate(dt, mod) {
        let dtsarr;
        if (dt) {
            dtsarr = dt.split(' ');
            const dtarr = dtsarr[0].split('-');
            let retval = '';
            if (mod === 'all') {
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
            } else if (mod === 'date') {
                retval = this.dateformat.transformToMonthlyDate(dtarr[0] + '/' + dtarr[1] + '/' + dtarr[2]);
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
                const slots = retval.split('-');
                retval = this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
            }
            return retval;
        } else {
            return;
        }
    }
    showRefunds() {
        this.showRefund = !this.showRefund;
    }
    providerDetail(id, event) {
        event.stopPropagation();
        this.router.navigate(['searchdetail', id]);
    }
    getDonations(uuid) {
        this.shared_services.getConsumerDonationByUid(uuid).subscribe(
            (donations) => {
                this.donationDetails = donations;
                if (this.donationDetails && this.donationDetails.providerAccount) {
                    this.provider_name = this.donationDetails.providerAccount.businessName;
                }
                this.api_loading = false;
            }
        );
    }
    getApptDetails(uid, accountId) {
        this.shared_services.getAppointmentByConsumerUUID(uid, accountId).subscribe(
            (data) => {
                this.waitlist = data;
                console.log(this.waitlist);
                if (this.waitlist.provider) {
                    this.provider_name = this.waitlist.providerAccount.businessName + ',' + ((this.waitlist.provider.businessName) ?
                        this.waitlist.provider.businessName : this.waitlist.provider.firstName + ' ' + this.waitlist.provider.lastName);
                } else {
                    this.provider_name = this.waitlist.providerAccount.businessName
                }
                console.log(this.provider_name);
                this.api_loading = false;
            },
        );
    }
    getCheckinDetails(uid, accountId,) {
        this.shared_services.getCheckinByConsumerUUID(uid, accountId).subscribe(
            (data) => {
                this.waitlist = data;
                console.log(this.waitlist);
                if (this.waitlist.provider) {
                    this.provider_name = this.waitlist.providerAccount.businessName + ',' + ((this.waitlist.provider.businessName) ?
                        this.waitlist.provider.businessName : this.waitlist.provider.firstName + ' ' + this.waitlist.provider.lastName);
                } else {
                    this.provider_name = this.waitlist.providerAccount.businessName
                }
                console.log(this.provider_name);
                this.api_loading = false;
            },
        );
    }
    getOrderDetails(uid, accountId,) {
        this.shared_services.getOrderByConsumerUUID(uid, accountId).subscribe(
            (data) => {
                this.waitlist = data;
                console.log(this.waitlist);
                if (this.waitlist.provider) {
                    this.provider_name = this.waitlist.providerAccount.businessName + ',' + ((this.waitlist.provider.businessName) ?
                        this.waitlist.provider.businessName : this.waitlist.provider.firstName + ' ' + this.waitlist.provider.lastName);
                } else {
                    this.provider_name = this.waitlist.providerAccount.businessName
                }
                console.log(this.provider_name);
                this.api_loading = false;
            },
        );
    }
}
